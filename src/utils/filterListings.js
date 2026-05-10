const ACCESSORY_KEYWORDS = ["charger", "keyboard", "mouse", "pad"];
const STORAGE_KEYWORDS = ["ssd", "hdd", "usb", "ram", "external", "hard drive"];

function matchesBrandOrTitle(listing, nameRaw) {
  const name = nameRaw.trim().toLowerCase();
  const brand = (listing.brand || "").toLowerCase();
  const title = (listing.title || "").toLowerCase();
  const subCategory = (listing.subCategory || "").toLowerCase();
  if (name === "macbook") {
    return (
      brand.includes("apple") ||
      title.includes("macbook") ||
      title.includes("mac ") ||
      subCategory.includes("macbook")
    );
  }
  return brand.includes(name) || title.includes(name) || subCategory.includes(name);
}

function matchesKeywordList(listing, keywords) {
  const cat = (listing.category || "").toLowerCase();
  const subCat = (listing.subCategory || "").toLowerCase();
  const title = (listing.title || "").toLowerCase();
  return keywords.some(
    (k) => cat.includes(k) || subCat.includes(k) || title.includes(k)
  );
}

const VALID_CATEGORIES = [
  "new laptop",
  "used laptop",
  "accessories",
  "external hardrive",
];

function hasNewCategory(listing) {
  return VALID_CATEGORIES.includes((listing.category || "").toLowerCase());
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
        (l.category || "").toLowerCase().includes(qq) ||
        (l.subCategory || "").toLowerCase().includes(qq)
    );
  }

  if (!section) return list;

  if (section === "new-laptop") {
    list = list.filter((l) => {
      const cat = (l.category || "").toLowerCase();
      if (hasNewCategory(l)) return cat === "new laptop";
      return String(l.type || "").toLowerCase().includes("new");
    });
    if (name) list = list.filter((l) => matchesBrandOrTitle(l, name));
    return list;
  }

  if (section === "used-laptop") {
    list = list.filter((l) => {
      const cat = (l.category || "").toLowerCase();
      if (hasNewCategory(l)) return cat === "used laptop";
      return String(l.type || "").toLowerCase().includes("used");
    });
    if (name) list = list.filter((l) => matchesBrandOrTitle(l, name));
    return list;
  }

  if (section === "accessories") {
    list = list.filter((l) => {
      const cat = (l.category || "").toLowerCase();
      if (hasNewCategory(l)) return cat === "accessories";
      return matchesKeywordList(l, ACCESSORY_KEYWORDS);
    });
    if (name) {
      const nn = name.toLowerCase();
      list = list.filter(
        (l) =>
          (l.subCategory || "").toLowerCase().includes(nn) ||
          (l.title || "").toLowerCase().includes(nn)
      );
    }
    return list;
  }

  if (section === "external-hardrive") {
    list = list.filter((l) => {
      const cat = (l.category || "").toLowerCase();
      if (hasNewCategory(l)) return cat === "external hardrive";
      return matchesKeywordList(l, STORAGE_KEYWORDS);
    });
    if (name) {
      const nn = name.toLowerCase();
      list = list.filter(
        (l) =>
          (l.subCategory || "").toLowerCase().includes(nn) ||
          (l.title || "").toLowerCase().includes(nn)
      );
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
