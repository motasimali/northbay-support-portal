import { useEffect, useRef } from "react";

export default function Modal({ open, onClose, title, children, footer }) {
  const containerRef = useRef(null);
  const firstFocusRef = useRef(null);
  const lastActiveElRef = useRef(null);


  useEffect(() => {
    if (!open) return;
    lastActiveElRef.current = document.activeElement;

    // Escape to close
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);

    // Focus first focusable
    const t = setTimeout(() => {
      (firstFocusRef.current || containerRef.current)?.focus();
    }, 0);

    return () => {
      clearTimeout(t);
      // return focus
      lastActiveElRef.current && lastActiveElRef.current.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-xl rounded-2xl border bg-white shadow-xl outline-none"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 id="modal-title" className="text-base font-semibold">{title}</h3>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            className="rounded p-1 hover:bg-gray-100 cursor-pointer"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="border-t px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}
