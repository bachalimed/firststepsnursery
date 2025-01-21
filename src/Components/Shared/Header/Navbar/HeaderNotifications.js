import React, { useState, useEffect, useRef } from "react";
import { LuBellRing, LuBell } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
// import { HeaderNotificationSample } from "../../../lib/Consts/HeaderNotificationSample.js";
import { useGetNotificationsByYearQuery } from "../../../../features/Notifications/notificationsApiSlice.js";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../../features/AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import useAuth from "../../../../hooks/useAuth";
import { useSelector } from "react-redux";

const HeaderNotifications = () => {
  const navigate = useNavigate();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId);
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  );

  
  const [selectedYear, setSelectedYear] = useState(selectedAcademicYear?.title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Reference to the dropdown menu
  const {
    userId,
    isAdmin,
    canDelete,
    canView,
    canCreate,
    isDirector,

    isManager,
    isAcademic,
  } = useAuth();

  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    isSuccess: isNotificationsSuccess,
    refetch,
  } = useGetNotificationsByYearQuery(
    {
      //selectedYear,
      //selectedDate: new Date().toISOString().split("T")[0],
      criteria: "excerpt",
      userId,
      isAdmin,
      isDirector,
      isManager,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const notificationsList = isNotificationsSuccess
    ? Object.values(notifications.entities)
    : [];
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

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={toggleMenu}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-sky-600 text-white"
        aria-label="Manage notifications"
      >
        {notificationsList.length > 0 ? (
          <LuBellRing className={`text-3xl`} />
        ) : (
          <LuBell className={`text-3xl`} />
        )}
        {/* Notification Badge */}
        {/* <div
          className={`absolute top-8 right-0 w-3 h-3 ${
            notificationsList.length > 0 ? "bg-red-500" : ""
          } rounded-full border-2 border-white`}
        ></div> */}
      </button>

      {/* Notifications Dropdown */}
      {isMenuOpen && (
        <div
          ref={menuRef} // Attach ref to the dropdown menu
          className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50"
        >
          <button
            onClick={() => {
              navigate(`/notifications/notifications/notificationsList/`);
              closeMenu();
            }}
            className="flex font-semibold items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            aria-label="All notifications"
          >
            {/* <div className="px-4 py-2 text-sm font-semibold text-gray-700"> */}
            <LuBellRing className="text-xl" />
            All Notifications
          </button>
          <div className="border-t border-gray-200"></div>
          <ul className="py-1 max-h-80 overflow-y-auto">
            {/* <li>
              <button
                onClick={() => {
                  navigate(`/notifications/notifications/notificationsList/`);
                  closeMenu();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                aria-label="All notifications"
              >
                <LuBellRing className="text-xl" />
                All Notifications
              </button>
            </li> */}
            {notificationsList?.length > 0 ? (
              notificationsList.map((notif) => (
                <li key={notif.id}>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeMenu}
                    aria-label={`Notification ${notif.id}`}
                  >
                    {" "}
                    <LuBellRing className="text-xl" />
                    {notif.type} {notif.notificationExcerpt} 
                  </button>
                </li>
              ))
            ) : (
              <li>No new Notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeaderNotifications;
