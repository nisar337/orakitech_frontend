import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { BsSearch } from "react-icons/bs";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const defaultQ = searchParams.get("q") || "";

  function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = new FormData(form).get("search");
    const q = String(raw ?? "").trim();
    const next = new URLSearchParams(searchParams);
    if (q) next.set("q", q);
    else next.delete("q");
    next.delete("section");
    next.delete("name");
    const qs = next.toString();
    navigate(qs ? `/shop?${qs}` : "/shop");
  }

  return (
    <form key={location.search} onSubmit={onSubmit} className="contents">
      <label
        htmlFor="search"
        className="flex justify-center items-center gap-2 md:gap-5 bg-white w-full border rounded-3xl px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
      >
        <BsSearch className="text-black text-sm md:text-base" />
        <input
          className="text-black outline-0 flex-1 text-sm md:text-base"
          type="search"
          name="search"
          id="search"
          defaultValue={defaultQ}
          placeholder="Search by name, brand, category…"
          autoComplete="off"
        />
      </label>
    </form>
  );
}
