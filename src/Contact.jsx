import React from "react";

export default function ContactUs() {
  return (
    <div className="min-h-[150vh] bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-16">
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
          <div className="hidden md:block mt-10 h-40 bg-linear-to-r from-[#112B54] to-blue-500 rounded-2xl shadow-lg"></div>
        </div>

        {/* Form Section */}
        <div className="bg-white/80 backdrop-blur-lg p-8 md:p-10 rounded-3xl shadow-xl border border-gray-200">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#112B54] transition"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#112B54] transition"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#112B54] transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Phone (Optional)</label>
              <input
                type="tel"
                placeholder="+92 300 1234567"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#112B54] transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Subject</label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#112B54] transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Message</label>
              <textarea
                rows="5"
                placeholder="Write your message here..."
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#112B54] transition"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-linear-to-r from-[#112B54] to-blue-600 text-white font-semibold hover:opacity-90 transition shadow-md"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
