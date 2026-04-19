import Search from "./Search";
import Auth from "./Auth";
import { FaBell } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import Logo from "../../assets/logo.svg";
import NavMenu from "./nav-menu";

export default function Navbar() {
  return (
    <nav className="text-white">
      <div className="flex justify-between items-center bg-linear-to-r from-[#0a1c36] via-[#112a52] to-[#0a1c36] text-white px-0 py-2">
        <div className="max-w-100 align-middle">
          <img className=" h-13"  src={Logo} alt="" />
        </div>
        <Search className="" />
        <FaBell className="cursor-pointer text-white text-2xl" />
        <div className="flex justify-center px-6 items-center gap-5">
          <MdSupportAgent className="cursor-pointer text-3xl" />
          <Auth />
        </div>
      </div>
      <NavMenu />
    </nav>
  );
}
