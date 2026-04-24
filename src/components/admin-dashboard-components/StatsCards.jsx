import { useMemo } from "react";
import { useLaptopData } from "../../hooks/useLaptopData.js";
import { formatPkrFromUsd } from "../../utils/currency.js";

export default function StatsCards() {
  const { laptopData } = useLaptopData();

  const stats = useMemo(() => {
    const count = laptopData.length;
    const avgPrice =
      count === 0
        ? 0
        : laptopData.reduce((s, p) => s + (Number(p.price) || 0), 0) / count;
    const newCount = laptopData.filter((p) =>
      String(p.type || "").toLowerCase().includes("new")
    ).length;
    return [
      { title: "Products live", value: String(count) },
      {
        title: "Avg. list price (PKR)",
        value: avgPrice ? formatPkrFromUsd(avgPrice) : "—",
      },
      { title: "New laptops", value: String(newCount) },
      {
        title: "Used laptops",
        value: String(
          laptopData.filter((p) =>
            String(p.type || "").toLowerCase().includes("used")
          ).length
        ),
      },
    ];
  }, [laptopData]);

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-xl shadow border"
        >
          <p className="text-gray">{s.title}</p>
          <h2 className="text-1xl font-bold text-[#112B54]">
            {s.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
