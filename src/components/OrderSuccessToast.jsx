import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";

/**
 * Fixed bottom popup shown only after a successful order (cart or buy now).
 */
export default function OrderSuccessToast({ show, message, onDismiss }) {
  useEffect(() => {
    if (!show) return;
    const id = setTimeout(() => onDismiss?.(), 4500);
    return () => clearTimeout(id);
  }, [show, onDismiss]);

  if (!show) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex max-w-[min(90vw,22rem)] -translate-x-1/2 animate-[fadeIn_.25s_ease-out]"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 shadow-lg ring-1 ring-emerald-500/10">
        <FaCheckCircle className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
        <span>{message}</span>
      </div>
    </div>
  );
}
