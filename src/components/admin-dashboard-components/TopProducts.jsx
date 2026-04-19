import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLaptopData } from "../../hooks/useLaptopData.js";
import { formatPkrFromUsd } from "../../utils/currency.js";

export default function TopProducts() {
  const { laptopData } = useLaptopData();

  const top = useMemo(() => {
    return [...laptopData]
      .filter((p) => Number.isFinite(Number(p.price)))
      .sort((a, b) => Number(b.price) - Number(a.price))
      .slice(0, 5);
  }, [laptopData]);

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="font-semibold mb-4">Highest list price</h2>

      {!top.length ? (
        <p className="text-gray-500 text-sm">No priced products yet.</p>
      ) : (
        <ul className="space-y-2">
          {top.map((p) => (
            <li key={p._id} className="flex justify-between gap-2 text-sm py-1 border-b border-gray-100 last:border-0">
              <Link
                to={`/${p.slug}`}
                className="text-[#112B54] hover:underline truncate"
              >
                {p.title}
              </Link>
              <span className="text-gray-700 whitespace-nowrap">
                {formatPkrFromUsd(p.price)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
