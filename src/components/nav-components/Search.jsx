import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import { useLaptopData } from "../../hooks/useLaptopData.js";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const defaultQ = searchParams.get("q") || "";
  const { laptopData } = useLaptopData();
  const [inputValue, setInputValue] = useState(defaultQ);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate suggestions based on input
  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = inputValue.toLowerCase();
    const filteredSuggestions = laptopData.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const brand = (item.brand || "").toLowerCase();
      const category = (item.category || "").toLowerCase();
      return (
        title.includes(query) ||
        brand.includes(query) ||
        category.includes(query)
      );
    });

    // Limit to 8 suggestions and group by type
    const grouped = {
      brands: [],
      products: [],
      categories: [],
    };

    filteredSuggestions.forEach((item) => {
      if (
        item.brand &&
        !grouped.brands.some((b) => b.toLowerCase() === item.brand.toLowerCase())
      ) {
        grouped.brands.push(item.brand);
      }
      if (grouped.products.length < 5) {
        grouped.products.push(item);
      }
      if (
        item.category &&
        !grouped.categories.some(
          (c) => c.toLowerCase() === item.category.toLowerCase()
        )
      ) {
        grouped.categories.push(item.category);
      }
    });

    const allSuggestions = [
      ...grouped.brands.slice(0, 3).map((brand) => ({ type: "brand", value: brand })),
      ...grouped.products.slice(0, 5).map((product) => ({ type: "product", value: product })),
      ...grouped.categories.slice(0, 2).map((category) => ({ type: "category", value: category })),
    ];

    setSuggestions(allSuggestions);
    setShowSuggestions(allSuggestions.length > 0);
  }, [inputValue, laptopData]);

  function onSubmit(e) {
    e.preventDefault();
    const q = inputValue.trim();
    const next = new URLSearchParams(searchParams);
    if (q) next.set("q", q);
    else next.delete("q");
    next.delete("section");
    next.delete("name");
    const qs = next.toString();
    navigate(qs ? `/shop?${qs}` : "/shop");
    setShowSuggestions(false);
  }

  function handleSuggestionClick(suggestion) {
    setShowSuggestions(false);
    if (suggestion.type === "product") {
      navigate(`/${suggestion.value.slug}`);
      return;
    }

    setInputValue(suggestion.value);
    const next = new URLSearchParams(searchParams);
    next.set("q", suggestion.value);
    const qs = next.toString();
    navigate(qs ? `/shop?${qs}` : "/shop");
  }

  return (
    <form
      key={location.search}
      onSubmit={onSubmit}
      className="relative w-full"
      ref={searchRef}
    >
      <label
        htmlFor="search"
        className="flex justify-center items-center gap-2 md:gap-5 bg-white w-full border rounded-3xl px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
      >
        <BsSearch className="text-black text-sm md:text-base" />
        <input
          className="text-black outline-0 flex-1 text-sm md:text-base"
          type="search"
          name="search"
          id="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => inputValue.trim() && setShowSuggestions(true)}
          placeholder="Search by name, brand, category…"
          autoComplete="off"
        />
      </label>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute  top-12 left-0 right-0 z-50 py-5 bg-white border border-gray-200  rounded-lg shadow-lg">
          <div className="max-h-70 overflow-y-hidden">
            {/* Brands Section */}
            {suggestions.some((s) => s.type === "brand") && (
              <>
                <div className="px-2  text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                  Brands
                </div>
                {suggestions
                  .filter((s) => s.type === "brand")
                  .map((suggestion, idx) => (
                    <button
                      key={`brand-${idx}`}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                      <BsSearch className="text-gray-400 text-sm" />
                      <span className="text-sm text-gray-800">
                        {suggestion.value}
                      </span>
                    </button>
                  ))}
              </>
            )}

            {/* Products Section */}
            {suggestions.some((s) => s.type === "product") && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                  Products
                </div>
                {suggestions
                  .filter((s) => s.type === "product")
                  .map((suggestion, idx) => (
                    <button
                      key={`product-${idx}`}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">
                        {suggestion.value.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {suggestion.value.brand && (
                          <span>{suggestion.value.brand}</span>
                        )}
                        {suggestion.value.brand && suggestion.value.category && (
                          <span> • </span>
                        )}
                        {suggestion.value.category && (
                          <span>{suggestion.value.category}</span>
                        )}
                      </p>
                    </button>
                  ))}
              </>
            )}

            {/* Categories Section */}
            {suggestions.some((s) => s.type === "category") && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                  Categories
                </div>
                {suggestions
                  .filter((s) => s.type === "category")
                  .map((suggestion, idx) => (
                    <button
                      key={`category-${idx}`}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                      <BsSearch className="text-gray-400 text-sm" />
                      <span className="text-sm text-gray-800">
                        {suggestion.value}
                      </span>
                    </button>
                  ))}
              </>
            )}
          </div>

          {/* See All Results */}
          {suggestions.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-2 text-center">
              <button
                type="submit"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View all results for "{inputValue}"
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
