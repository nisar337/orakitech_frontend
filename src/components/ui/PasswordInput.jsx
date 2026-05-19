import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function PasswordInput({ className = "", containerClassName = "", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative ${containerClassName}`.trim()}>
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${className} pr-10`.trim()}
      />
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setVisible((prev) => !prev)}
        className="absolute inset-y-0 right-2 flex items-center rounded p-1 text-slate-500 transition hover:text-slate-700 focus:outline-none focus:ring-0"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
      </button>
    </div>
  );
}
