import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-[150vh] bg-linear-to-br from-gray-50 to-gray-100 px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#112B54] mb-4">
            About Us
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome to the ultimate destination for your digital lifestyle. We
            specialize in high-performance laptops and cutting-edge accessories
            designed to fuel your creativity and boost your productivity.
            Whether you're a professional seeking efficiency or a creator
            pushing boundaries, we provide the reliable hardware you need to
            achieve your vision with total confidence.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold text-[#112B54] mb-3">
              Our Mission
            </h2>
            <p className="text-gray-600">
              Our mission is to provide high-performance laptop gear that
              empowers users to innovate, improve productivity, and achieve
              their vision with cutting-edge tech.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold text-[#112B54] mb-3">
              Our Vision
            </h2>
            <p className="text-gray-600">
              Our vision is to become a leading tech provider known for
              quality, reliability, and delivering exceptional hardware
              experiences to users worldwide.
            </p>
          </div>
        </div>

       

        

        {/* Why Choose Us */}
        <div>
          <h2 className="text-3xl font-bold text-[#112B54] text-center mb-10">
            Why Choose Us
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Modern Design",
                desc: "Clean, modern UI/UX designs tailored for best user experience.",
              },
              {
                title: "Reliable",
                desc: "We deliver consistent and dependable solutions for your business.",
              },
              {
                title: "Fast Performance",
                desc: "Optimized applications that ensure speed and scalability.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-md border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-[#112B54] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-xl border border-gray-200">
          <h2 className="text-3xl font-bold text-[#112B54] mb-4">
            Want to work with us?
          </h2>
          <p className="text-gray-600 mb-6">
            Let’s build something amazing together. Reach out to us today.
          </p>
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
