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

  ram: z.string().optional().default(""),

  disk: z.string().optional().default(""),

  storage: z.string().optional().default(""),

  description: z.string().optional().default(""),

  price: priceFromInput,

  quantity: quantityFromInput,
  stockStatus: z.enum(["In stock", "Out of stock"], {
    errorMap: () => ({ message: "Please select stock status." }),
  }),

  category: z.string().trim().min(1, "Category is required."),
  subCategory: z.string().trim().min(1, "Sub category is required."),
  type: z.string().optional().default(""),

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
}).superRefine((data, ctx) => {
  const cat = (data.category || "").trim();
  if (cat === "New Laptop" || cat === "Used Laptop") {
    if (!data.ram || data.ram.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "RAM is required for laptop products.",
        path: ["ram"],
      });
    }
    if (!data.disk || data.disk.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Disk type is required for laptop products.",
        path: ["disk"],
      });
    }
    if (!data.storage || data.storage.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Storage is required for laptop products.",
        path: ["storage"],
      });
    }
    if (!data.type || data.type.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Product type is required for laptop products.",
        path: ["type"],
      });
    }
  }
});
