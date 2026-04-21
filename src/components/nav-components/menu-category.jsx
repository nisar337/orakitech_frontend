import { HiMenu } from "react-icons/hi";
import Menu from "./menu-drawer";
import { useState } from "react";

export default function CategoryMenu() {
  const [menuBar, setMenuBar] = useState(false);
  return (
    <div
      onMouseEnter={() => setMenuBar(true)}
      onMouseLeave={() => setMenuBar(false)}
      onClick={() => setMenuBar(menuBar === false ? true : false)}
      className={`bg-[#FABB1A] text-black px-3 md:px-11 py-2 md:py-3 flex relative items-center gap-2 cursor-pointer rounded-lg transition-all duration-200 hover:bg-[#FABB1A]/90 ${menuBar === true ? "bg-[#FABB1A]" : ""}`}
    >
      <HiMenu className="text-xl md:text-2xl" />
      <h3 className="font-semibold text-sm md:text-base hidden sm:block">Browse Categories</h3>
      {menuBar === true && <Menu menuBar={menuBar} setMenuBar={setMenuBar} />}
    </div>
  );
}
