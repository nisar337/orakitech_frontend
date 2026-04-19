import { useMemo } from "react";
import { useLaptopData } from "../../hooks/useLaptopData.js";

export default function CategoryChart() {
  const { laptopData } = useLaptopData();

  const rows = useMemo(() => {
    const map = new Map();
    for (const p of laptopData) {
      const c = (p.category || "Uncategorized").trim() || "Uncategorized";
      map.set(c, (map.get(c) || 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [laptopData]);

  const max = rows.reduce((m, [, n]) => Math.max(m, n), 0) || 1;

  return (
    <div className="bg-white p-6 rounded-xl shadow border min-h-72 flex flex-col">
      <h2 className="font-semibold mb-4">Listings by category</h2>
      {!rows.length ? (
        <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
          Add products with a category to see this chart.
        </div>
      ) : (
        <ul className="space-y-3 flex-1 overflow-y-auto pr-1">
          {rows.map(([label, count]) => (
            <li key={label}>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span className="truncate pr-2">{label}</span>
                <span>{count}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#112B54]"
                  style={{ width: `${Math.max(8, (count / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
