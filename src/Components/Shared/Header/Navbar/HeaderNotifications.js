import React, { useState, useEffect, useRef } from "react";
import { LuBellRing, LuBell } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
// import { HeaderNotificationSample } from "../../../lib/Consts/HeaderNotificationSample.js";
import {
  useGetNotificationsByYearQuery,
  useUpdateNotificationMutation,
} from "../../../../features/Notifications/notificationsApiSlice.js";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../../features/AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import useAuth from "../../../../hooks/useAuth";
import { useSelector } from "react-redux";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { PiStudent } from "react-icons/pi";
import { BsConeStriped } from "react-icons/bs";

const HeaderNotifications = () => {
  const navigate = useNavigate();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId);
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  );

  // const [selectedYear, setSelectedYear] = useState(selectedAcademicYear?.title);
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
  const [
    updateNotification,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateNotificationMutation();

  const notificationsList = isNotificationsSuccess
    ? Object.values(notifications.entities)
    : [];

  useEffect(() => {
    if (isUpdateSuccess) {
      refetch();
    }
  }, [refetch, isUpdateSuccess]);
  const [formData, setFormData] = useState({});

  // Toggle the menu visibility
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Close the menu explicitly
  const handleClickNotification = async (e, notification) => {
    e.preventDefault(); // Prevent default behavior
    setIsMenuOpen(false);

    if (notification && Array.isArray(notification?.notificationIsRead)) {
      // Create an updated notification object
      const updatedNotification = {
        ...notification,
        notificationIsRead: (notification?.notificationIsRead || []).includes(
          userId
        )
          ? notification.notificationIsRead || [] // Keep the array as is if userId is already there
          : [...notification.notificationIsRead, userId], // Add userId to the array if not
      };

      // Update the state with the updated notification
      setFormData(updatedNotification);

      // Navigate based on notification type
      if (notification?.notificationType === "Payment")
        navigate(`/finances/payments/paymentsList/`);
      if (notification?.notificationType === "Admission")
        navigate(`/students/admissions/admissions/`);
      if (notification?.notificationType === "Expense")
        navigate(`/finances/expenses/expensesList/`);
      if (notification?.notificationType === "Leave")
        navigate(`/hr/leaves/leavesList/`);

      // Call the update query with the updated notification
      await updateNotification(updatedNotification);
    }
  };

  // console.log(formData, "formData");
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside both the button and the menu
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handlePopState = () => {
      setIsMenuOpen(false); // Close menu when the back button is clicked
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  //console.log(notificationsList, "notificationsList");

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-sky-600 text-white"
        aria-label="Manage notifications"
      >
        {notificationsList.length > 0 &&
        notificationsList.some((notif) =>
          (notif.notificationIsRead || []).includes(userId)
        ) ? (
          <LuBellRing className={`text-3xl `} />
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
          className="absolute right-0 mt-2 w-72 bg-white border border-gray-300 rounded-md shadow-lg z-50"
        >
          <button
            onClick={() => {
              navigate(`/notifications/notifications/notificationsList/`);
              setIsMenuOpen(false);
            }}
            className="flex font-semibold items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            aria-label="All notifications"
          >
            {/* <div className="px-4 py-2 text-sm font-semibold text-gray-700"> */}
            <LuBellRing className="text-xl" />
            All Notifications
          </button>
          <div className="border-t border-gray-200"></div>
          <ul className=" max-h-100 overflow-y-auto">
            {notificationsList?.length > 0 &&
              notificationsList.map((notif) => (
                <li
                  key={notif.id}
                  hidden={(notif.notificationIsRead || []).includes(userId)}
                >
                  <button
                    className={`flex items-center ${
                      !(notif.notificationIsRead || []).includes(userId) &&
                      notif?.notificationType === "Payment"
                        ? "bg-green-200 text-gray-700"
                        : ""
                    }${
                      !(notif.notificationIsRead || []).includes(userId) &&
                      notif?.notificationType === "Leave"
                        ? "bg-amber-200 text-gray-700"
                        : ""
                    } ${
                      !(notif.notificationIsRead || []).includes(userId) &&
                      notif?.notificationType === "Expense"
                        ? "bg-red-200 text-gray-700"
                        : ""
                    } ${
                      !(notif.notificationIsRead || []).includes(userId) &&
                      notif?.notificationType === "Admission"
                        ? "bg-sky-200 text-gray-700"
                        : ""
                    }  border-t border-gray-100 gap-2 w-full px-4 py-2   text-sm text-gray-500 hover:bg-gray-100`}
                    onClick={(e) => handleClickNotification(e, notif)}
                    aria-label={`Notification ${notif.id}`}
                  >
                    {/* Icon Wrapper */}
                    <div className="flex-shrink-0">
                      {notif?.notificationType === "Payment" && (
                        <GiReceiveMoney
                          className={`text-2xl text-green-600 ${
                            (notif?.notificationIsRead || []).includes(userId)
                              ? "text-green-400"
                              : "text-green-600"
                          }`}
                        />
                      )}
                      {notif?.notificationType === "Expense" && (
                        <GiPayMoney
                          className={`text-2xl  ${
                            (notif?.notificationIsRead || []).includes(userId)
                              ? "text-red-400"
                              : "text-red-600"
                          }`}
                        />
                      )}
                      {notif?.notificationType === "Admission" && (
                        <PiStudent
                          className={`text-2xl  ${
                            (notif?.notificationIsRead || []).includes(userId)
                              ? "text-sky-400"
                              : "text-sky-600"
                          }`}
                        />
                      )}
                      {notif?.notificationType === "Leave" && (
                        <BsConeStriped
                          className={`text-2xl  ${
                            (notif?.notificationIsRead || []).includes(userId)
                              ? "text-amber-400"
                              : "text-amber-600"
                          }`}
                        />
                      )}
                    </div>
                    {/* Text Content */}
                    <div className="flex-1 text-left">
                      <span className="font-bold block">{notif.type}</span>
                      <span className="block">{notif.notificationExcerpt}</span>
                    </div>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeaderNotifications;
