import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "./config/api.js";

export default function About() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetch(`${API_BASE}/api/about/public`)
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Failed to load content</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[150vh] bg-linear-to-br from-gray-50 to-gray-100 px-4 py-16"
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
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#112B54] mb-4">
            {content.heroTitle}
          </h1>
          <p className="text-gray-600 text-lg">{content.heroDescription}</p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold text-[#112B54] mb-3">
              {content.missionTitle}
            </h2>
            <p className="text-gray-600">{content.missionDescription}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold text-[#112B54] mb-3">
              {content.visionTitle}
            </h2>
            <p className="text-gray-600">{content.visionDescription}</p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div>
          <h2 className="text-3xl font-bold text-[#112B54] text-center mb-10">
            {content.whyChooseUsTitle}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {content.features.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-md border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-[#112B54] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-xl border border-gray-200">
          <h2 className="text-3xl font-bold text-[#112B54] mb-4">
            {content.ctaTitle}
          </h2>
          <p className="text-gray-600 mb-6">{content.ctaDescription}</p>
          <Link
            to={"/contact"}
            className="px-6 py-3 rounded-xl bg-linear-to-r from-[#112B54] to-blue-600 text-white font-semibold hover:opacity-90 transition shadow-md"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
