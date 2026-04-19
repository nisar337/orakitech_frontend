const CATEGORIES = [
  "Normal",
  "Moderate",
  "Gaming",
  "High Performance",
];

export default function AdminCategories() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-[#112B54]">Product Categories</h1>
      <p className="text-sm text-gray-600">
        Allowed categories are locked to keep catalog filters clean.
      </p>
      <ul className="grid sm:grid-cols-2 gap-3">
        {CATEGORIES.map((name) => (
          <li
            key={name}
            className="rounded-xl bg-white border border-gray-200 px-4 py-3 font-medium text-gray-700"
          >
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}
