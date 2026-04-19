import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import CategoryMenu from "./menu-category";
import { useCart } from "../../hooks/useCart.js";

export default function NavMenu() {
  const { totalCount } = useCart();
  return (
    <div className=" flex justify-between items-center gap-10 bg-linear-to-r from-[#112B54] via-[#112a52] to-[#112B54]">
      <div
        className="flex gap-10 max-w-2xl text-{16px} text-white
       "
      >
        <CategoryMenu />
        <Link to="/" className=" py-3 ">
          Home
        </Link>
        <Link to="/shop" className=" py-3">
          Shop
        </Link>
        <Link to={"/about"} className=" py-3">About</Link>
        <Link to={"/contact"} className=" py-3">
          Contact
        </Link>
      </div>
      <Link
        to="/cart"
        className="flex gap-2 items-center px-7 text-white hover:opacity-90"
      >
        <span className="relative">
          <FaShoppingCart className="text-xl" />
          {totalCount > 0 ? (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-black">
              {totalCount > 99 ? "99+" : totalCount}
            </span>
          ) : null}
        </span>
        <span className="text-base font-medium">My cart</span>
      </Link>
    </div>
  );
}
