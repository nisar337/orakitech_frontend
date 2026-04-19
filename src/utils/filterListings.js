const ACCESSORY_KEYWORDS = ["charger", "keyboard", "mouse", "pad"];
const STORAGE_KEYWORDS = ["ssd", "hdd", "usb", "ram", "external", "hard drive"];

function matchesBrandOrTitle(listing, nameRaw) {
  const name = nameRaw.trim().toLowerCase();
  const brand = (listing.brand || "").toLowerCase();
  const title = (listing.title || "").toLowerCase();
  if (name === "macbook") {
    return (
      brand.includes("apple") ||
      title.includes("macbook") ||
      title.includes("mac ")
    );
  }
  return brand.includes(name) || title.includes(name);
}

function matchesKeywordList(listing, keywords) {
  const cat = (listing.category || "").toLowerCase();
  const title = (listing.title || "").toLowerCase();
  return keywords.some(
    (k) => cat.includes(k) || title.includes(k)
  );
}

export function filterListings(listings, params) {
  const section = (params.section || "").trim().toLowerCase();
  const name = (params.name || "").trim();
  const q = (params.q || "").trim();

  let list = Array.isArray(listings) ? [...listings] : [];

  if (q) {
    const qq = q.toLowerCase();
    list = list.filter(
      (l) =>
        (l.title || "").toLowerCase().includes(qq) ||
        (l.brand || "").toLowerCase().includes(qq) ||
        (l.category || "").toLowerCase().includes(qq)
    );
  }

  if (!section) return list;

  if (section === "new-laptop") {
    list = list.filter((l) =>
      String(l.type || "").toLowerCase().includes("new")
    );
    if (name) list = list.filter((l) => matchesBrandOrTitle(l, name));
    return list;
  }

  if (section === "used-laptop") {
    list = list.filter((l) =>
      String(l.type || "").toLowerCase().includes("used")
    );
    if (name) list = list.filter((l) => matchesBrandOrTitle(l, name));
    return list;
  }

  if (section === "accessories") {
    if (name) {
      const nn = name.toLowerCase();
      list = list.filter(
        (l) =>
          (l.category || "").toLowerCase().includes(nn) ||
          (l.title || "").toLowerCase().includes(nn)
      );
    } else {
      list = list.filter((l) => matchesKeywordList(l, ACCESSORY_KEYWORDS));
    }
    return list;
  }

  if (section === "external-hardrive") {
    if (name) {
      const nn = name.toLowerCase();
      list = list.filter(
        (l) =>
          (l.category || "").toLowerCase().includes(nn) ||
          (l.title || "").toLowerCase().includes(nn)
      );
    } else {
      list = list.filter((l) => matchesKeywordList(l, STORAGE_KEYWORDS));
    }
    return list;
  }

  return list;
}

export function browseTitle(params) {
  const section = (params.section || "").trim().toLowerCase();
  const name = (params.name || "").trim();
  const q = (params.q || "").trim();
  if (q) return `Search: “${q}”`;
  if (!section) return "All Laptops";
  const labels = {
    "new-laptop": "New laptops",
    "used-laptop": "Used laptops",
    accessories: "Accessories",
    "external-hardrive": "Storage & parts",
  };
  const base = labels[section] || "Products";
  if (name) return `${base} · ${name}`;
  return base;
}
