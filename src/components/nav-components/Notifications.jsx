import { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";

export default function Notifications() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // In a real app, you'd fetch notifications from an API
  // For now, we're showing an empty list by default
  useEffect(() => {
    // Placeholder: You can replace this with an API call to fetch notifications
    // Example: fetch(`${API_BASE}/api/notifications`)
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={notifRef}>
      <button
        type="button"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative cursor-pointer text-white py-2 text-xl hover:scale-110 hover:text-blue-300 transition-all duration-300 focus:outline-none focus-visible:outline-none focus:ring-0"
        style={{ outline: "none" }}
        title="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs font-bold text-white flex items-center justify-center ">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-12 z-50 w-80 origin-top-right rounded-lg border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <FaBell className="text-4xl text-gray-300 mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  No new notifications
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                      !notif.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-900">
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {notif.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-slate-200 px-4 py-2 text-center">
              <button
                type="button"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
