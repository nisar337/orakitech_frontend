import { useEffect, useState } from "react";
import { API_BASE } from "../../config/api.js";
import { useAdminAuth } from "../../hooks/useAdminAuth.js";

export default function EditAbout() {
  const { adminFetch } = useAdminAuth();
  const [content, setContent] = useState({
    heroTitle: "",
    heroDescription: "",
    missionTitle: "",
    missionDescription: "",
    visionTitle: "",
    visionDescription: "",
    whyChooseUsTitle: "",
    features: [],
    ctaTitle: "",
    ctaDescription: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      const res = await adminFetch(`${API_BASE}/api/about`);
      const data = await res.json();
      setContent(data);
    } catch (err) {
      setMessage("Failed to load content");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await adminFetch(`${API_BASE}/api/about`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setMessage("About page updated successfully!");
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || "Failed to update content");
      }
    } catch (err) {
      setMessage("Network error");
    } finally {
      setSaving(false);
    }
  }

  function updateField(field, value) {
    setContent((prev) => ({ ...prev, [field]: value }));
  }

  function updateFeature(index, field, value) {
    const newFeatures = [...content.features];
    newFeatures[index][field] = value;
    setContent((prev) => ({ ...prev, features: newFeatures }));
  }

  function addFeature() {
    setContent((prev) => ({
      ...prev,
      features: [...prev.features, { title: "", description: "" }],
    }));
  }

  function removeFeature(index) {
    setContent((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  }

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Edit About Page</h1>
      </div>

      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.includes("success")
              ? "bg-green-50 text-green-800"
              : "bg-rose-50 text-rose-800"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hero Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                type="text"
                value={content.heroTitle}
                onChange={(e) => updateField("heroTitle", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                value={content.heroDescription}
                onChange={(e) => updateField("heroDescription", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                rows={4}
                required
              />
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Mission</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  type="text"
                  value={content.missionTitle}
                  onChange={(e) => updateField("missionTitle", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={content.missionDescription}
                  onChange={(e) => updateField("missionDescription", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Vision</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  type="text"
                  value={content.visionTitle}
                  onChange={(e) => updateField("visionTitle", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={content.visionDescription}
                  onChange={(e) => updateField("visionDescription", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Why Choose Us</h2>
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Section Title
            </label>
            <input
              type="text"
              value={content.whyChooseUsTitle}
              onChange={(e) => updateField("whyChooseUsTitle", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="space-y-4">
            {content.features.map((feature, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Feature {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-xs text-rose-600 hover:text-rose-800"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => updateFeature(index, "title", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Description
                    </label>
                    <textarea
                      value={feature.description}
                      onChange={(e) =>
                        updateFeature(index, "description", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      rows={2}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="w-full rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              + Add Feature
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Call to Action</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                type="text"
                value={content.ctaTitle}
                onChange={(e) => updateField("ctaTitle", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                value={content.ctaDescription}
                onChange={(e) => updateField("ctaDescription", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#12366A] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0d2550] disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
