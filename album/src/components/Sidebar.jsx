import { Link } from "react-router-dom";
import { useEffect } from "react";

const Sidebar = ({ isOpen, user, toggleSlidebar, profileImage }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSlidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-40 flex flex-col pt-16`}
      >
        {/* Avatar Section */}
        <div className="p-4 border-b text-center">
          <img
            src={profileImage || "/default_avatar.png"}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover mx-auto shadow"
          />
          <h2 className="text-sm font-semibold mt-2 break-words">{user?.email}</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-3 text-gray-700 text-sm">
          <Link to="/home" onClick={toggleSlidebar} className="block hover:text-blue-600">
            🏠 Home
          </Link>
          <Link to="/album" onClick={toggleSlidebar} className="block hover:text-blue-600">
            🖼 My Album
          </Link>
          <Link to="/edit-profile" onClick={toggleSlidebar} className="block hover:text-blue-600">
            ✏️ Edit Profile
          </Link>
        </nav>

        {/* Mobile Close Button */}
        <div className="p-4 md:hidden">
          <button
            onClick={toggleSlidebar}
            className="w-full text-left text-gray-500 hover:text-red-600"
          >
            🚪 Close Sidebar
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
