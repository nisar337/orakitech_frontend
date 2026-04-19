export default function AdminPlaceholder({ title }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow border text-gray-600 max-w-2xl">
      <h2 className="text-xl font-semibold text-[#112B54] mb-2">{title}</h2>
      <p>
        This area is reserved for future features. Use{" "}
        <strong>Dashboard</strong>, <strong>Products</strong>, or{" "}
        <strong>Add product</strong> for live inventory tools.
      </p>
    </div>
  );
}
