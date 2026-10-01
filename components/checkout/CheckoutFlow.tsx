"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Building2, CalendarClock, Check, CreditCard, HandCoins, Landmark, Lock, MapPin, Pencil, Plus, ShoppingCart, Smartphone, Truck } from "lucide-react";
import type { Address, PaymentMethod, User } from "@/types";
import { addressSchema, type AddressFormValues, type AddressInput } from "@/lib/validations";
import { useCart } from "@/store/cart";
import { toast } from "@/store/toast";
import { computeCartTotals, lineTotal } from "@/lib/utils/cart";
import { formatDate, formatAED } from "@/lib/utils/format";
import { formatQty } from "@/lib/utils/units";
import { formatPhone, isValidTRN } from "@/lib/utils/validators";
import { EMIRATES, formatAddressArea } from "@/lib/data/locations";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, RadioCard } from "@/components/ui/Checkbox";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { cn } from "@/lib/utils/cn";

const SLOTS = [
  { value: "morning", label: "Morning", time: "8 AM – 12 PM" },
  { value: "afternoon", label: "Afternoon", time: "12 – 4 PM" },
  { value: "evening", label: "Evening", time: "4 – 7 PM", parcelOnly: true },
] as const;

type Step = 1 | 2 | 3 | 4 | 5;

/** Next 7 bookable delivery dates, starting 2 days out. */
function upcomingDeliveryDays() {
  const start = new Date();
  return Array.from({ length: 7 }, (_, i) => new Date(start.getTime() + (i + 2) * 86_400_000).toISOString());
}

export interface LastOrder {
  number: string;
  total: number;
  items: { name: string; qty: string; image: string }[];
  address: string;
  date: string;
  slot: string;
  payment: string;
}

function StepShell({ n, step, setStep, title, summary, children }: { n: Step; step: Step; setStep: (s: Step) => void; title: string; summary?: React.ReactNode; children: React.ReactNode }) {
  const done = step > n;
  const open = step === n;
  return (
    <section className={cn("rounded-xl border bg-surface shadow-card", open ? "border-primary-600" : "border-border")} aria-labelledby={`step-${n}`}>
      <header className="flex items-center gap-3 p-4 sm:p-5">
        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold", done ? "bg-success text-white" : open ? "bg-primary-800 text-white" : "bg-surface-muted text-muted-foreground")}>
          {done ? <Check className="size-4" aria-hidden /> : n}
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`step-${n}`} className={cn("text-base font-bold", open || done ? "text-foreground" : "text-muted-foreground")}>{title}</h2>
          {done && summary && <div className="mt-0.5 truncate text-xs text-muted-foreground">{summary}</div>}
        </div>
        {done && (
          <button type="button" onClick={() => setStep(n)} className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-200">
            <Pencil className="size-3.5" aria-hidden /> Change
          </button>
        )}
      </header>
      {open && <div className="border-t border-border p-4 sm:p-5">{children}</div>}
    </section>
  );
}

