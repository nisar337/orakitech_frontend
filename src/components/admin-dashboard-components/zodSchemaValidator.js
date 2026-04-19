import { z } from "zod";

const priceFromInput = z
  .string({ required_error: "Price is required." })
  .trim()
  .min(1, "Price is required.")
  .refine((s) => !Number.isNaN(Number(s)), "Enter a valid number.")
  .transform((s) => Number(s))
  .refine((n) => n >= 0, "Price cannot be negative.")
  .refine((n) => n <= 1200000, "Price must not be greater than 1,200,000.");

const quantityFromInput = z
  .string()
  .trim()
  .min(1, "Quantity is required.")
  .refine((s) => !Number.isNaN(Number(s)), "Enter a valid quantity.")
  .transform((s) => Number(s))
  .refine((n) => Number.isInteger(n) && n >= 1, "Quantity must be at least 1.")
  .refine((n) => n <= 12, "Quantity must be at most 12.");

export const productFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .min(3, "Title should have at least 3 characters."),

  brand: z
    .string()
    .trim()
    .min(1, "Brand is required.")
    .min(2, "Brand should have at least 2 characters."),

  ram: z.string().min(1, "RAM is required."),

  disk: z.string().min(1, "Disk type is required."),

  storage: z.string().min(1, "Storage is required."),

  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .min(10, "Use at least 10 characters.")
    .max(2000, "Description can be at most 2000 characters."),

  price: priceFromInput,

  quantity: quantityFromInput,
  stockStatus: z.enum(["In stock", "Out of stock"], {
    errorMap: () => ({ message: "Please select stock status." }),
  }),

  category: z.enum(["Normal", "Moderate", "Gaming", "High Performance"], {
    errorMap: () => ({ message: "Please select a valid category." }),
  }),
  type: z.string().trim().min(1, "Product type is required."),

  specs: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional()
    .default([])
    .transform((rows) =>
      (rows ?? [])
        .map((r) => ({
          label: String(r?.label ?? "").trim(),
          value: String(r?.value ?? "").trim(),
        }))
        .filter((r) => r.label.length > 0 && r.value.length > 0)
        .map((r) => ({
          label: r.label.slice(0, 120),
          value: r.value.slice(0, 500),
        }))
        .slice(0, 48)
    ),

  images: z
    .any()
    .optional()
    .refine(
      (val) =>
        val == null ||
        val === undefined ||
        (typeof FileList !== "undefined" && val instanceof FileList),
      { message: "Invalid file selection." }
    ),
});
