import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TbLogout } from "react-icons/tb";
import { LuKeyRound } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { LiaUserSolid } from "react-icons/lia";
import useAuth from "../../../../hooks/useAuth";

const HeaderUserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Reference to the dropdown menu

  // Toggle the menu visibility
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Close the menu
  const closeMenu = () => setIsMenuOpen(false);

  // Close the menu when clicking outside or pressing the back button
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    const handlePopState = () => {
      closeMenu(); // Close menu when the back button is clicked
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    closeMenu();
    navigate("/login");
  };

  return (
    <div className="relative">
      {/* User Icon */}
      <button
        onClick={toggleMenu}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-sky-600 text-white"
        aria-label="Manage profile"
      >
        <LiaUserSolid className="text-4xl" />
        {/* Green Circle */}
        <div className="absolute top-8 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      </button>

      {/* User Profile Dropdown */}
      {isMenuOpen && (
        <div
          ref={menuRef} // Attach ref to the dropdown menu
          className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50"
        >
          <div className="px-4 py-2 text-sm font-semibold text-gray-700">
            Manage Profile
          </div>
          <div className="border-t border-gray-200"></div>
          <ul className="py-1">
            <li>
              <button
                onClick={() => {
                  navigate(`/myProfile/myDetails/${userId}`);
                  closeMenu();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                aria-label="My Profile"
              >
                <FaRegUser className="text-lg" />
                My Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate(`/myProfile/editMyProfile/${userId}`);
                  closeMenu();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                aria-label="Edit Profile"
              >
                <FiSettings className="text-lg" />
                Edit Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/MyProfile/ResetPassword/");
                  closeMenu();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                aria-label="Reset Password"
              >
                <LuKeyRound className="text-lg" />
                Reset Password
              </button>
            </li>
            <div className="my-1 h-px bg-gray-200"></div>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                aria-label="Logout"
              >
                <TbLogout className="text-lg" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeaderUserProfile;
