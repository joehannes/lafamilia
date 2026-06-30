/**
 * Normalizes a Dominican Republic phone number
 * into WhatsApp E.164-compatible format (digits only).
 *
 * Examples:
 *  - "829 1234567"        → "18291234567"
 *  - "+1 (829) 123-4567" → "18291234567"
 *  - "8091234567"        → "18091234567"
 */
export const normalizeDRPhoneNumber = (input: string | null | undefined): string => {
  if (!input) return '';

  // 1. Remove everything except digits
  const digitsInput = String(input);
  let digits = digitsInput.replace(/\D/g, '');

  // 2. If number starts with DR area code without country code (809, 829, 849)
  if (digits.length === 10 && /^(809|829|849)/.test(digits)) {
    return `1${digits}`;
  }

  // 3. If already includes country code
  if (digits.length === 11 && digits.startsWith('1')) {
    return digits;
  }

  // 4. If user entered 9-digit local number (rare but possible)
  if (digits.length === 9) {
    return `18${digits}`;
  }

  // 5. Fallback: assume missing country code
  if (digits.length > 10 && !digits.startsWith('1')) {
    return `1${digits.slice(-10)}`;
  }

  // 6. As a last resort, return digits (still better than nothing)
  return digits;
};
