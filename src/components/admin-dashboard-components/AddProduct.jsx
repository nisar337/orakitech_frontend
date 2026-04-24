import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, Controller, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productFormSchema } from "./zodSchemaValidator";
import Inputs from "./Inputs";
import Select from "./Select";
import { useLaptopData } from "../../hooks/useLaptopData.js";
import { useAdminAuth } from "../../hooks/useAdminAuth.js";
import { API_BASE } from "../../config/api.js";

const SPEC_PRESETS = [
  ["Processor", ""],
  ["Display", ""],
  ["Memory (RAM)", ""],
  ["Storage", ""],
  ["Graphics", ""],
  ["Operating System", ""],
  ["Battery", ""],
  ["Warranty", ""],
  ["Ports", ""],
  ["Weight", ""],
  ["Color", ""],
];

export default function AddProduct() {
  const { id: editId } = useParams();
  const isEdit = Boolean(editId);
  const navigate = useNavigate();
  const { adminFetch } = useAdminAuth();
  const { refreshLaptopData } = useLaptopData();
  const [status, setStatus] = useState({ kind: "idle", message: "" });
  const [loadError, setLoadError] = useState(null);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [editReady, setEditReady] = useState(() => !isEdit);

  const methods = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      brand: "",
      ram: "",
      disk: "",
      storage: "",
      description: "",
      price: "",
      quantity: "1",
      stockStatus: "In stock",
      category: "",
      type: "",
      images: undefined,
      specs: [],
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: "specs" });

  useEffect(() => {
    if (!isEdit) {
      queueMicrotask(() => {
        setExistingImageUrls([]);
        setPreviewUrls([]);
        setLoadError(null);
        setEditReady(true);
        reset({
          title: "",
          brand: "",
          ram: "",
          disk: "",
          storage: "",
          description: "",
          price: "",
          quantity: "1",
          stockStatus: "In stock",
          category: "",
          type: "",
          images: undefined,
          specs: [],
        });
      });
      return;
    }
    queueMicrotask(() => setEditReady(false));
    let cancelled = false;
    (async () => {
      await new Promise((r) => queueMicrotask(r));
      if (cancelled) return;
      setLoadError(null);
      try {
        const res = await fetch(`${API_BASE}/api/listings/${editId}`);
        const doc = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok || !doc?._id) {
          setLoadError(doc?.message || "Could not load product.");
          setEditReady(false);
          return;
        }
        setExistingImageUrls(Array.isArray(doc.images) ? doc.images : []);
        reset({
          title: doc.title || "",
          brand: doc.brand || "",
          ram: doc.ram || "",
          disk: doc.disk || "",
          storage: doc.storage || "",
          description: doc.description || "",
          price: doc.price != null ? String(doc.price) : "",
          quantity: doc.quantity != null ? String(doc.quantity) : "1",
          stockStatus: doc.stockStatus || "In stock",
          category: doc.category || "",
          type: doc.type || "",
          images: undefined,
          specs: Array.isArray(doc.specs)
            ? doc.specs.map((s) => ({
                label: s.label || "",
                value: s.value || "",
              }))
            : [],
        });
        setEditReady(true);
      } catch (e) {
        if (!cancelled) {
          setLoadError(e?.message || "Network error.");
          setEditReady(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEdit, editId, reset]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  async function handleSubmitForm(data) {
    setStatus({ kind: "loading", message: isEdit ? "Saving…" : "Uploading…" });
    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("brand", data.brand);
    fd.append("ram", data.ram);
    fd.append("disk", data.disk);
    fd.append("storage", data.storage);
    fd.append("description", data.description);
    fd.append("price", String(data.price));
    fd.append("quantity", String(data.quantity ?? 1));
    fd.append("stockStatus", data.stockStatus || "In stock");
    fd.append("category", data.category);
    fd.append("type", data.type);
    fd.append("specs", JSON.stringify(data.specs ?? []));

    const files = data.images ?? getValues("images");
    if (files instanceof FileList && files.length > 0) {
      Array.from(files).forEach((file) => {
        fd.append("images", file);
      });
    } else if (isEdit && existingImageUrls.length) {
      fd.append("existingImages", JSON.stringify(existingImageUrls));
    }

    try {
      const url = isEdit
        ? `${API_BASE}/api/listings/${editId}`
        : `${API_BASE}/api/listings`;
      const res = await adminFetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: fd,
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({
          kind: "error",
          message: payload.message || (isEdit ? "Save failed." : "Upload failed."),
        });
        return;
      }
      await refreshLaptopData();
      reset();
      setStatus({ kind: "idle", message: "" });
      if (isEdit && Array.isArray(payload.images)) {
        setExistingImageUrls(payload.images);
      }
      navigate("/admin/products", {
        replace: true,
        state: {
          notice: isEdit
            ? "Product updated successfully."
            : "Product added and visible to site.",
        },
      });
    } catch (e) {
      setStatus({
        kind: "error",
        message: e?.message || "Network error.",
      });
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-gray-200">
          <h2 className="text-3xl mb-6 font-bold text-[#112B54] mb-2">
            {isEdit ? "Edit product" : "Add new product"}
          </h2>
         

          {loadError && (
            <p className="mb-4 text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">
              {loadError}
            </p>
          )}

          {status.message && (
            <p
              className={`mb-4 text-sm rounded-lg px-3 py-2 ${status.kind === "error"
                  ? "bg-red-50 text-red-700"
                  : status.kind === "loading"
                    ? "bg-blue-50 text-blue-800"
                    : "bg-green-50 text-green-800"
                }`}
              role="status"
            >
              {status.message}
            </p>
          )}

          {isEdit && !editReady && !loadError && (
            <p className="text-sm text-gray-600 mb-4">Loading product…</p>
          )}

          {(!isEdit || editReady) && !loadError && (
            <form
              onSubmit={handleSubmit(handleSubmitForm)}
              className="space-y-6"
            >
              {isEdit && existingImageUrls.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current photos</p>
                  <div className="flex flex-wrap gap-2">
                    {existingImageUrls.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="h-20 w-20 rounded-lg border object-cover"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Upload new images below to replace these. Leave empty to keep
                    them.
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <Inputs
                  type={"text"}
                  title={"Product title"}
                  name={"title"}
                  id={"product-title"}
                  placeholder="HP Pavilion 15"
                />
                <Inputs
                  type={"text"}
                  title={"Brand"}
                  name={"brand"}
                  id={"product-brand"}
                  placeholder="HP, Dell, Lenovo"
                />
              </div>

              <div className="text-gray-500 grid md:grid-cols-2 gap-4">
                <Select
                  name={"ram"}
                  title={"RAM"}
                  id={"product-ram"}
                  hiddenValue={"Select RAM"}
                  optionsValue={["8GB", "16GB", "32GB", "64GB"]}
                />
                <Select
                  name={"storage"}
                  title={"Storage"}
                  id={"product-storage"}
                  hiddenValue={"Storage Type"}
                  optionsValue={[
                    "256GB SSD",
                    "512GB SSD",
                    "1TB SSD",
                    "256GB Hard Disk",
                    "512 GB Hard Disk",
                  ]}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Inputs
                  type={"number"}
                  title={"Price (PKR)"}
                  name={"price"}
                  id={"product-price"}
                  placeholder="250000"
                />
                <Inputs
                  type={"number"}
                  title={"Quantity"}
                  name={"quantity"}
                  id={"product-quantity"}
                  placeholder="1"
                />
              </div>

              <Select
                name={"stockStatus"}
                title={"Stock status"}
                id={"product-stock-status"}
                hiddenValue={"Stock Status"}
                optionsValue={["In stock", "Out of stock"]}
              />

              <div className="text-gray-500 grid md:grid-cols-2 gap-4">
                <Select
                  name={"disk"}
                  title={"Disk type"}
                  id={"product-drive"}
                  hiddenValue={"Disk Type"}
                  optionsValue={["SSD (Solid State Drive)", "Hard Disk"]}
                />
                <Select
                  name={"type"}
                  title={"Product type"}
                  id={"laptop-type"}
                  hiddenValue={"Select Type"}
                  optionsValue={["Used", "New"]}
                />
              </div>

              <div>
                <label
                  htmlFor="images"
                  className="text-sm text-gray-600 block mb-1"
                >
                  {isEdit ? "New images (optional)" : "Images (Required)"}
                </label>
                <Controller
                  name="images"
                  control={control}
                  defaultValue={undefined}
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <input
                      id="images"
                      name={name}
                      ref={ref}
                      type="file"
                      multiple
                      accept="image/*"
                      onBlur={onBlur}
                      className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#112B54]"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          const urls = Array.from(files).map((file) =>
                            URL.createObjectURL(file)
                          );
                          setPreviewUrls((current) => {
                            current.forEach((url) => URL.revokeObjectURL(url));
                            return urls;
                          });
                        } else {
                          setPreviewUrls((current) => {
                            current.forEach((url) => URL.revokeObjectURL(url));
                            return [];
                          });
                        }
                        onChange(files);
                      }}
                    />
                  )}
                />
                {errors.images?.message && (
                  <p className="text-red-500 text-sm text-left mt-1">
                    {errors.images.message}
                  </p>
                )}

                {previewUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Image preview</p>
                    <div className="flex flex-wrap gap-3">
                      {previewUrls.map((src, index) => (
                        <img
                          key={`${src}-${index}`}
                          src={src}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-24 rounded-lg border object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Select
                name={"category"}
                title={"Category"}
                id={"product-category"}
                hiddenValue={"Category"}
                optionsValue={["Normal", "Moderate", "Gaming", "High Performance"]}
              />

              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#112B54]">
                      Detailed specifications
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 max-w-xl">
                      
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => append({ label: "", value: "" })}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      + Add row
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        SPEC_PRESETS.forEach(([label, value]) =>
                          append({ label, value })
                        );
                      }}
                      className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-50"
                    >
                      + Common headings
                    </button>
                  </div>
                </div>
                {fields.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    No extra specs yet. Use &quot;Add row&quot; or &quot;Common
                    headings&quot; to start.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {fields.map((field, index) => (
                      <li
                        key={field.id}
                        className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                      >
                        <div>
                          <label className="text-xs text-gray-600">Label</label>
                          <input
                            type="text"
                            className="mt-0.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            placeholder="e.g. Processor"
                            {...register(`specs.${index}.label`)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Value</label>
                          <input
                            type="text"
                            className="mt-0.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            placeholder="e.g. Intel Core i5-1335U"
                            {...register(`specs.${index}.value`)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 sm:mb-0.5"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label
                  className="text-sm text-gray-600"
                  htmlFor="product-description"
                >
                 <p className="font-semibold"> Description</p>
                </label>
               
                <textarea
                  id="product-description"
                  rows={4}
                  placeholder="Between 10 to 300 characters."
                  className="w-full mt-1 px-4 py-3 rounded-xl border cursor-pointer  border-gray-300 focus:ring-2 focus:ring-[#112B54]"
                  {...register("description")}
                />
                {errors.description?.message && (
                  <p className="text-red-500 text-sm text-left mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <button
  type="submit"
  disabled={status.kind === "loading" || !editReady}
  className="flex items-center justify-center w-full sm:w-1/4 cursor-pointer py-3 px-6 rounded-xl 
             bg-linear-to-r from-[#112B54] to-blue-600 text-white font-semibold shadow-md
             /* Enhanced Hover & Transition */
             transition-all duration-300 ease-out
             hover:-translate-y-1 hover:shadow-xl hover:brightness-110 hover:saturate-110
             /* Click Feedback */
             active:translate-y-0 active:scale-95 active:shadow-inner
             /* Disabled State */
             disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
>
  {status.kind === "loading" ? (
    <>
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {isEdit ? "Saving..." : "Uploading..."}
    </>
  ) : (
    isEdit ? "Save changes" : "Upload product"
  )}
</button>

            </form>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
