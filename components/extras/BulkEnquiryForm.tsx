"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, FileSpreadsheet, Plus, Trash2, Upload, X } from "lucide-react";
import { bulkEnquirySchema, type BulkEnquiryFormValues, type BulkEnquiryInput } from "@/lib/validations";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { EMIRATES } from "@/lib/data/locations";
import { Select } from "@/components/ui/Select";

const UNITS = ["bag", "tonne", "kg", "piece", "sqft", "cft", "box", "litre", "load"];

export function BulkEnquiryForm({ initialItem, user }: { initialItem?: string; user?: { name: string; email: string; phone: string; company?: string; trn?: string } | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [fileErr, setFileErr] = useState<string>();
  const [ref, setRef] = useState<string | null>(null);
  const { register, control, handleSubmit, formState } = useForm<BulkEnquiryFormValues, unknown, BulkEnquiryInput>({
    resolver: zodResolver(bulkEnquirySchema),
    defaultValues: {
      name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "", company: user?.company ?? "", trn: user?.trn ?? "",
      projectName: "", projectType: "Residential", area: "", emirate: "Dubai",
      items: [{ product: initialItem ?? "", quantity: 1, unit: "bag" }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const e = formState.errors;

  const onFile = (f: File | undefined) => {
    setFileErr(undefined);
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) return setFileErr("File must be under 10 MB");
    if (!/\.(pdf|xlsx?|csv|jpe?g|png)$/i.test(f.name)) return setFileErr("Upload a PDF, Excel, CSV or image file");
    setFile(f);
  };

  const onSubmit = handleSubmit(async (values) => {
    const fd = new FormData();
    fd.append("data", JSON.stringify(values));
    if (file) fd.append("boq", file);
    const d = await fetch("/api/enquiry", { method: "POST", body: fd }).then((r) => r.json());
    setRef(d.reference);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (ref)
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto size-14 text-success" aria-hidden />
        <h2 className="mt-4 text-2xl font-bold text-foreground">Quote request received</h2>
        <p className="mt-2 text-muted-foreground">Reference <strong className="font-mono text-foreground">{ref}</strong>. Our materials team will call you within 2 working hours with a consolidated quote.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/account/quotes">Track in My Quotes</ButtonLink>
          <ButtonLink href="/products" variant="outline">Continue shopping</ButtonLink>
        </div>
      </div>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <section className="rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-base font-bold text-foreground">1. Your details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Full name" required error={e.name?.message} {...register("name")} />
          <Input label="Company / firm" {...register("company")} />
          <Input label="Email" type="email" required error={e.email?.message} {...register("email")} />
          <Input label="Mobile" inputMode="tel" required error={e.phone?.message} {...register("phone")} />
          <Input label="TRN (optional)" maxLength={15} className="uppercase" error={e.trn?.message} {...register("trn")} />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-base font-bold text-foreground">2. Project</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Project name" placeholder="e.g. G+1 villa, Al Barsha South" required error={e.projectName?.message} {...register("projectName")} />
          <Select label="Project type" options={["Residential", "Commercial", "Renovation", "Infrastructure"].map((v) => ({ value: v, label: v }))} {...register("projectType")} />
          <Input label="Site area / community" placeholder="e.g. Dubai South" required error={e.area?.message} {...register("area")} />
          <Select label="Emirate" options={EMIRATES.map((v) => ({ value: v, label: v }))} error={e.emirate?.message} {...register("emirate")} />
          <Input label="Material required by" type="date" {...register("requiredBy")} />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-base font-bold text-foreground">3. Materials</h2>
        <p className="mt-1 text-sm text-muted-foreground">Upload your BOQ, list materials below, or both.</p>
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-muted px-4 py-8 text-center hover:border-primary-600" onDragOver={(ev) => ev.preventDefault()} onDrop={(ev) => { ev.preventDefault(); onFile(ev.dataTransfer.files[0]); }}>
          <input type="file" className="sr-only" accept=".pdf,.xls,.xlsx,.csv,.jpg,.jpeg,.png" onChange={(ev) => onFile(ev.target.files?.[0])} />
          {file ? (
            <span className="flex items-center gap-3 text-sm">
              <FileSpreadsheet className="size-8 text-success" aria-hidden />
              <span className="text-left"><span className="block font-semibold text-foreground">{file.name}</span><span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span></span>
              <button type="button" onClick={(ev) => { ev.preventDefault(); setFile(null); }} className="rounded-full p-1.5 hover:bg-surface" aria-label="Remove file"><X className="size-4" aria-hidden /></button>
            </span>
          ) : (
            <>
              <Upload className="size-8 text-primary-700 dark:text-primary-200" aria-hidden />
              <span className="mt-2 text-sm font-semibold text-foreground">Upload BOQ / drawing</span>
              <span className="text-xs text-muted-foreground">PDF, Excel, CSV or photo · up to 10 MB · tap or drag & drop</span>
            </>
          )}
        </label>
        {fileErr && <p role="alert" className="mt-2 text-xs font-medium text-danger">{fileErr}</p>}

        <ul className="mt-5 space-y-3">
          {fields.map((f, i) => (
            <li key={f.id} className="grid grid-cols-[1fr_auto] gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_120px_120px_auto] sm:items-start sm:border-0 sm:p-0">
              <Input aria-label={`Material ${i + 1}`} placeholder="Material, e.g. OPC 53 cement" containerClassName="col-span-2 sm:col-span-1" error={e.items?.[i]?.product?.message} {...register(`items.${i}.product`)} />
              <Input aria-label="Quantity" inputMode="decimal" placeholder="Qty" error={e.items?.[i]?.quantity?.message} {...register(`items.${i}.quantity`)} />
              <div className="flex gap-2 sm:contents">
                <Select aria-label="Unit" containerClassName="flex-1" options={UNITS.map((u) => ({ value: u, label: u }))} {...register(`items.${i}.unit`)} />
                <Button variant="ghost" size="icon" onClick={() => remove(i)} disabled={fields.length === 1} aria-label={`Remove material ${i + 1}`}><Trash2 className="size-4" aria-hidden /></Button>
              </div>
            </li>
          ))}
        </ul>
        <Button variant="outline" size="sm" className="mt-3" leftIcon={<Plus className="size-4" aria-hidden />} onClick={() => append({ product: "", quantity: 1, unit: "bag" })}>Add material</Button>
        {e.items?.root && <p role="alert" className="mt-2 text-xs text-danger">{e.items.root.message}</p>}
        <Textarea label="Notes for our team" rows={3} containerClassName="mt-5" placeholder="Brand preferences, delivery phases, site access…" {...register("notes")} />
      </section>

      <Button type="submit" variant="accent" size="lg" fullWidth className="sm:w-auto" loading={formState.isSubmitting} loadingText="Submitting…">Request quote</Button>
    </form>
  );
}
