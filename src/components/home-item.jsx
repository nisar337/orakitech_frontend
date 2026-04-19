import { Link } from "react-router-dom";
import { formatPkrFromUsd } from "../utils/currency.js";




function listingImage(listing) {
  const first = listing?.images?.[0];
  if (!first) return { url: "", alt: listing?.title || "Product" };
  return {
    url: typeof first === "string" ? first : first.url,
    alt: first.filename || listing.title || "Product",
  };
}

export default function Laptops({ laptopData }) {
  return (
    <div
      className="grid justify-center gap-6 sm:gap-7"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 320px))",
      }}
    >
      {laptopData && laptopData.length
        ? laptopData.map((data, idx) => {
            const { url, alt } = listingImage(data);
            return (
              <Link
                className="group flex h-full max-w-[320px] flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white text-left shadow-sm ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200/80 hover:shadow-xl hover:ring-blue-100/40 sm:max-w-none"
                to={`/${data.slug}`}
                key={data._id}
                style={{ animation: `fadeIn .35s ease-out ${idx * 35}ms both` }}
              >
                <div className="relative flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 pt-4">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-50/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {url ? (
                    <img
                      className="relative z-[1] max-h-full w-full max-w-[240px] object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.04]"
                      src={url}
                      alt={alt}
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-4 pt-3 sm:p-5">
                  <h4 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-[#112B54] sm:text-[17px]">
                    {data.title}
                  </h4>
                  <p className="mt-2 text-lg font-semibold tracking-tight text-gray-900">
                    {formatPkrFromUsd(data.price)}
                  </p>
                  <span className="mt-auto inline-flex w-fit items-center rounded-lg bg-gradient-to-r from-blue-600 to-[#112B54] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 group-hover:shadow-md">
                    View details
                  </span>
                </div>
              </Link>
            );
          })
        : null}
    </div>
  );
}
