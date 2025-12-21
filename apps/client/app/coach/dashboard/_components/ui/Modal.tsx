"use client";

import { useEffect, useRef } from "react";
import { modals, typography, icons, transitions } from "./design-system";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md",
  showClose = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${transitions.base}`}
      onClick={onClose}
    >
      <div className={modals.overlay} />
      <div
        ref={modalRef}
        className={`relative ${modals.container} w-full ${modals.sizes[size]} animate-fadeIn`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className={modals.header}>
            <h3 className={typography.h3}>{title}</h3>
            {showClose && (
              <button 
                onClick={onClose} 
                className={`${icons.button} ${transitions.base}`}
              >
                <svg className={icons.sizes.md} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className={modals.body}>{children}</div>
      </div>
    </div>
  );
}
