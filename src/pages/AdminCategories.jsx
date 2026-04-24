import { FaLaptop, FaTachometerAlt, FaGamepad, FaRocket } from "react-icons/fa";

const CATEGORIES = [
  { name: "Normal", Icon: FaLaptop },
  { name: "Moderate", Icon: FaTachometerAlt },
  { name: "Gaming", Icon: FaGamepad },
  { name: "High Performance", Icon: FaRocket },
];

export default function AdminCategories() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#112B54]">Product Categories</h1>
        <p className="text-sm text-slate-600">
          Four core categories for clean catalog filters.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map(({ name, Icon }) => (
          <li
            key={name}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-5 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#112B54] text-white">
              <Icon className="h-5 w-5" />
            </span>
            <span className="font-medium">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
