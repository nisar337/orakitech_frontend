import { useMemo } from "react";
import { Link } from "react-router-dom";
import SalesSupport from "./components/sales-support";
import Laptops from "./components/home-item";
import { useLaptopData } from "./hooks/useLaptopData.js";
import { filterListings } from "./utils/filterListings.js";

export default function Home() {
  const { laptopData, loading, error } = useLaptopData();
  const categoryCards = useMemo(() => {
    const categories = [
      {
        key: "new-laptop",
        title: "New Laptops",
        description: "Latest laptops with official condition and warranty.",
        accent: "from-blue-600 to-indigo-600",
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
      },
      {
        key: "used-laptop",
        title: "Used Laptops",
        description: "Budget-friendly devices, tested and ready to use.",
        accent: "from-emerald-600 to-teal-600",
        image:
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80",
      },
      {
        key: "accessories",
        title: "Accessories",
        description: "Chargers, keyboards, mouse, pads and daily essentials.",
        accent: "from-fuchsia-600 to-purple-600",
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
      },
      {
        key: "external-hardrive",
        title: "Storage & Parts",
        description: "SSD, HDD, RAM and external storage options.",
        accent: "from-amber-500 to-orange-600",
        image:
          "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=80",
      },
    ];

    return categories.map((cat) => ({
      ...cat,
      count: filterListings(laptopData, { section: cat.key }).length,
    }));
  }, [laptopData]);
  const featuredProducts = useMemo(() => {
    if (!Array.isArray(laptopData)) return [];
    return laptopData.slice(0, 12);
  }, [laptopData]);

  return (
    <main className="mx-6 my-5 md:mx-10">
      <section
        className="flex justify-between min-h-11 items-center shadow-lg bg-white px-3 py-2 rounded-md text-black mb-6 md:mb-8"
      >
        <SalesSupport />
      </section>

      {loading ? (
        <section className="rounded-3xl border border-blue-100 bg-white px-6 py-10 shadow-lg md:px-10 md:py-12">
          <div className="space-y-4">
            <div className="h-6 w-1/3 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-4 w-2/3 rounded-full bg-slate-200 animate-pulse" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="space-y-3 rounded-3xl border border-gray-200 bg-slate-100 p-4">
                  <div className="h-36 rounded-3xl bg-slate-200" />
                  <div className="h-4 rounded-full bg-slate-200" />
                  <div className="h-4 w-5/6 rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="animate-[fadeIn_.4s_ease-out]">
          <div className="mb-6 rounded-3xl border border-blue-100 bg-gradient-to-r from-[#102645] via-[#112B54] to-[#21497d] px-6 py-8 text-white shadow-lg md:px-10 md:py-10">
            <h1 className="max-w-3xl text-2xl font-semibold md:text-4xl">
              Find your next laptop and accessories in one place
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-blue-100 md:text-base">
              Browse by category like modern ecommerce websites, compare price
              ranges, and open product details in one click.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/shop?section=new-laptop"
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#112B54] hover:bg-blue-50"
              >
                Shop New Laptops
              </Link>
              <Link
                to="/shop?section=used-laptop"
                className="rounded-xl border border-blue-100 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Explore Used Deals
              </Link>
              <Link
                to="/shop"
                className="rounded-xl border border-blue-100 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Shop all laptops
              </Link>
            </div>
          </div>

          {error ? (
            <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-8 text-red-700 shadow-sm md:px-10 md:py-10">
              <h2 className="text-lg font-semibold">Could not load products</h2>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          ) : (
            <>
              <section className="mb-7">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#112B54]">
                    Shop by categories
                  </h2>
                  <p className="text-sm text-gray-500">Choose one to filter products</p>
                </div>
                <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
                  {categoryCards.map((card) => (
                    <Link
                      key={card.key}
                      to={`/shop?section=${card.key}`}
                      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200"
                    >
                      <div className="relative h-40 w-full overflow-hidden">
                        <img
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          src={card.image}
                          alt={card.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                      </div>
                      <div className="p-4">
                        <div
                          className={`mb-3 h-1.5 w-16 rounded-full bg-gradient-to-r ${card.accent}`}
                        />
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#112B54]">
                          {card.title}
                        </h3>
                        <p className="mt-1 min-h-11 text-sm text-gray-600">
                          {card.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">
                            {card.count} item{card.count === 1 ? "" : "s"}
                          </span>
                          <span className="font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                            Browse
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#112B54]">
                    Featured products
                  </h2>
                  <Link
                    to="/shop"
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <Laptops laptopData={featuredProducts} />
              </section>
            </>
          )}
        </section>
      )}
    </main>
  );
}
