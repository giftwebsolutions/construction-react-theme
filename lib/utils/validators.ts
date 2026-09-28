/** UAE Tax Registration Number: 15 digits, issued starting with "100". */
export const TRN_REGEX = /^100\d{12}$/;

/** UAE mobile (without +971 / leading 0): 5X XXX XXXX. */
export const PHONE_REGEX = /^5[0-9]{8}$/;

/** Strips spaces, "+971", "00971" or a leading trunk "0" so 050 123 4567 and +971 50 123 4567 both normalise to 501234567. */
export const normalisePhone = (v: string) => v.replace(/\D/g, "").replace(/^(00971|971|0)/, "");

export const isValidPhone = (v: string) => PHONE_REGEX.test(normalisePhone(v));

export const isValidTRN = (raw: string) => TRN_REGEX.test(raw.replace(/\s/g, ""));

/** 050 123 4567 */
export const formatPhone = (v: string) => {
  const n = normalisePhone(v);
  return n.length === 9 ? `+971 ${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5)}` : v;
};

export function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) && pw.length >= 10) score++;
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"] as const;
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score]! };
}
