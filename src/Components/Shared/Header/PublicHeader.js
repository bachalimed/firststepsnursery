import React, { useEffect, useState } from "react";
import { VscDashboard } from "react-icons/vsc";
import { LuUserCircle2 } from "react-icons/lu";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import logo from "../../../Data/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from "../../../features/auth/authApiSlice";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";

const PublicHeader = () => {
  const { username } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();
    const handleCloseBanner = () => {
      setIsBannerVisible(false);
    };
  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  if (isLoading) return <p>Logging Out...</p>;
  if (isError) return <p>Error: {error.data?.message}</p>;

  const logoutButton = (
    <button
      className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-200"
      title="Logout"
      onClick={sendLogout}
    >
      Logout
      <FontAwesomeIcon icon={faRightFromBracket} className="ml-2" />
    </button>
  );

  const onGoDashClicked = () => navigate("/dashboard/");
  const goDashButton =
    pathname !== "/dashboard/" ? (
      <button
        className={`${
          username ? "" : "hidden"
        } text-gray-600 hover:text-gray-800`}
        title="Dashboard"
        onClick={onGoDashClicked}
      >
        <VscDashboard className="text-2xl" />
      </button>
    ) : null;

//random circles
const generateCircles = (count) => {
  const colors = ['bg-red-600', 'bg-green-500', 'bg-sky-500', 'bg-amber-300', 'bg-fuchsia-500'];
  const circles = Array.from({ length: count }).map((_, index) => {
    const size = Math.random() * 50 + 10; // Random size between 10px and 60px
    const color = colors[Math.floor(Math.random() * colors.length)];
    const top = Math.random() * 100; // Random position
    const left = Math.random() * 100;
    return (
      <div
        key={index}
        className={`absolute ${color} rounded-full opacity-50`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          top: `${top}%`,
          left: `${left}%`,
        }}
      />
    );
  });

  return circles;
};
    const circles = generateCircles(10); // Generate 10 random circles


    // <header className="bg-sky-700 text-white py-1 px-3 md:px-1 flex md:flex-row md:justify-between items-center shadow-md relative overflow-hidden">
    //   {/* Background circles */}
    //   <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
    //     {circles}
    //   </div>
  return (
    <header className="bg-gray-100 shadow-lg">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <div className="flex items-center">
        <Link to="/"> <img
            src={logo}
            className="h-12 w-12 rounded-md object-cover"
            alt="Logo"
          /></Link>
          <h1 className="ml-3 text-lg font-semibold text-gray-700">
            First Steps Nursery  -  حضانة الخطوات الأولى
          </h1>
        </div>

        {/* Dashboard Button */}
        <div>{goDashButton}</div>

        {/* User Profile Menu */}
        <Menu>
        
          <MenuButton className="focus:outline-none">
            <LuUserCircle2 className="text-3xl text-gray-600 hover:text-gray-800" />
          </MenuButton>
          <MenuItems
            className="absolute right-4 top-16 mt-2 w-40 rounded-md border bg-white shadow-lg"
          >
            <div className="p-2">
              <strong className="block mb-2 text-sm text-gray-600">
                User Profile
              </strong>
              <MenuItem>
                <button
                  onClick={() => navigate("/login/")}
                  className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Login
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => navigate("/users/ForgotPassword/")}
                  className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Forgot Password
                </button>
              </MenuItem>
              <hr className="my-2 border-gray-300" />
              <MenuItem>{logoutButton}</MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>

     
      {/* Banner Section */}
      {isBannerVisible && (
        <div className="relative bg-sky-600 text-white">
          <div className="max-w-7xl mx-auto p-4 text-center relative">
            <p className="text-sm sm:text-base">
              🌟 *Enroll now for our upcoming term! Special discounts for early
              registrations.* 🌟
            </p>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none"
              onClick={handleCloseBanner}
              title="Close Banner"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
