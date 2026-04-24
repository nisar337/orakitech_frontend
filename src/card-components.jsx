import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BsArrowLeftCircleFill,
  BsArrowRightCircleFill,
} from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import fallbackGallery from "./assets/images";
import { MdLocalShipping, MdSupportAgent } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { API_BASE } from "./config/api.js";
import { useCart } from "./hooks/useCart.js";
import { formatPkrFromUsd } from "./utils/currency.js";
import OrderSuccessToast from "./components/OrderSuccessToast.jsx";
import ProductEngagement from "./components/ProductEngagement.jsx";

// Simple cache for product data with expiration
const productCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedProduct(slug) {
  const cached = productCache.get(slug);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    productCache.delete(slug);
    return null;
  }
  
  return cached.data;
}

function setCachedProduct(slug, data) {
  productCache.set(slug, {
    data,
    timestamp: Date.now()
  });
  
  // Limit cache size to prevent memory leaks
  if (productCache.size > 50) {
    const oldestKey = productCache.keys().next().value;
    productCache.delete(oldestKey);
  }
}

const EMPTY_BUYER = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  notes: "",
  paymentMethod: "cod",
};

function galleryFromListing(images) {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === "string") return [images];
  return [];
}

function pkrFromUsd(price) {
  return formatPkrFromUsd(price);
}

