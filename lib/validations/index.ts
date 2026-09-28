import { z } from "zod";
import { EMIRATES } from "@/lib/data/locations";
import { isValidTRN, normalisePhone, PHONE_REGEX } from "@/lib/utils/validators";

/* --------------------------------- Shared --------------------------------- */

export const phoneSchema = z
  .string()
  .trim()
  .transform(normalisePhone)
  .refine((v) => PHONE_REGEX.test(v), { error: "Enter a valid UAE mobile number, e.g. 050 123 4567" });

export const emirateSchema = z.enum(EMIRATES, { error: "Select an emirate" });

export const trnSchema = z
  .string()
  .trim()
  .refine(isValidTRN, { error: "Enter a valid 15-digit TRN" });

export const emailSchema = z.email({ error: "Enter a valid email address" }).trim().toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, { error: "Use at least 8 characters" })
  .regex(/[A-Za-z]/, { error: "Include at least one letter" })
  .regex(/\d/, { error: "Include at least one number" });

export const otpSchema = z.string().regex(/^\d{6}$/, { error: "Enter the 6-digit code" });

/* ---------------------------------- Auth ---------------------------------- */

/** Email or phone in a single field. */
export const identifierSchema = z
  .string()
  .trim()
  .min(1, { error: "Enter your email or mobile number" })
  .refine((v) => z.email().safeParse(v).success || PHONE_REGEX.test(normalisePhone(v)), {
    error: "Enter a valid email or UAE mobile number",
  });

export const loginSchema = z.object({
  identifier: identifierSchema,
  password: z.string().min(1, { error: "Enter your password" }),
  remember: z.boolean().optional(),
});

export const otpRequestSchema = z.object({ phone: phoneSchema });
export const otpVerifySchema = z.object({ phone: phoneSchema, otp: otpSchema });

export const registerSchema = z
  .object({
    accountType: z.enum(["individual", "contractor", "business"]),
    name: z.string().trim().min(2, { error: "Enter your full name" }),
    email: emailSchema,
    phone: phoneSchema,
    company: z.string().trim().optional(),
    trn: z.string().trim().optional(),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { error: "Please accept the terms to continue" }),
  })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], error: "Passwords don't match" })
  .refine((d) => d.accountType === "individual" || (d.company && d.company.length >= 2), {
    path: ["company"],
    error: "Enter your company / firm name",
  })
  .refine((d) => d.accountType !== "business" || (d.trn && isValidTRN(d.trn)), {
    path: ["trn"],
    error: "A valid TRN is required for business accounts",
  })
  .refine((d) => !d.trn || isValidTRN(d.trn), { path: ["trn"], error: "Enter a valid 15-digit TRN" });

export const forgotPasswordSchema = z.object({ identifier: identifierSchema });

export const resetPasswordSchema = z
  .object({ password: passwordSchema, confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], error: "Passwords don't match" });

export const changePasswordSchema = z
  .object({ current: z.string().min(1, { error: "Enter your current password" }), password: passwordSchema, confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], error: "Passwords don't match" });

/* -------------------------------- Checkout -------------------------------- */

export const addressSchema = z.object({
  label: z.string().trim().min(1, { error: "Give this address a label, e.g. Site A" }),
  name: z.string().trim().min(2, { error: "Enter the receiver's name" }),
  phone: phoneSchema,
  line1: z.string().trim().min(5, { error: "Enter villa / building, street" }),
  line2: z.string().trim().optional(),
  landmark: z.string().trim().optional(),
  area: z.string().trim().min(2, { error: "Enter area / community" }),
  emirate: emirateSchema,
  poBox: z.string().trim().regex(/^\d{0,7}$/, { error: "P.O. Box is digits only" }).optional(),
  unloadingNotes: z.string().trim().max(300).optional(),
  craneAccess: z.boolean().optional(),
  floor: z.coerce.number().int().min(0).max(60).optional(),
  isDefault: z.boolean().optional(),
});

export const deliveryScheduleSchema = z.object({
  date: z.string().min(1, { error: "Pick a delivery date" }),
  slot: z.enum(["morning", "afternoon", "evening"], { error: "Pick a time slot" }),
  splitDelivery: z.boolean().optional(),
});

export const billingSchema = z
  .object({
    useTrn: z.boolean(),
    trn: z.string().trim().optional(),
    businessName: z.string().trim().optional(),
  })
  .refine((d) => !d.useTrn || (d.trn && isValidTRN(d.trn)), { path: ["trn"], error: "Enter a valid TRN" })
  .refine((d) => !d.useTrn || (d.businessName && d.businessName.length >= 2), { path: ["businessName"], error: "Enter the registered business name" });

export const paymentSchema = z.object({
  method: z.enum(["card", "wallet", "bnpl", "bank-transfer", "cod", "credit"]),
});

export const couponSchema = z.object({ code: z.string().trim().toUpperCase().min(3, { error: "Enter a coupon code" }) });

/* ---------------------------------- Misc ---------------------------------- */

export const newsletterSchema = z.object({ email: emailSchema });

export const reviewSchema = z.object({
  rating: z.number().int().min(1, { error: "Select a rating" }).max(5),
  title: z.string().trim().min(3, { error: "Add a short title" }).max(80),
  body: z.string().trim().min(20, { error: "Tell us a bit more (20+ characters)" }).max(2000),
});

export const questionSchema = z.object({ question: z.string().trim().min(10, { error: "Please add more detail" }).max(500) });

export const bulkEnquirySchema = z.object({
  name: z.string().trim().min(2, { error: "Enter your name" }),
  company: z.string().trim().optional(),
  email: emailSchema,
  phone: phoneSchema,
  projectName: z.string().trim().min(2, { error: "Enter a project name" }),
  projectType: z.enum(["Residential", "Commercial", "Renovation", "Infrastructure"]),
  area: z.string().trim().min(2, { error: "Enter the project area" }),
  emirate: emirateSchema,
  requiredBy: z.string().optional(),
  items: z
    .array(z.object({ product: z.string().trim().min(2, { error: "Enter material" }), quantity: z.coerce.number().positive({ error: "Qty > 0" }), unit: z.string().min(1) }))
    .min(1, { error: "Add at least one material" }),
  notes: z.string().trim().max(1000).optional(),
  trn: z.string().trim().optional().refine((v) => !v || isValidTRN(v), { error: "Enter a valid TRN" }),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, { error: "Enter your name" }),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal("")),
  subject: z.string().trim().min(3, { error: "Add a subject" }),
  message: z.string().trim().min(10, { error: "Message is too short" }).max(2000),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, { error: "Enter your name" }),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().trim().optional(),
  trn: z.string().trim().optional().refine((v) => !v || isValidTRN(v), { error: "Enter a valid TRN" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type BulkEnquiryInput = z.infer<typeof bulkEnquirySchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type AddressFormValues = z.input<typeof addressSchema>;
export type BulkEnquiryFormValues = z.input<typeof bulkEnquirySchema>;
