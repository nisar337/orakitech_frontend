import { useCallback, useMemo, useState } from "react";
import { CartContext, readCartFromStorage, writeCartToStorage } from "./cart-context.js";

function listingThumb(listing) {
  const { images, image } = listing;
  if (image) return image;
  if (Array.isArray(images) && images.length) return images[0];
  if (typeof images === "string") return images;
  return "";
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readCartFromStorage());

  const persist = useCallback((next) => {
    setItems(next);
    writeCartToStorage(next);
  }, []);

  const addItem = useCallback(
    (listing, qty = 1) => {
      const id = listing._id;
      if (!id) return;
      const q = Math.max(1, Math.min(99, Number(qty) || 1));
      const maxStock = Number.isFinite(Number(listing.quantity))
        ? Math.max(0, Math.floor(Number(listing.quantity)))
        : null;
      setItems((prev) => {
        const i = prev.findIndex((x) => x.listingId === id);
        let next;
        if (i >= 0) {
          const existing = prev[i];
          if (maxStock !== null && maxStock <= 0) return prev;
          const nextQty =
            maxStock !== null
              ? Math.min(99, Math.min(maxStock, existing.quantity + q))
              : Math.min(99, existing.quantity + q);
          next = [...prev];
          next[i] = {
            ...next[i],
            quantity: nextQty,
            maxStock: maxStock ?? next[i].maxStock ?? null,
          };
        } else {
          if (maxStock !== null && maxStock <= 0) return prev;
          const nextQty =
            maxStock !== null ? Math.min(99, Math.min(maxStock, q)) : q;
          next = [
            ...prev,
            {
              listingId: id,
              slug: listing.slug,
              title: listing.title,
              price: Number(listing.price) || 0,
              quantity: nextQty,
              image: listingThumb(listing),
              maxStock,
            },
          ];
        }
        writeCartToStorage(next);
        return next;
      });
    },
    []
  );

  const setQuantity = useCallback((listingId, quantity) => {
    const raw = Number(quantity);
    setItems((prev) => {
      let next;
      if (!Number.isFinite(raw) || raw < 1) {
        next = prev.filter((x) => x.listingId !== listingId);
      } else {
        const q = Math.min(99, Math.floor(raw));
        next = prev.map((x) =>
          x.listingId === listingId
            ? {
                ...x,
                quantity:
                  x.maxStock != null ? Math.min(q, x.maxStock) : q,
              }
            : x
        );
      }
      writeCartToStorage(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((listingId) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.listingId !== listingId);
      writeCartToStorage(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const totalCount = useMemo(
    () => items.reduce((s, x) => s + x.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      totalCount,
    }),
    [items, addItem, setQuantity, removeItem, clearCart, totalCount]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
