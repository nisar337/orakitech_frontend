import { FaChevronRight, FaPhone } from "react-icons/fa";

export default function SalesSupport() {
  return (
    <>
      <div className="flex justify-center items-center gap-2">
        <p className="text-[16px] font-normal ">
          Sales Support &nbsp;&nbsp;Call Now For Best Deals!
        </p>
        &nbsp;
        <FaPhone className="text-amber-500 rotate-100" />
        <span>+92333-3777337</span>
      </div>
      
    </>
  );
}
