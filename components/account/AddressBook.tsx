"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Construction, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import type { Address } from "@/types";
import { addressSchema, type AddressFormValues, type AddressInput } from "@/lib/validations";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { toast } from "@/store/toast";
import { SAUDI_REGIONS, formatAddressArea } from "@/lib/data/locations";
import { formatPhone } from "@/lib/utils/validators";

export function AddressBook({ initial }: { initial: Address[] }) {
  const [list, setList] = useState(initial);
  const [editing, setEditing] = useState<Address | "new" | null>(null);
  const form = useForm<AddressFormValues, unknown, AddressInput>({ resolver: zodResolver(addressSchema) });
  const e = form.formState.errors;

  const open = (a: Address | "new") => {
    setEditing(a);
    form.reset(a === "new" ? { label: "", name: "", phone: "", line1: "", area: "", emirate: "Riyadh", craneAccess: false } : a);
  };
  const save = form.handleSubmit((v) => {
    setList((l) => {
      let next = editing === "new" ? [...l, { ...v, id: `addr-${Date.now()}` }] : l.map((x) => (x.id === (editing as Address).id ? { ...x, ...v } : x));
      if (v.isDefault) next = next.map((x) => ({ ...x, isDefault: x.label === v.label && x.line1 === v.line1 }));
      return next;
    });
    toast({ title: editing === "new" ? "Address added" : "Address updated" });
    setEditing(null);
  });

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((a) => (
          <article key={a.id} className="flex flex-col rounded-xl border border-border bg-surface p-5 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <p className="flex items-center gap-2 font-semibold text-foreground">
                {a.label.toLowerCase().includes("office") ? <Building2 className="size-4.5 text-primary-700 dark:text-primary-200" aria-hidden /> : a.label.toLowerCase().includes("site") ? <Construction className="size-4.5 text-accent-600" aria-hidden /> : <MapPin className="size-4.5" aria-hidden />}
                {a.label}
              </p>
              {a.isDefault && <Badge tone="success">Default</Badge>}
            </div>
            <p className="mt-2 text-sm text-foreground">{a.name} · {formatPhone(a.phone)}</p>
            <p className="text-sm text-muted-foreground">{a.line1}{a.line2 ? `, ${a.line2}` : ""}{a.landmark ? `, ${a.landmark}` : ""}<br />{formatAddressArea(a)}</p>
            {(a.unloadingNotes || a.craneAccess || a.floor) && (
              <p className="mt-2 rounded-lg bg-surface-muted p-2 text-xs text-muted-foreground">
                {a.unloadingNotes}
                {a.craneAccess ? " · Crane access" : ""}
                {a.floor ? ` · Floor ${a.floor}` : ""}
              </p>
            )}
            <div className="mt-auto flex gap-2 pt-4">
              <Button size="sm" variant="outline" leftIcon={<Pencil className="size-3.5" aria-hidden />} onClick={() => open(a)}>Edit</Button>
              <Button size="sm" variant="ghost" className="text-danger" leftIcon={<Trash2 className="size-3.5" aria-hidden />} onClick={() => { setList((l) => l.filter((x) => x.id !== a.id)); toast({ tone: "info", title: "Address removed" }); }}>Remove</Button>
            </div>
          </article>
        ))}
        <button type="button" onClick={() => open("new")} className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm font-semibold text-primary-700 hover:border-primary-600 hover:bg-surface dark:text-primary-200">
          <Plus className="size-6" aria-hidden /> Add new address
        </button>
      </div>
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add address" : "Edit address"} size="lg" footer={<><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save address</Button></>}>
        <form onSubmit={save} noValidate className="grid gap-4 sm:grid-cols-2">
          <Input label="Label" placeholder="Home / Site A / Office" required error={e.label?.message} {...form.register("label")} />
          <Input label="Receiver name" required error={e.name?.message} {...form.register("name")} />
          <Input label="Mobile" inputMode="tel" placeholder="050 123 4567" required error={e.phone?.message} {...form.register("phone")} />
          <Select label="Region" required options={SAUDI_REGIONS.map((s) => ({ value: s, label: s }))} error={e.emirate?.message} {...form.register("emirate")} />
          <Input label="Villa / building, street" placeholder="Villa 12, Street 4" required containerClassName="sm:col-span-2" error={e.line1?.message} {...form.register("line1")} />
          <Input label="Area / community" placeholder="e.g. Al Barsha" required error={e.area?.message} {...form.register("area")} />
          <Input label="Plot no. / Makani (optional)" {...form.register("line2")} />
          <Input label="Landmark" {...form.register("landmark")} />
          <Input label="P.O. Box (optional)" inputMode="numeric" error={e.poBox?.message} {...form.register("poBox")} />
          <Input label="Delivery floor" type="number" min={0} {...form.register("floor")} />
          <div className="flex items-end"><Checkbox label="Crane / hoist access" {...form.register("craneAccess")} /></div>
          <Textarea label="Unloading notes" rows={2} containerClassName="sm:col-span-2" {...form.register("unloadingNotes")} />
          <Checkbox label="Set as default address" containerClassName="sm:col-span-2" {...form.register("isDefault")} />
        </form>
      </Modal>
    </>
  );
}
