import React, { useEffect, useState } from "react";
import { BiSolidSchool } from "react-icons/bi";
import { LiaUserSolid } from "react-icons/lia";
import { useSelector } from "react-redux";

import { TbLogout } from "react-icons/tb";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import logo from "../../../Data/logo.jpg";
import { FaRegUser } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from "../../../features/auth/authApiSlice";
import { LuKeyRound } from "react-icons/lu";
import { Link } from "react-router-dom";
import AnimatedColorText from "../../lib/Utils/AnimatedColorText";
import useAuth from "../../../hooks/useAuth";
import { RiLoginBoxLine } from "react-icons/ri";
//import GenerateCircles from "../../lib/Utils/GenerateCircles";
const PublicHeader = () => {
  const { username, userId } = useAuth();
  const company = { label: "First Steps", type: " Nursery" };
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isBannerVisible, setIsBannerVisible] = useState(true);
 // check if user is logged in
  const isLoggedIn = useSelector((state) => Boolean(state.auth.token));
  const handleCloseBanner = () => {
    setIsBannerVisible(false);
  };
  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/login/");
  }, [isSuccess, navigate]);

  if (isLoading) return <p>Logging Out...</p>;
  if (isError) return <p>Error: {error.data?.message}</p>;

  const logoutButton = (
    <button
      className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
      title="Logout"
      onClick={sendLogout}
    >
      <TbLogout aria-label="Logout" className=" text-2xl right" />
      Logout
    </button>
  );

  const onGoDashClicked = () => navigate("/dashboard/studentsDash/");

  return (
    <header className="bg-sky-700 text-white py-1 px-3 md:px-1 flex  justify-between items-center  overflow-hidden">
        <Link to="/">
          <img
            src={logo}
            className="h-12 w-12 rounded "
            alt="first steps nursery logo"
            
          />
        </Link>

        {/* <div className="flex items-center max-sm:hidden"> */}
        <div className="flex items-center ">
          <AnimatedColorText company={company} />
        </div>
      {/* Top Navigation */}
      <div className="  items-center justify-center mr-4 mt-1 ">
        {/* Dashboard Button */}

        {pathname !== "/dashboard/" && (
          <button
            className={` ${
              username ? "" : "hidden"
            } text-white hover:text-gray-100 `}
            title="Dashboard"
            onClick={onGoDashClicked}
            aria-label="dashboard"
          >
            <BiSolidSchool aria-label="Dashboard" className="text-4xl" />
          </button>
        )}

        {/* User Profile Menu */}
        <Menu>
          <MenuButton className="focus:outline-none ">
            {/* User Icon */}
                   <LiaUserSolid
                     aria-label="manage profile"
                     fontSize={24}
                     className="text-4xl text-white-500"
                   />
                   {/* Green Circle */}
                   {isLoggedIn && (
                     <div
                      className="absolute top-8 right-5 w-3 h-3 bg-green-500 rounded-full "
                     ></div>
                   )}
          </MenuButton>
          <MenuItems
            transition
            aria-label="manage profile"
            anchor="bottom end"
            className=" origin-top-right  border   bg-sky-100 p-1 text-sm/6 text-gray-800 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0" //w-42
          >
            <strong>Manage profile</strong>
            {!userId && (
              <MenuItem>
                <button
                  onClick={() => navigate("/login/")}
                  aria-label="login"
                  className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                >
                  <RiLoginBoxLine
                    aria-label="user details"
                    className="size-4 "
                  />
                  Login
                </button>
              </MenuItem>
            )}

            {userId && (
              <MenuItem>
                <button
                  onClick={() => navigate(`/myProfile/myDetails/${userId}`)}
                  className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                  aria-label="user details"
                >
                  <FaRegUser aria-label="user details" className="size-4 " />
                  My Profile
                </button>
              </MenuItem>
            )}
            {userId && (
              <MenuItem>
                <button
                  onClick={() => navigate(`/myProfile/editMyProfile/${userId}`)}
                  className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                  aria-label="edit my details"
                >
                  <FiSettings
                    aria-label="edit my details"
                    className="size-4 "
                  />
                  Edit Profile
                </button>
              </MenuItem>
            )}

            <MenuItem>
              <button
                onClick={() => navigate("/ForgotPassword/")}
                aria-label="forgot password"
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
              >
                <LuKeyRound
                  aria-label="user details"
                  className="size-4 fill-white/30  "
                />
                Forgot Password
              </button>
            </MenuItem>
            {userId && <div className="my-1 h-px bg-gray-500 "></div>}
            {userId && <MenuItem>{logoutButton}</MenuItem>}
          </MenuItems>
        </Menu>
      </div>

      {/* Banner Section */}
      {/* {isBannerVisible && (
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
      )} */}
    </header>
  );
};

export default PublicHeader;
