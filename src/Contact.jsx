import React, { useState, useEffect } from "react";
import { API_BASE } from "./config/api.js";

export default function ContactUs() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setSending(true);

    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({ type: "error", message: data.message || "Failed to send message." });
        return;
      }

      setStatus({ type: "success", message: "Message sent successfully!" });
      setFormData({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="min-h-[100vh] bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12"
      style={{
        animation: "fadeInUp 0.6s ease-out both",
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10">
        {/* Left Info Section */}
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#112B54] leading-tight">
            Let's Talk
          </h2>
          <p className="text-gray-600 text-lg">
            Have a question in mind or just want to say hello? Fill out the form
            and we'll get back to you as soon as possible.
          </p>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#112B54]/10 flex items-center justify-center rounded-full">
                📧
              </div>
              <span>orakitech@gmail.com</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#112B54]/10 flex items-center justify-center rounded-full">
                📞
              </div>
              <span>+92 333 3777337</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#112B54]/10 flex items-center justify-center rounded-full">
                📍
              </div>
              <span>Islamabad, Pakistan</span>
            </div>
          </div>

          {/* Decorative Box */}
          <div className="hidden md:flex mt-10 h-40 bg-linear-to-r from-[#112B54] to-blue-500 rounded-2xl shadow-lg p-6">
            <div className="text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-50/90">
                Welcome to OrakiTech
              </p>
              <p className="mt-3 text-base leading-relaxed text-white/95">
                Where great products meet fast support. Tell us what you need and we’ll
                help you move forward with confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white/80 backdrop-blur-lg p-8 md:p-10 rounded-3xl shadow-xl border border-gray-200">
          {status.message && (
            <div
              className={`mb-6 rounded-xl px-4 py-3 text-sm ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className=" text-start text-gray-900 space-y-4">
            <div className="  grid md:grid-cols-2 gap-4">
              <div>
                <label className=" text-sm ">First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#112B54] transition"
                />
              </div>

              <div>
                <label className="text-sm ">Last Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#112B54] transition"
                />
              </div>
            </div>

            <div>
              <label className="text-sm ">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#112B54] transition"
              />
            </div>

            <div>
              <label className="text-sm ">Phone <span className="text-red-500">*</span></label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+92 300 1234567"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#112B54] transition"
              />
            </div>

            <div>
              <label className="text-sm ">Subject <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="How can we help?"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#112B54] transition"
              />
            </div>

            <div>
              <label className="text-sm  ">Message </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Write your message here..."
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#112B54] transition"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-xl bg-linear-to-r from-[#112B54] to-blue-600 text-white font-semibold hover:opacity-90 transition shadow-md disabled:opacity-50 cursor-pointer"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
