import { useFormContext } from "react-hook-form";

export default function Inputs({ type, title, name, id, placeholder, multiple }) {
  const { register, formState: errors } = useFormContext();
  const error = errors[name]?.message;
  const reg = register(name);

  return (
    <div>
      <label htmlFor={id} className="text-sm text-gray-600">
        {title}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder != null ? String(placeholder) : undefined}
        multiple={multiple}
        className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#112B54]"
        {...reg}
      />
      {error && <p className="text-red-500 text-sm text-left">{error}</p>}
    </div>
  );
}
