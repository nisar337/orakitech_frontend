import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import CategoryMenu from "./menu-category";
import { useCart } from "../../hooks/useCart.js";

export default function NavMenu() {
  const { totalCount } = useCart();
  return (
    <div className="bg-linear-to-r from-[#112B54] via-[#112a52] to-[#112B54] px-4 py-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-10">
        <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-10 text-sm md:text-base text-white">
          <CategoryMenu />
          <Link to="/" className="py-2 hover:opacity-80 transition-opacity">
            Home
          </Link>
          <Link to="/shop" className="py-2 hover:opacity-80 transition-opacity">
            Shop
          </Link>
          <Link to="/about" className="py-2 hover:opacity-80 transition-opacity">
            About
          </Link>
          <Link to="/contact" className="py-2 hover:opacity-80 transition-opacity">
            Contact
          </Link>
        </div>
        <Link
          to="/cart"
          className="flex gap-2 items-center px-4 md:px-7 py-2 text-white hover:opacity-90 rounded-lg transition-all duration-200 hover:bg-white/10 self-center"
        >
          <span className="relative">
            <FaShoppingCart className="text-lg md:text-xl" />
            {totalCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-black">
                {totalCount > 99 ? "99+" : totalCount}
              </span>
            ) : null}
          </span>
          <span className="text-sm md:text-base font-medium">My cart</span>
        </Link>
      </div>
    </div>
  );
}
