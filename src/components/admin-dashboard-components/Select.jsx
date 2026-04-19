import { useFormContext } from "react-hook-form";

export default function Select({
  name,
  title,
  id,
  hiddenValue,
  optionsValue = [],
}) {
  const { register, formState: errors } = useFormContext();
  const error = errors[name]?.message;

  return (
    <div>
      <label htmlFor={id} className="text-sm text-gray-600">
        {title}
      </label>
      <select
        id={id}
        className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#112B54]"
        {...register(name)}
      >
        <option value="">{hiddenValue}</option>
        {optionsValue && optionsValue.length
          ? optionsValue.map((optionValue, i) => (
              <option value={optionValue} key={i}>
                {optionValue}
              </option>
            ))
          : null}
      </select>
      {error && <p className="text-red-500 text-sm text-left">{error}</p>}
    </div>
  );
}
