import { normalizeDRPhoneNumber } from './normalizePhoneNumber';

/**
 * Generates a WhatsApp URL with a normalized phone number
 * and a properly encoded message.
 */
export const generateWhatsAppMessage = (
  rawPhoneNumber: string,
  message: string
): string => {
  const phone = normalizeDRPhoneNumber(rawPhoneNumber);
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

export const generateContactWhatsAppMessage = (name: string, email: string, phone: string, message: string) => {
    const contactMessage = `Hello, my name is ${name}. Email: ${email}. Phone: ${phone}. Message: ${message}`;
    const encodedMessage = encodeURIComponent(contactMessage);
    return `https://wa.me/${normalizeDRPhoneNumber(phone)}?text=${encodedMessage}`;
};
