"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import type { z } from "zod";
import { contactSchema } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export function ContactForm({ subject = "" }: { subject?: string }) {
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState } = useForm<z.input<typeof contactSchema>, unknown, z.output<typeof contactSchema>>({ resolver: zodResolver(contactSchema), defaultValues: { subject } });
  const e = formState.errors;
  const onSubmit = handleSubmit(async (v) => {
    await fetch("/api/enquiry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(v) });
    setDone(true);
  });
  if (done)
    return (
      <div className="py-10 text-center" role="status">
        <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden />
        <p className="mt-3 text-lg font-bold text-foreground">Message sent</p>
        <p className="mt-1 text-sm text-muted-foreground">We usually reply within a few hours on working days.</p>
      </div>
    );
  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Input label="Name" required error={e.name?.message} {...register("name")} />
      <Input label="Email" type="email" required error={e.email?.message} {...register("email")} />
      <Input label="Mobile (optional)" inputMode="tel" error={e.phone?.message} {...register("phone")} />
      <Input label="Subject" required error={e.subject?.message} {...register("subject")} />
      <Textarea label="Message" required rows={5} containerClassName="sm:col-span-2" error={e.message?.message} {...register("message")} />
      <Button type="submit" className="sm:w-fit" loading={formState.isSubmitting}>Send message</Button>
    </form>
  );
}
