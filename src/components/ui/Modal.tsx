'use client';

import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleId?: string;
  ariaLabel?: string;
  maxWidth?: string;
  className?: string;
  children: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  titleId,
  ariaLabel,
  maxWidth = 'max-w-md',
  className = '',
  children,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Focus trap & save/restore previously focused element
  useEffect(() => {
    if (!isOpen) return;

    if (typeof document !== 'undefined') {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus first focusable element inside modal
      const focusFirstElement = () => {
        if (!modalRef.current) return;
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          modalRef.current.focus();
        }
      };

      const timer = setTimeout(focusFirstElement, 50);

      // Keyboard handler: Escape to close & Tab for focus trap
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
          return;
        }

        if (e.key === 'Tab' && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);

        // Return focus to trigger element
        if (previouslyFocusedElementRef.current && typeof previouslyFocusedElementRef.current.focus === 'function') {
          previouslyFocusedElementRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overscroll-contain animate-in fade-in duration-150 select-none"
      onClick={(e) => {
        // Close when clicking directly on the backdrop (outside modalRef content)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`relative w-full ${maxWidth} bg-[#24130C] rounded-3xl border-2 border-[#78350F] shadow-[0_16px_50px_rgba(0,0,0,0.9)] text-white focus:outline-hidden ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
