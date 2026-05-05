import { Link } from "react-router-dom";
import { BsFacebook, BsLinkedin, BsTwitter, BsWhatsapp } from "react-icons/bs";
import { HiHome, HiMail, HiPhone, HiShoppingBag, HiUserGroup } from "react-icons/hi";
import LogoImage from "./assets/logo.svg";

export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-[#0a1c36] via-[#112a52] to-[#0a1c36] text-white">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-10 py-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 items-start text-left">
          <div className="flex flex-col items-start">
            <img className=" h-10 w-auto" src={LogoImage} alt="OrakiTech" />
            
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">
            Powering your future with cutting-edge tech products. We deliver smart, reliable solutions that enhance productivity and everyday life. </p>
          </div>

          <div className="flex flex-col items-start sm:pl-6 lg:pl-10">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/90">
              Useful Links
            </h3>
            <nav className="mt-4 space-y-0 text-sm text-white/80">
              <Link
                to="/"
                className="group flex items-center gap-2 rounded-lg py-2 pr-2 transition-all duration-200 hover:text-white hover:translate-x-0.5"
              >
                <HiHome className="h-4 w-4 shrink-0 text-white/75 transition-colors duration-200 group-hover:text-white" />
                <span className="underline-offset-4 decoration-white/35 transition-all duration-200 group-hover:underline group-hover:decoration-white/70">
                  Home
                </span>
              </Link>
              <Link
                to="/shop"
                className="group flex items-center gap-2 rounded-lg py-1 pr-2 transition-all duration-200 hover:text-white hover:translate-x-0.5"
              >
                <HiShoppingBag className="h-4 w-4 shrink-0 text-white/75 transition-colors duration-200 group-hover:text-white" />
                <span className="underline-offset-4 decoration-white/35 transition-all duration-200 group-hover:underline group-hover:decoration-white/70">
                  Shop
                </span>
              </Link>
              <Link
                to="/about"
                className="group flex items-center gap-2 rounded-lg py-1 pr-2 transition-all duration-200 hover:text-white hover:translate-x-0.5"
              >
                <HiUserGroup className="h-4 w-4 shrink-0 text-white/75 transition-colors duration-200 group-hover:text-white" />
                <span className="underline-offset-4 decoration-white/35 transition-all duration-200 group-hover:underline group-hover:decoration-white/70">
                  About Us
                </span>
              </Link>
              <Link
                to="/contact"
                className="group flex items-center gap-2 rounded-lg py-1 pr-2 transition-all duration-200 hover:text-white hover:translate-x-0.5"
              >
                <HiMail className="h-4 w-4 shrink-0 text-white/75 transition-colors duration-200 group-hover:text-white" />
                <span className="underline-offset-4 decoration-white/35 transition-all duration-200 group-hover:underline group-hover:decoration-white/70">
                  Contact Us
                </span>
              </Link>
            </nav>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/90">
              Follow Us
            </h3>
            <div className="mt-4 flex flex-wrap items-center justify-start gap-3 text-2xl text-white/90">
              <a href="#" className="rounded-lg bg-white/10 p-2 hover:bg-white/15" aria-label="Facebook">
                <BsFacebook />
              </a>
              <a href="#" className="rounded-lg bg-white/10 p-2 hover:bg-white/15" aria-label="LinkedIn">
                <BsLinkedin />
              </a>
              <a href="#" className="rounded-lg bg-white/10 p-2 hover:bg-white/15" aria-label="Twitter">
                <BsTwitter />
              </a>
              <a href="#" className="rounded-lg bg-white/10 p-2 hover:bg-white/15" aria-label="WhatsApp">
                <BsWhatsapp />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/90">
              Get In Touch
            </h3>
            <div className="mt-4 space-y-3 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <HiMail className="h-4 w-4 shrink-0 text-white/85" />
                <span>orakitech@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <HiPhone className="h-4 w-4 shrink-0 text-white/85" />
                <span>+92 330 3777337</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6">
          <div className="flex flex-col gap-4 text-left text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 ORAKITECH. All rights reserved.</p>
            {/* <div className="flex flex-wrap items-center justify-start gap-3 sm:justify-end">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <span className="text-white/30">|</span>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <span className="text-white/30">|</span>
              <a href="#" className="hover:text-white">Refund Policy</a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
