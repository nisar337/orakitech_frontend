export const SECTION_SLUG_BY_LABEL = {
  "New Laptop": "new-laptop",
  "Used Laptop": "used-laptop",
  Accessories: "accessories",
  "External Hardrive": "external-hardrive",
};

export function browseHref(sectionLabel, itemName) {
  const section = SECTION_SLUG_BY_LABEL[sectionLabel];
  if (!section) return "/shop";
  const p = new URLSearchParams({ section });
  if (itemName != null && String(itemName).trim() !== "") {
    p.set("name", String(itemName).trim());
  }
  return `/shop?${p.toString()}`;
}
