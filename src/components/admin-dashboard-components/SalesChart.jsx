import { useMemo } from "react";
import { useLaptopData } from "../../hooks/useLaptopData.js";

export default function SalesChart() {
  const { laptopData } = useLaptopData();

  const summary = useMemo(() => {
    const n = laptopData.length;
    const withImages = laptopData.filter(
      (p) => Array.isArray(p.images) && p.images.length > 0
    ).length;
    return { n, withImages };
  }, [laptopData]);

  return (
    <div className="bg-white p-6 rounded-xl shadow border h-72 flex flex-col">
      <h2 className="font-semibold mb-4">Catalog overview</h2>
      <div className="flex-1 flex flex-col justify-center gap-4 text-gray-700">
        <p className="text-3xl font-bold text-[#112B54]">
          {summary.n}{" "}
          <span className="text-base font-normal text-gray-500">
            live SKUs
          </span>
        </p>
        <p className="text-sm text-gray-600">
          {summary.withImages} listings include at least one image URL (uploaded
          or default).
        </p>
      </div>
    </div>
  );
}
