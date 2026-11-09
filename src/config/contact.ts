/**
 * Configuration and utilities for SERADIP (Sedulur Serang Diponegoro) consultation contact.
 * Renders WhatsApp consultation link if contact is configured and ready.
 */

export interface ContactConfig {
  phone: string;
  name: string;
  defaultMessagePrefix: string;
}

export const CONTACT_CONFIG: ContactConfig = {
  // Configurable via environment variable; if empty, consultation placements are hidden gracefully
  phone: process.env.NEXT_PUBLIC_SERADIP_WA || '',
  name: 'SERADIP',
  defaultMessagePrefix: 'Halo Kak SERADIP, saya ingin konsultasi mengenai pilihan program studi UNDIP:',
};

/**
 * Returns true if contact credentials are ready and valid.
 * Placements MUST render nothing if isContactReady() is false.
 */
export function isContactReady(): boolean {
  return Boolean(CONTACT_CONFIG.phone && CONTACT_CONFIG.phone.replace(/[^0-9]/g, '').length >= 10);
}

/**
 * Constructs an authenticated, user-editable WhatsApp deep link.
 * No user data is sent automatically; the user previews and edits before sending.
 */
export function buildWaLink(message: string): string {
  if (!isContactReady()) return '#';
  const cleanPhone = CONTACT_CONFIG.phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