export function CheckoutFlow({ user, savedAddresses }: { user: User; savedAddresses: Address[] }) {
  const hydrated = useHydrated();
  const router = useRouter();
  const { items, couponCode, clear } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [addresses, setAddresses] = useState(savedAddresses);
  const [addressId, setAddressId] = useState(savedAddresses.find((a) => a.isDefault)?.id ?? savedAddresses[0]?.id);
  const [adding, setAdding] = useState(savedAddresses.length === 0);
  const [days] = useState(upcomingDeliveryDays);
  const [date, setDate] = useState(days[0]!);
  const [slot, setSlot] = useState<string>("morning");
  const [split, setSplit] = useState(false);
  const [useTrn, setUseTrn] = useState(!!user.trn);
  const [trn, setTrn] = useState(user.trn ?? "");
  const [business, setBusiness] = useState(user.company ?? "");
  const [vatErr, setVatErr] = useState<string>();
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [placing, setPlacing] = useState(false);

  const address = addresses.find((a) => a.id === addressId);
  const placeOfSupply = address?.emirate ?? "Dubai";
  const totals = computeCartTotals(items, { couponCode });
  const hasTruck = totals.groups.some((g) => g.type === "truck");

  const form = useForm<AddressFormValues, unknown, AddressInput>({ resolver: zodResolver(addressSchema), defaultValues: { label: "Site", name: user.name, phone: user.phone, emirate: "Dubai", craneAccess: false } });

  if (!hydrated) return <Skeleton className="h-96 rounded-xl" />;
  if (!items.length)
    return (
      <div className="rounded-2xl border border-border bg-surface">
        <EmptyState icon={<ShoppingCart aria-hidden />} title="Your cart is empty" description="Add products to your cart to check out." actions={<ButtonLink href="/products">Browse products</ButtonLink>} />
      </div>
    );

  const saveAddress = form.handleSubmit((v) => {
    const a: Address = { ...v, id: `addr-new-${addresses.length + 1}` };
    setAddresses((x) => [...x, a]);
    setAddressId(a.id);
    setAdding(false);
    form.reset();
    toast({ title: "Address saved" });
  });

  const submitBilling = () => {
    if (useTrn) {
      if (!isValidTRN(trn)) return setVatErr("Enter a valid 15-digit TRN");
      if (business.trim().length < 2) return setVatErr("Enter the registered business name");
    }
    setVatErr(undefined);
    setStep(4);
  };

  const place = async () => {
    setPlacing(true);
    const res = await fetch("/api/orders", { method: "POST" });
    const d = await res.json();
    if (!res.ok) {
      setPlacing(false);
      toast({ tone: "error", title: d.error ?? "Could not place order" });
      return;
    }
    const last: LastOrder = {
      number: d.number,
      total: totals.grandTotal,
      items: items.map((i) => ({ name: i.name, qty: formatQty(i.quantity, i.unit), image: i.image })),
      address: address ? `${address.label} — ${address.line1}, ${formatAddressArea(address)}` : "",
      date,
      slot: SLOTS.find((s) => s.value === slot)?.time ?? "",
      payment: PAYMENTS.find((p) => p.value === payment)?.label ?? payment,
    };
    try {
      sessionStorage.setItem("bm-last-order", JSON.stringify(last));
    } catch {}
    clear();
    router.push(`/checkout/success?order=${d.number}`);
  };

  const PAYMENTS: { value: PaymentMethod; label: string; desc: string; icon: React.ReactNode; disabled?: boolean }[] = [
    { value: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, American Express", icon: <CreditCard /> },
    { value: "wallet", label: "Apple Pay / Google Pay", desc: "Pay in one tap on your phone", icon: <Smartphone /> },
    { value: "bnpl", label: "Tabby — pay in 4", desc: totals.grandTotal > 5000 ? "Available for orders up to AED 5,000" : `4 interest-free payments of ${formatAED(totals.grandTotal / 4)}`, icon: <CalendarClock />, disabled: totals.grandTotal > 5000 },
    { value: "bank-transfer", label: "Bank Transfer", desc: "Emirates NBD, ADCB, FAB, Mashreq and all UAE banks", icon: <Landmark /> },
    { value: "cod", label: "Cash on Delivery", desc: totals.grandTotal > 2500 ? "Available for orders up to AED 2,500" : "Pay when material arrives", icon: <Banknote />, disabled: totals.grandTotal > 2500 },
    {
      value: "credit",
      label: "Smart-MEP Credit (Pay Later)",
      desc: user.isVerifiedContractor ? `30-day credit · limit ${formatAED(user.creditLimit ?? 0)}` : "For verified contractors only",
      icon: <HandCoins />,
      disabled: !user.isVerifiedContractor,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      <div className="space-y-4">
        {/* 1. Address */}
        <StepShell step={step} setStep={setStep} n={1} title="Delivery address" summary={address && `${address.label} · ${address.line1}, ${address.area}, ${address.emirate}`}>
          {addresses.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {addresses.map((a) => (
                <RadioCard
                  key={a.id}
                  name="address"
                  checked={addressId === a.id}
                  onChange={() => setAddressId(a.id)}
                  icon={a.label.toLowerCase().includes("office") ? <Building2 /> : <MapPin />}
                  label={a.label}
                  description={
                    <>
                      {a.name} · {formatPhone(a.phone)}
                      <br />
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ""}, {formatAddressArea(a)}
                      {a.unloadingNotes && <span className="mt-1 block italic">“{a.unloadingNotes}”</span>}
                    </>
                  }
                />
              ))}
            </div>
          )}
          {adding ? (
            <form onSubmit={saveAddress} noValidate className="mt-4 grid gap-4 rounded-xl bg-surface-muted p-4 sm:grid-cols-2">
              <p className="text-sm font-semibold text-foreground sm:col-span-2">New site address</p>
              <Input label="Label" placeholder="Site A / Home / Office" required error={form.formState.errors.label?.message} {...form.register("label")} />
              <Input label="Receiver name" required error={form.formState.errors.name?.message} {...form.register("name")} />
              <Input label="Mobile" inputMode="tel" placeholder="050 123 4567" required error={form.formState.errors.phone?.message} {...form.register("phone")} />
              <Select label="Emirate" required options={EMIRATES.map((s) => ({ value: s, label: s }))} error={form.formState.errors.emirate?.message} {...form.register("emirate")} />
              <Input label="Villa / building, street" placeholder="Villa 12, Street 4" required containerClassName="sm:col-span-2" error={form.formState.errors.line1?.message} {...form.register("line1")} />
              <Input label="Area / community" placeholder="e.g. Al Barsha" required error={form.formState.errors.area?.message} {...form.register("area")} />
              <Input label="Plot no. / Makani (optional)" {...form.register("line2")} />
              <Input label="Landmark" {...form.register("landmark")} />
              <Input label="P.O. Box (optional)" inputMode="numeric" error={form.formState.errors.poBox?.message} {...form.register("poBox")} />
              <Input label="Delivery floor" type="number" min={0} placeholder="0 = ground" {...form.register("floor")} />
              <div className="flex items-end pb-1">
                <Checkbox label="Crane / hoist access available" {...form.register("craneAccess")} />
              </div>
              <Textarea label="Unloading notes" rows={2} placeholder="e.g. Narrow lane — send smaller vehicle; unload near east gate" containerClassName="sm:col-span-2" {...form.register("unloadingNotes")} />
              <div className="flex gap-3 sm:col-span-2">
                <Button type="submit">Save address</Button>
                {addresses.length > 0 && <Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>}
              </div>
            </form>
          ) : (
            <button type="button" onClick={() => setAdding(true)} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-200">
              <Plus className="size-4" aria-hidden /> Add a new site address
            </button>
          )}
          <Button className="mt-4 w-full sm:w-auto" disabled={!address || adding} onClick={() => setStep(2)}>
            Deliver here
          </Button>
        </StepShell>

        {/* 2. Schedule */}
        <StepShell step={step} setStep={setStep} n={2} title="Delivery schedule" summary={`${formatDate(date, { weekday: "short", day: "numeric", month: "short" })} · ${SLOTS.find((s) => s.value === slot)?.time}${split ? " · split delivery" : ""}`}>
          <p className="mb-2 text-sm font-semibold text-foreground">Choose a date</p>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="radiogroup" aria-label="Delivery date">
            {days.map((d) => {
              const dt = new Date(d);
              const active = d === date;
              return (
                <button key={d} type="button" role="radio" aria-checked={active} onClick={() => setDate(d)} className={cn("flex w-16 shrink-0 flex-col items-center rounded-xl border py-2.5", active ? "border-primary-800 bg-primary-800 text-white" : "border-border bg-surface text-foreground hover:border-primary-600")}>
                  <span className="text-[11px] uppercase opacity-80">{dt.toLocaleDateString("en-AE", { weekday: "short" })}</span>
                  <span className="font-display text-lg font-bold">{dt.getDate()}</span>
                  <span className="text-[11px] opacity-80">{dt.toLocaleDateString("en-AE", { month: "short" })}</span>
                </button>
              );
            })}
          </div>
          <p className="mb-2 mt-5 text-sm font-semibold text-foreground">Time slot</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {SLOTS.map((s) => {
              const disabled = "parcelOnly" in s && hasTruck;
              return <RadioCard key={s.value} name="slot" checked={slot === s.value} disabled={disabled} onChange={() => setSlot(s.value)} label={s.label} description={disabled ? "Not available for truck delivery" : s.time} />;
            })}
          </div>
          {totals.groups.length > 1 && (
            <div className="mt-4 rounded-lg bg-surface-muted p-3">
              <Checkbox checked={split} onChange={(e) => setSplit(e.target.checked)} label="Split delivery" description="Parcel items arrive as soon as they're ready; truck items on the selected slot." />
            </div>
          )}
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Truck className="size-4" aria-hidden /> Our dispatcher will call 1 hour before arrival.</p>
          <Button className="mt-4 w-full sm:w-auto" onClick={() => setStep(3)}>Continue</Button>
        </StepShell>

        {/* 3. Billing */}
        <StepShell step={step} setStep={setStep} n={3} title="Billing & VAT" summary={useTrn ? `VAT invoice · ${trn}` : "Personal invoice"}>
          <Checkbox checked={useTrn} onChange={(e) => setUseTrn(e.target.checked)} label="Use TRN for business invoice" description="Get a tax invoice to recover input VAT" />
          {useTrn && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input label="TRN" value={trn} maxLength={15} inputMode="numeric" onChange={(e) => setTrn(e.target.value.replace(/\D/g, ""))} placeholder="100234567800003" error={vatErr && !isValidTRN(trn) ? vatErr : undefined} hint={isValidTRN(trn) ? "✓ Valid TRN" : "15 digits, starts with 100"} />
              <Input label="Registered business name" value={business} onChange={(e) => setBusiness(e.target.value)} error={vatErr && business.trim().length < 2 ? vatErr : undefined} />
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">Billing address is the same as the delivery address. Place of supply: {placeOfSupply}, UAE.</p>
          <Button className="mt-4 w-full sm:w-auto" onClick={submitBilling}>Continue</Button>
        </StepShell>

        {/* 4. Payment */}
        <StepShell step={step} setStep={setStep} n={4} title="Payment method" summary={PAYMENTS.find((p) => p.value === payment)?.label}>
          <div className="grid gap-3">
            {PAYMENTS.map((p) => (
              <RadioCard key={p.value} name="payment" checked={payment === p.value} disabled={p.disabled} onChange={() => setPayment(p.value)} icon={p.icon} label={p.label} description={p.desc} />
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3.5" aria-hidden /> Payments are processed securely. This demo does not charge you.</p>
          <Button className="mt-4 w-full sm:w-auto" onClick={() => setStep(5)}>Review order</Button>
        </StepShell>

        {/* 5. Review */}
        <StepShell step={step} setStep={setStep} n={5} title="Review & place order">
          <ul className="divide-y divide-border">
            {items.map((i) => (
              <li key={i.key} className="flex items-center gap-3 py-3">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface-muted"><Image src={i.image} alt="" fill sizes="48px" className="object-cover" /></span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-sm font-medium text-foreground">{i.name}</span>
                  <span className="text-xs text-muted-foreground">{formatQty(i.quantity, i.unit)}</span>
                </span>
                <span className="text-sm font-semibold tabular-nums text-foreground">{formatAED(lineTotal(i))}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 grid gap-3 rounded-lg bg-surface-muted p-4 text-sm sm:grid-cols-2">
            <div><dt className="text-xs text-muted-foreground">Deliver to</dt><dd className="font-medium text-foreground">{address?.label}, {address?.area}, {address?.emirate}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Schedule</dt><dd className="font-medium text-foreground">{formatDate(date, { weekday: "short", day: "numeric", month: "short" })}, {SLOTS.find((s) => s.value === slot)?.time}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Invoice</dt><dd className="font-medium text-foreground">{useTrn ? `VAT · ${trn}` : "Personal"}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Payment</dt><dd className="font-medium text-foreground">{PAYMENTS.find((p) => p.value === payment)?.label}</dd></div>
          </dl>
          <Button variant="accent" size="lg" fullWidth className="mt-5" loading={placing} loadingText="Placing order…" onClick={place}>
            Place order · {formatAED(totals.grandTotal)}
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">By placing this order you agree to our Terms and Return Policy.</p>
        </StepShell>
      </div>

      <aside className="lg:sticky lg:top-32">
        <OrderSummary totals={totals} placeOfSupply={placeOfSupply} />
      </aside>
    </div>
  );
}
