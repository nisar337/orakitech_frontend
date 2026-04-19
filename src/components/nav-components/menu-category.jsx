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
      className={`bg-[#FABB1A] text-black px-11 py-3 w-70 flex relative items-center 
          gap-2 cursor-pointer ${menuBar === true ? "bg-[#FABB1A]" : ""}`}
    >
      <HiMenu className="text-2xl" />
      <h3 className="font-semibold "> Brows Categories</h3>
      {menuBar === true && <Menu menuBar={menuBar} setMenuBar={setMenuBar} />}
    </div>
  );
}
