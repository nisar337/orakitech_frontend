import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Laptops from "./components/home-item";
import { useLaptopData } from "./hooks/useLaptopData.js";
import { filterListings, browseTitle } from "./utils/filterListings.js";

export default function Shop() {
  const { laptopData, loading, error } = useLaptopData();
  const [searchParams] = useSearchParams();
  const [sortPrice, setSortPrice] = useState(null);

  const filterParams = useMemo(
    () => ({
      section: searchParams.get("section") || "",
      name: searchParams.get("name") || "",
      q: searchParams.get("q") || "",
    }),
    [searchParams]
  );

  const filtered = useMemo(
    () => filterListings(laptopData, filterParams),
    [laptopData, filterParams]
  );

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortPrice === "asc") arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortPrice === "desc")
      arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    return arr;
  }, [filtered, sortPrice]);

  const heading = browseTitle(filterParams);
  const hasActiveFilters =
    Boolean(filterParams.section) ||
    Boolean(filterParams.q) ||
    Boolean(filterParams.name);

  function cycleSort() {
    setSortPrice((prev) =>
      prev === null ? "asc" : prev === "asc" ? "desc" : null
    );
  }

  return (
    <main className="  mx-6 my-5 md:mx-10 animate-[fadeIn_.4s_ease-out] ">
      <div className=" flex  flex-wrap gap-3 justify-between py-5 px-5 rounded-2xl mb-5 bg-linear-to-r from-[#f3f2fa] via-white to-[#edf3ff] shadow-sm border border-[#e6e9f5]">
        <div>
          <h1 className="text-left text-2xl md:text-4xl font-semibold text-[#112B54]">
            {heading}
          </h1>
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          {loading && <p className="text-gray-500 text-sm mt-1">Loading catalog…</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasActiveFilters && (
            <Link
              to="/shop"
              className="text-sm px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
            >
              Clear filters
            </Link>
          )}
          <p className="text-sm text-gray-600">
            {sorted.length} item{sorted.length === 1 ? "" : "s"}
          </p>
          <button
            type="button"
            onClick={cycleSort}
            className="cursor-pointer bg-white shadow-sm border border-gray-200 px-4 py-2 font-semibold rounded-lg text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            Sort by price
            {sortPrice === "asc" ? " ↑" : sortPrice === "desc" ? " ↓" : ""}
          </button>
        </div>
      </div>
      <Laptops laptopData={sorted} />
    </main>
  );
}
