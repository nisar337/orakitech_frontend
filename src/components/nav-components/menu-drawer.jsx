import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import CategoryData from "./CategoryData";
import { useState } from "react";
import { browseHref } from "../../utils/shopUrls.js";

export default function Menu({ menuBar, setMenuBar }) {
  const [category] = useState(() =>
    CategoryData && CategoryData.length ? CategoryData[0] : {}
  );
  const [activeKey, setActiveKey] = useState(null);
  const [values, setValues] = useState([]);

  const handleCategoryHover = (key, value) => {
    setActiveKey(key);
    setValues(value);
  };

  return (
    <div
      onMouseEnter={() => setMenuBar(true)}
      onMouseLeave={() => {
        setMenuBar(false);
        setActiveKey(null);
        setValues([]);
      }}
      className={`
        absolute left-0 top-12 z-50
        w-[95vw] max-w-180
        md:w-170
        max-md:max-w-100
        flex flex-col md:flex-row
        rounded-2xl overflow-hidden
        bg-white shadow-2xl border border-gray-200
        transition-all duration-300 ease-out
        origin-top-left
        ${
          menuBar
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }
      `}
    >
      <div className="w-full md:w-70 bg-white border-r border-gray-200">
        {Object.entries(category).map(([key, value], i) => (
          <div
            key={i}
            onMouseEnter={() => handleCategoryHover(key, value)}
            className={`
              flex justify-between items-center
              px-5 py-3 cursor-pointer
              transition-all duration-200
              ${
                activeKey === key
                  ? "bg-amber-50 text-amber-600"
                  : "hover:bg-gray-100 text-gray-800"
              }
            `}
          >
            <Link
              to={browseHref(key)}
              onClick={() => setMenuBar(false)}
              className="text-sm md:text-base font-medium flex-1"
            >
              {key}
            </Link>
            <FaChevronRight
              className={`text-sm transition-transform duration-200 ${
                activeKey === key ? "translate-x-1 text-amber-500" : "text-gray-400"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="w-full md:w-100 bg-gray-50 min-h-62.5 p-5">
        {values && values.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-x-5 gap-y-2 animate-fadeIn">
            {values.map((value, i) => (
              <Link
                key={`${value}-${i}`}
                to={activeKey ? browseHref(activeKey, value) : "/"}
                onClick={() => setMenuBar(false)}
                className="px-1 py-1 text-sm md:text-base text-gray-700 hover:text-amber-600 transition-colors duration-200"
              >
                {value}
              </Link>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm md:text-base">
            Hover a category, then pick a name to filter the shop.
          </div>
        )}
      </div>
    </div>
  );
}
