function normalize(value) {
  return String(value || "").toLowerCase();
}

function parseSearchTokens(raw) {
  return String(raw || "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function matchesSearchToken(value, token) {
  return normalize(value).includes(token);
}

export function matchesProductSearch(product, rawQuery) {
  const query = String(rawQuery || "").trim();
  if (!query) return true;
  const terms = parseSearchTokens(query);
  const productText = [
    product.title,
    product.brand,
    product.type,
    product.category,
    product.stockStatus,
    product.description,
    product.slug,
    product._id,
    product.price,
  ]
    .filter((value) => value !== undefined && value !== null)
    .map(normalize)
    .join(" ");

  return terms.every((token) => {
    if (token.startsWith("price:")) {
      const target = token.slice(6).trim();
      return String(product.price).toLowerCase().includes(target);
    }
    if (token.startsWith("title:")) {
      return normalize(product.title).includes(token.slice(6).trim());
    }
    if (token.startsWith("brand:")) {
      return normalize(product.brand).includes(token.slice(6).trim());
    }
    if (token.startsWith("type:")) {
      return normalize(product.type).includes(token.slice(5).trim());
    }
    if (token.startsWith("category:")) {
      return normalize(product.category).includes(token.slice(9).trim());
    }
    return productText.includes(token);
  });
}

export function matchesOrderSearch(order, rawQuery) {
  const query = String(rawQuery || "").trim();
  if (!query) return true;
  const terms = parseSearchTokens(query);
  const customer = order.customer || {};
  const itemTitles = (order.items || [])
    .map((item) => item.title || item.slug)
    .filter(Boolean)
    .join(" ");

  const orderText = [
    order._id,
    order.source,
    order.status,
    order.totalUSD,
    customer.fullName,
    customer.email,
    customer.phone,
    customer.address,
    customer.city,
    customer.country,
    itemTitles,
  ]
    .filter((value) => value !== undefined && value !== null)
    .map(normalize)
    .join(" ");

  return terms.every((token) => {
    if (token.startsWith("price:") || token.startsWith("total:")) {
      const target = token.split(":")[1] || "";
      return String(order.totalUSD).toLowerCase().includes(target);
    }
    if (token.startsWith("order:")) {
      return normalize(order._id).includes(token.slice(6).trim());
    }
    if (token.startsWith("customer:")) {
      return normalize(customer.fullName).includes(token.slice(9).trim());
    }
    return orderText.includes(token);
  });
}
