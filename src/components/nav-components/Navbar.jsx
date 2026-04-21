import Search from "./Search";
import Auth from "./Auth";
import { FaBell } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import Logo from "../../assets/logo.svg";
import NavMenu from "./nav-menu";

export default function Navbar() {
  return (
    <nav className="text-white">
      <div className="bg-linear-to-r from-[#0a1c36] via-[#112a52] to-[#0a1c36] text-white">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center px-4 py-2">
          <div className="flex justify-between items-center">
            <img className="h-10 md:h-12" src={Logo} alt="OrakiTech Logo" />
            <div className="md:hidden flex items-center gap-3">
              <FaBell className="cursor-pointer text-white text-xl" />
              <MdSupportAgent className="cursor-pointer text-2xl" />
              <Auth />
            </div>
          </div>
          <div className="mt-3 md:mt-0 md:flex-1 md:max-w-md md:mx-4">
            <Search />
          </div>
          <div className="hidden md:flex items-center gap-4">
            <FaBell className="cursor-pointer text-white text-xl" />
            <MdSupportAgent className="cursor-pointer text-2xl" />
            <Auth />
          </div>
        </div>
      </div>
      <NavMenu />
    </nav>
  );
}
