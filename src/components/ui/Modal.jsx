import { useEffect, useId, useState } from "react";

const ANIM_DURATION = 260; // ms — keep in sync with transition duration below

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
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      const t = setTimeout(() => setEntered(true), 10);
      return () => clearTimeout(t);
    } else {
      setEntered(false);
      const t = setTimeout(() => setVisible(false), ANIM_DURATION);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEsc, onClose]);

  if (!visible) return null;

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
          "absolute inset-0 cursor-default bg-black/40 transition-opacity",
          `duration-[${ANIM_DURATION}ms]`,
          entered ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? headingId : undefined}
        className={[
          "relative flex max-h-[90vh] w-full flex-col rounded-2xl bg-white shadow-2xl ring-1",
          ring,
          maxWidthClassName,
          "transition-all ease-out",
          `duration-[${ANIM_DURATION}ms]`,
          entered
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4",
        ].join(" ")}
      >
        {title ? (
          <div className="shrink-0 border-b border-gray-100 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
            <h2 id={headingId} className="text-lg font-semibold text-[#112B54]">
              {title}
            </h2>
          </div>
        ) : null}

        <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {children}
        </div>

        {(primaryAction || secondaryAction) && (
          <div className="shrink-0 border-t border-gray-100 px-5 py-4 sm:px-6">
            <div className="flex items-center justify-end gap-2">
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
          </div>
        )}
      </div>
    </div>
  );
}

