import { useEffect, type ReactNode } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-sm animate-fade-in rounded-2xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <h2 id="modal-title" className="text-lg font-bold text-stone-900 dark:text-white">
          {title}
        </h2>
        <div className="mt-2 text-sm text-stone-600 dark:text-stone-300">{children}</div>
      </div>
    </div>
  );
}
