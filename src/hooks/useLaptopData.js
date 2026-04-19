import { useContext } from "react";
import { LaptopDataContext } from "../context/laptop-data-context.js";

export function useLaptopData() {
  const ctx = useContext(LaptopDataContext);
  if (!ctx) {
    throw new Error("useLaptopData must be used within LaptopDataProvider");
  }
  return ctx;
}
