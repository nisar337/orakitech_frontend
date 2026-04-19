import { Link, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { useCart } from "../hooks/useCart.js";
import { API_BASE } from "../config/api.js";
import { PKR_RATE, formatPkrFromUsd } from "../utils/currency.js";
import OrderSuccessToast from "../components/OrderSuccessToast.jsx";

export default function Cart() {
  const { items, setQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ kind: "idle", message: "" });
  const [orderPlacedPopup, setOrderPlacedPopup] = useState(false);
  const dismissOrderPopup = useCallback(() => setOrderPlacedPopup(false), []);
  const [orderForm, setOrderForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    notes: "",
    paymentMethod: "cod",
  });

  const totalUSD = items.reduce(
    (s, x) => s + (Number(x.price) || 0) * x.quantity,
    0
  );

  function onFormChange(e) {
    const { name, value } = e.target;
    setOrderForm((s) => ({ ...s, [name]: value }));
  }

  async function placeOrder() {
    if (!items.length) return;
    if (
      !orderForm.fullName ||
      !orderForm.email ||
      !orderForm.phone ||
      !orderForm.address ||
      !orderForm.city ||
      !orderForm.country
    ) {
      setStatus({
        kind: "error",
        message: "Please fill all required customer details.",
      });
      return;
    }
    setStatus({ kind: "loading", message: "Placing order…" });
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "cart_checkout",
          paymentMethod: "cod",
          customer: {
            fullName: orderForm.fullName,
            email: orderForm.email,
            phone: orderForm.phone,
            address: orderForm.address,
            city: orderForm.city,
            country: orderForm.country,
            notes: orderForm.notes,
          },
          items: items.map((x) => ({
            listingId: x.listingId,
            quantity: x.quantity,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({
          kind: "error",
          message: data.message || "Order failed.",
        });
        return;
      }
      clearCart();
      setStatus({ kind: "idle", message: "" });
      setOrderPlacedPopup(true);
      setTimeout(() => navigate("/"), 4200);
    } catch (e) {
      setStatus({
        kind: "error",
        message: e?.message || "Network error.",
      });
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-[#112B54] mb-2">Your cart</h1>
      <p className="text-gray-600 text-sm mb-6">
        Review items and place an order. Orders appear in the admin dashboard.
      </p>

      {status.message && status.kind !== "idle" && (
        <p
          className={`mb-4 rounded-lg px-3 py-2 text-sm ${
            status.kind === "error"
              ? "bg-red-50 text-red-700"
              : status.kind === "loading"
                ? "bg-blue-50 text-blue-800"
                : "bg-gray-50 text-gray-700"
          }`}
        >
          {status.message}
        </p>
      )}

      <OrderSuccessToast
        show={orderPlacedPopup}
        message="Order placed successfully. Thank you!"
        onDismiss={dismissOrderPopup}
      />

      {!items.length ? (
        <p className="text-gray-600">
          Cart is empty.{" "}
          <Link to="/" className="text-blue-600 underline">
            Continue shopping
          </Link>
        </p>
      ) : (
        <div className="space-y-4">
          <ul className="divide-y rounded-xl border border-gray-200 bg-white">
            {items.map((line) => (
              <li
                key={line.listingId}
                className="flex flex-wrap items-center gap-4 p-4"
              >
                <img
                  src={line.image || "/vite.svg"}
                  alt=""
                  className="h-16 w-16 rounded object-contain bg-gray-50"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/${line.slug}`}
                    className="font-medium text-[#112B54] hover:underline"
                  >
                    {line.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {formatPkrFromUsd(Number(line.price) || 0)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded border px-2 py-1 text-sm"
                    onClick={() =>
                      setQuantity(line.listingId, line.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{line.quantity}</span>
                  <button
                    type="button"
                    className="rounded border px-2 py-1 text-sm"
                    onClick={() =>
                      setQuantity(line.listingId, line.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-sm text-red-600 hover:underline"
                  onClick={() => removeItem(line.listingId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
            <div className="w-full grid md:grid-cols-2 gap-3 mb-2">
              <input
                name="fullName"
                value={orderForm.fullName}
                onChange={onFormChange}
                placeholder="Full name*"
                className="rounded-xl border border-gray-300 px-3 py-2"
              />
              <input
                name="email"
                value={orderForm.email}
                onChange={onFormChange}
                placeholder="Email*"
                className="rounded-xl border border-gray-300 px-3 py-2"
              />
              <input
                name="phone"
                value={orderForm.phone}
                onChange={onFormChange}
                placeholder="Phone*"
                className="rounded-xl border border-gray-300 px-3 py-2"
              />
              <input
                name="address"
                value={orderForm.address}
                onChange={onFormChange}
                placeholder="Address*"
                className="rounded-xl border border-gray-300 px-3 py-2"
              />
              <input
                name="city"
                value={orderForm.city}
                onChange={onFormChange}
                placeholder="City*"
                className="rounded-xl border border-gray-300 px-3 py-2"
              />
              <input
                name="country"
                value={orderForm.country}
                onChange={onFormChange}
                placeholder="Country*"
                className="rounded-xl border border-gray-300 px-3 py-2"
              />
              <textarea
                name="notes"
                value={orderForm.notes}
                onChange={onFormChange}
                placeholder="Order notes (optional)"
                rows={3}
                className="md:col-span-2 rounded-xl border border-gray-300 px-3 py-2"
              />
              <p className="md:col-span-2 text-sm text-gray-600">
                Payment method: <strong>Cash on delivery (COD)</strong>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated total</p>
              <p className="text-xl font-semibold text-[#112B54]">
                {formatPkrFromUsd(totalUSD)}
              </p>
              <p className="text-xs text-gray-500">PKR conversion rate: {PKR_RATE}</p>
            </div>
            <button
              type="button"
              disabled={status.kind === "loading"}
              onClick={placeOrder}
              className="w-full sm:w-auto rounded-xl bg-[#112B54] px-6 py-3 text-white font-semibold hover:opacity-90 disabled:opacity-50"
            >
              Place order
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
