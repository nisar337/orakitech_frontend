import { createContext } from "react";

export const CartContext = createContext(null);

const STORAGE_KEY = "orakitech-cart";

export function readCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCartToStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
