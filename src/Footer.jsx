import {
  BsFacebook,
  BsLinkedin,
  BsTwitter,
  BsWhatsapp,
} from "react-icons/bs";
import LogoImage from "../src/assets/logo.svg";
import { FaCopyright } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="sticky">
      <div className="bg-[#152652] text-white flex flex-col gap-4 md:flex-row md:justify-between md:items-center px-5 md:px-10 py-5">
        <div>
          <img
            className="h-11 w-auto"
            src={LogoImage}
            alt="logo-orakitech"
          />
        </div>
        <div className="flex items-center gap-4 text-2xl md:text-3xl">
          <span>
            <BsFacebook />
          </span>
          <span>
            <BsLinkedin />
          </span>
          <span>
            <BsTwitter />
          </span>
          <span>
            <BsWhatsapp />
          </span>
        </div>
        <div className="flex justify-center items-center gap-2 text-sm md:text-base">
          <FaCopyright />
          <span> 2026 All right reserved.</span>
        </div>
      </div>
    </footer>
  );
}