export default function Card() {
  const { addItem } = useCart();
  const [item, setItem] = useState(null);
  const { queryParams } = useParams();
  const [gallery, setGallery] = useState(fallbackGallery);
  const [activeImg, setActiveImg] = useState(0);
  const [count, setCount] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [orderMsg, setOrderMsg] = useState("");
  const [orderPlacedPopup, setOrderPlacedPopup] = useState(false);
  const [orderBusy, setOrderBusy] = useState(false);
  const [cartMsg, setCartMsg] = useState("");
  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [buyer, setBuyer] = useState(EMPTY_BUYER);
  const [reviewStats, setReviewStats] = useState({ average: null, count: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!item?._id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/engagement/listings/${item._id}/reviews`
        );
        const data = await res.json().catch(() => ({}));
        if (cancelled || !res.ok) return;
        setReviewStats({
          average:
            typeof data.averageRating === "number" ? data.averageRating : null,
          count: Number(data.count) || 0,
        });
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [item?._id]);

  useEffect(() => {
    if (!queryParams) return;
    
    // Check cache first
    const cachedData = getCachedProduct(queryParams);
    if (cachedData) {
      setItem(cachedData);
      const urls = galleryFromListing(cachedData.images);
      setGallery(urls.length ? urls : fallbackGallery);
      setActiveImg(0);
      setCount(1);
      setShowBuyerForm(false);
      setBuyer(EMPTY_BUYER);
      setOrderPlacedPopup(false);
      setLoading(false);
      return;
    }
    
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/home/${encodeURIComponent(queryParams)}`
        );
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok || !data || typeof data !== "object" || !data.title) {
          setItem(null);
          setReviewStats({ average: null, count: 0 });
          return;
        }
        // Cache the successful response
        setCachedProduct(queryParams, data);
        setItem(data);
        const urls = galleryFromListing(data.images);
        setGallery(urls.length ? urls : fallbackGallery);
        setActiveImg(0);
        setCount(1);
        setShowBuyerForm(false);
        setBuyer(EMPTY_BUYER);
        setOrderPlacedPopup(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [queryParams]);

  const maxQty = item
    ? Math.min(99, Math.max(1, Number(item.quantity) || 12))
    : 1;

  useEffect(() => {
    if (count > maxQty) setCount(maxQty);
  }, [count, maxQty]);

  async function submitBuyNow() {
    if (!item?._id) return;
    if (
      !buyer.fullName ||
      !buyer.email ||
      !buyer.phone ||
      !buyer.address ||
      !buyer.city ||
      !buyer.country
    ) {
      setOrderMsg("Please fill name, address, email, city and country.");
      return;
    }
    setOrderBusy(true);
    setOrderMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "buy_now",
          paymentMethod: "cod",
          customer: {
            fullName: buyer.fullName,
            email: buyer.email,
            phone: buyer.phone,
            address: buyer.address,
            city: buyer.city,
            country: buyer.country,
            notes: buyer.notes,
          },
          items: [{ listingId: item._id, quantity: count }],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setOrderMsg(data.message || "Could not place order.");
        return;
      }
      setOrderMsg("");
      setOrderPlacedPopup(true);
      setBuyer(EMPTY_BUYER);
      setShowBuyerForm(false);
    } catch (e) {
      setOrderMsg(e?.message || "Network error.");
    } finally {
      setOrderBusy(false);
    }
  }

  function handleAddToCart() {
    if (!item) return;
    addItem(item, count);
    setCartMsg("Added to cart.");
    setTimeout(() => setCartMsg(""), 2500);
  }

  function onBuyerChange(e) {
    const { name, value } = e.target;
    setBuyer((s) => ({ ...s, [name]: value }));
  }

  const inStock = item
    ? item.stockStatus
      ? item.stockStatus === "In stock"
      : Number(item.quantity) > 0 || item.quantity === undefined
    : false;

  if (!item?.title) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-gray-600">
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-lg">Loading product details...</p>
          </div>
        ) : (
          <>
            <p className="text-lg">Product not found.</p>
            <Link to="/" className="mt-4 inline-block text-blue-600 underline">
              Back to shop
            </Link>
          </>
        )}
      </div>
    );
  }

  const coreSpecRows = [
    ["Brand", item.brand],
    ["RAM", item.ram],
    ["Storage", item.storage],
    ["Drive", item.disk],
    ["Condition", item.type],
    ["Series / category", item.category],
    ["Price", pkrFromUsd(item.price)],
  ].filter(([, v]) => Boolean(v && String(v).trim()));

  const extraSpecRows = Array.isArray(item.specs)
    ? item.specs.map((s) => [s.label, s.value]).filter(([a, b]) => a && b)
    : [];

  const specTableRows = [...coreSpecRows, ...extraSpecRows];

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-[#112B54]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/" className="hover:text-[#112B54]">
            Laptops
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{item.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="relative flex items-center justify-center rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <button
                type="button"
                aria-label="Previous image"
                className="absolute left-2 z-10 text-2xl text-gray-500 hover:text-[#112B54]"
                onClick={() =>
                  setActiveImg((i) =>
                    i === 0 ? gallery.length - 1 : i - 1
                  )
                }
              >
                <BsArrowLeftCircleFill />
              </button>
              <img
                src={gallery[activeImg].url}
                alt={item.title}
                className="max-h-[380px] w-full max-w-lg object-contain"
              />
              <button
                type="button"
                aria-label="Next image"
                className="absolute right-2 z-10 text-2xl text-gray-500 hover:text-[#112B54]"
                onClick={() =>
                  setActiveImg((i) =>
                    i >= gallery.length - 1 ? 0 : i + 1
                  )
                }
              >
                <BsArrowRightCircleFill />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {gallery.map(({ url, filename }, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 bg-white p-1 ${i === activeImg
                    ? "border-blue-600"
                    : "border-transparent hover:border-gray-300"
                    }`}
                >
                  <img
                    src={url}
                    alt={filename}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl text-start font-semibold text-gray-900 mb-2">
              {item.title}
            </h1>
            <p className="text-sm text-gray-600 text-start mb-1">
              Brand: <span className="font-medium text-gray-900">{item.brand}</span>
            </p>
           
            
          
            <ul className="mb-6 mt-4 space-y-2 text-sm text-gray-700">
              {item.ram && (
                <li className="flex gap-2">
                  <span className="text-blue-600">•</span>
                  <span>{item.ram} RAM</span>
                </li>
              )}
              {item.storage && (
                <li className="flex gap-2">
                  <span className="text-blue-600">•</span>
                  <span>{item.storage}</span>
                </li>
              )}
              {item.disk && (
                <li className="flex gap-2">
                  <span className="text-blue-600">•</span>
                  <span>{item.disk}</span>
                </li>
              )}
              {item.type && (
                <li className="flex gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Condition: {item.type}</span>
                </li>
              )}
              
              {item.category && (
                <li className="flex gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Category: {item.category}</span>
                </li>
              )}
            </ul>
           
            <p className=" text-start text-3xl font-bold text-[#112B54] mb-4">
              {pkrFromUsd(item.price)}
            </p>
           
            <div className="flex flex-wrap items-center gap-3 mb-4">
            {inStock ? (
              <span className=" rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-900">
                In stock
              </span>
            ) : (
              <span className="rounded-full bg-gray-200 px-3 py-0.5 text-xs font-semibold text-gray-900">
                Out of stock
              </span>
            )}
              <div className="flex items-center gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((n) => (
                  <FaStar
                    key={n}
                    className={`text-lg ${
                      reviewStats.average != null &&
                      n <= Math.round(reviewStats.average)
                        ? ""
                        : "text-gray-200"
                    }`}
                  />
                ))}
                
              </div>
              
              <span className="text-sm text-gray-500">
                {reviewStats.average != null
                  ? reviewStats.average.toFixed(1)
                  : "—"}{" "}
                · {reviewStats.count} review
                {reviewStats.count === 1 ? "" : "s"}
              </span>
            </div>

            {/* <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-600">Qty</span>
              <button
                type="button"
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-lg leading-none hover:bg-gray-50"
                onClick={() => setCount((c) => Math.max(1, c - 1))}
              >
                −
              </button>
              <span className="w-10 text-center font-medium">{count}</span>
              <button
                type="button"
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-lg leading-none hover:bg-gray-50"
                onClick={() => setCount((c) => Math.min(maxQty, c + 1))}
              >
                +
              </button>
            </div> */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <button
                type="button"
                disabled={!inStock}
                onClick={handleAddToCart}
                className="w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
              >
                Add to cart
              </button>
              <button
                type="button"
                disabled={!inStock || orderBusy}
                onClick={() => {
                  if (!showBuyerForm) {
                    setShowBuyerForm(true);
                    setOrderMsg("Please fill details to confirm Buy now.");
                    return;
                  }
                  submitBuyNow();
                }}
                className="w-full sm:w-auto rounded-xl bg-[#0a1c36] px-8 py-3 font-semibold text-white shadow hover:opacity-95 disabled:opacity-50"
              >
                {orderBusy
                  ? "Processing…"
                  : showBuyerForm
                    ? "Confirm buy now"
                    : "Buy now"}
              </button>
            </div>
            {showBuyerForm ? (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 rounded-xl bg-white p-4 border border-gray-200">
                <input
                  name="fullName"
                  value={buyer.fullName}
                  onChange={onBuyerChange}
                  placeholder="Full name*"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  name="email"
                  value={buyer.email}
                  onChange={onBuyerChange}
                  placeholder="Email*"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  name="phone"
                  value={buyer.phone}
                  onChange={onBuyerChange}
                  placeholder="Phone*"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  name="address"
                  value={buyer.address}
                  onChange={onBuyerChange}
                  placeholder="Address*"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  name="city"
                  value={buyer.city}
                  onChange={onBuyerChange}
                  placeholder="City*"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  name="country"
                  value={buyer.country}
                  onChange={onBuyerChange}
                  placeholder="Country*"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <textarea
                  name="notes"
                  value={buyer.notes}
                  onChange={onBuyerChange}
                  placeholder="Notes (optional)"
                  rows={2}
                  className="md:col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <p className="md:col-span-2 text-sm text-gray-600">
                  Payment method: <strong>Cash on delivery (COD)</strong>
                </p>
              </div>
            ) : null}

            {cartMsg && (
              <p className="mt-3 text-sm text-emerald-700">{cartMsg}</p>
            )}
            {orderMsg && (
              <p
                className={`mt-3 text-sm ${
                  orderMsg.includes("Could not") ||
                  orderMsg.includes("Network error") ||
                  orderMsg.includes("Please fill name")
                    ? "text-red-700"
                    : "text-blue-800"
                }`}
              >
                {orderMsg}
              </p>
            )}

            <OrderSuccessToast
              show={orderPlacedPopup}
              message="Order placed successfully. Thank you!"
              onDismiss={() => setOrderPlacedPopup(false)}
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <TbTruckDelivery className="mt-0.5 text-xl text-blue-600 shrink-0" />
                <span>Free delivery</span>
              </div>
              <div className="flex items-start gap-2">
                <MdLocalShipping className="mt-0.5 text-xl text-blue-600 shrink-0" />
                <span>7-day return policy</span>
              </div>
              <div className="flex items-start gap-2">
                <MdSupportAgent className="mt-0.5 text-xl text-blue-600 shrink-0" />
                <span>24/7 customer support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-nowrap overflow-x-auto border-b border-gray-200">
            {[
              ["description", "Description"],
              ["specs", "Specifications"],
              ["reviews", "Customer reviews"],
              ["qa", "Questions & answers"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition ${activeTab === id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="p-6 text-gray-700 text-sm leading-relaxed">
            {activeTab === "description" && (
              <p className="whitespace-pre-wrap">{item.description}</p>
            )}
            {activeTab === "specs" && (
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Key specifications
                </p>
                {specTableRows.length ? (
                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <table className="w-full border-collapse text-left text-sm">
                      <tbody>
                        {specTableRows.map(([label, val], i) => (
                          <tr
                            key={`${label}-${i}`}
                            className={i % 2 === 0 ? "bg-slate-50/90" : "bg-white"}
                          >
                            <th className="w-[36%] border-b border-gray-100 px-4 py-3 align-top text-[13px] font-semibold text-gray-800">
                              {label}
                            </th>
                            <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
                              {val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No specifications available.</p>
                )}
              </div>
            )}
            {activeTab === "reviews" && item._id ? (
              <ProductEngagement
                listingId={item._id}
                activeTab="reviews"
                onReviewStatsChange={setReviewStats}
              />
            ) : null}
            {activeTab === "qa" && item._id ? (
              <ProductEngagement
                listingId={item._id}
                activeTab="qa"
                onReviewStatsChange={setReviewStats}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
