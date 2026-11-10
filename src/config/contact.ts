/**
 * Configuration and utilities for SERADIP (Sedulur Serang Diponegoro) consultation contact.
 * Renders WhatsApp consultation link and Instagram profile if contact is configured and ready.
 */

import { APP_NAME } from './brand';

export interface ContactPerson {
  id: string;
  name: string;
  wa: string;
  display: string;
}

export const CONTACTS: ContactPerson[] = [
  {
    id: 'dian',
    name: 'Dian',
    wa: process.env.NEXT_PUBLIC_SERADIP_WA_DIAN || '6287741097976',
    display: '+62 877-4109-7976',
  },
  {
    id: 'cindy',
    name: 'Cindy',
    wa: process.env.NEXT_PUBLIC_SERADIP_WA_CINDY || '6282210644934',
    display: '+62 822-1064-4934',
  },
];

export const INSTAGRAM = {
  handle: '@sedulurdiponegoro',
  url: 'https://www.instagram.com/sedulurdiponegoro/',
};

export interface ContactConfig {
  phone: string;
  name: string;
  defaultMessagePrefix: string;
}

export const CONTACT_CONFIG: ContactConfig = {
  // Configurable via environment variable; defaults to primary contact Dian
  phone: process.env.NEXT_PUBLIC_SERADIP_WA || CONTACTS[0].wa,
  name: 'SERADIP',
  defaultMessagePrefix: `Halo Kak SERADIP, saya ingin konsultasi mengenai pilihan program studi UNDIP (${APP_NAME}):`,
};

/**
 * Returns true if contact credentials are ready and valid (>= 10 digits).
 * Placements MUST render nothing if isContactReady() is false.
 */
export function isContactReady(contactId?: string): boolean {
  if (contactId) {
    const person = CONTACTS.find((c) => c.id === contactId);
    if (!person) return false;
    const clean = person.wa.replace(/[^0-9]/g, '');
    return clean.length >= 10;
  }
  return CONTACTS.some((c) => c.wa.replace(/[^0-9]/g, '').length >= 10);
}

/**
 * Constructs an authenticated, user-editable WhatsApp deep link.
 * Format: https://wa.me/<number>?text=<encoded-message>
 * No user data is sent automatically; the user previews and edits before sending.
 */
export function waLink(contactId: string, message: string): string {
  const person = CONTACTS.find((c) => c.id === contactId) || CONTACTS[0];
  if (!person) return '#';
  const clean = person.wa.replace(/[^0-9]/g, '');
  if (clean.length < 10) return '#';
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

/**
 * Backward compatibility alias for single-destination callers.
 */
export function buildWaLink(message: string, contactId?: string): string {
  const targetId = contactId || CONTACTS[0].id;
  return waLink(targetId, message);
}
