import { useEffect, useId, useState } from "react";

export default function Modal({
  open,
  title,
  children,
  onClose,
  primaryAction,
  secondaryAction,
  intent = "default", // "default" | "success" | "danger"
  closeOnBackdrop = true,
  closeOnEsc = true,
  maxWidthClassName = "max-w-md",
  placement = "center", // "center" | "top"
}) {
  const headingId = useId();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    const t = setTimeout(() => setEntered(true), 10);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  const ring =
    intent === "success"
      ? "ring-emerald-100"
      : intent === "danger"
        ? "ring-red-100"
        : "ring-[#112B54]/10";

  return (
    <div
      className={[
        "fixed inset-0 z-50 flex justify-center p-4",
        placement === "top" ? "items-start pt-6" : "items-center",
      ].join(" ")}
    >
      <button
        type="button"
        aria-label="Close modal overlay"
        className={[
          "absolute inset-0 cursor-default bg-black/35 transition-opacity duration-200",
          entered ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? headingId : undefined}
        className={[
          "relative w-full rounded-2xl bg-white shadow-xl ring-1",
          ring,
          maxWidthClassName,
          "transition-all duration-200",
          entered ? "opacity-100 scale-100" : "opacity-0 scale-95",
        ].join(" ")}
      >
        <div className="p-5 sm:p-6">
          {title ? (
            <h2 id={headingId} className="text-lg font-semibold text-[#112B54]">
              {title}
            </h2>
          ) : null}

          <div className={title ? "mt-2" : ""}>{children}</div>

          {(primaryAction || secondaryAction) && (
            <div className="mt-6 flex items-center justify-end gap-2">
              {secondaryAction ? (
                <button
                  type="button"
                  onClick={secondaryAction.onClick}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  {secondaryAction.label}
                </button>
              ) : null}
              {primaryAction ? (
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  className={[
                    "rounded-xl px-4 py-2 text-sm font-semibold text-white",
                    intent === "danger"
                      ? "bg-red-600 hover:bg-red-700"
                      : intent === "success"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-[#112B54] hover:opacity-95",
                  ].join(" ")}
                >
                  {primaryAction.label}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

