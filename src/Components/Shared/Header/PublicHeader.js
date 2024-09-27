import React from "react";

import { VscDashboard } from "react-icons/vsc";

import { LuUserCircle2 } from "react-icons/lu";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import logo from "../../../Data/logo.jpg";
// import { Link} from 'react-router'

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from "../../../features/auth/authApiSlice";
import useAuth from "../../../hooks/useAuth";

//these will be used to compare to the location in the url
const DASH_REGEX = /^\/dashboard(\/)?$/;
const TASKS_REGEX = /^\/desk\/tasks(\/)?$/;
const USERS_REGEX = /^\/admin\/users(\/)?$/;

const PublicHeader = () => {
  const { username } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  if (isLoading) return <p>Logging Out...</p>;

  if (isError) return <p>Error: {error.data?.message}</p>;

  // let dashClass = null
  // if (!DASH_REGEX.test(pathname) && !TASKS_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
  //     dashClass = "dash-header__container--small"
  // }

  const logoutButton = (
    <button
      className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
      title="Logout"
      onClick={sendLogout}
    >
      {" "}
      Logout
      <FontAwesomeIcon icon={faRightFromBracket} className="right" />
    </button>
  );

  //will show the dashboard button  icon in the header when not in dashboard page
  const onGoDashClicked = () => navigate("/dashboard");
  let goDashButton = null;
  if (pathname !== "/dashboard") {
    goDashButton = (
      <button
        className={username ? "" : "hidden"}
        title="Dashboard"
        onClick={onGoDashClicked}
      >
        <VscDashboard />
      </button>
    );
  }

  const content = (
    <div className="flex  items-center place-content-stretch  bg-gray-100 h-20">
      <div className="mr-2 ">
        {" "}
        <img
          src={logo}
          className="h-14 w-14 rounded block float-left  "
          alt="logo image"
        />
      </div>
      <div className="flex-1 ">{goDashButton}</div>
      <Menu>
        <MenuButton className="mr-4 ">
          <LuUserCircle2 fontSize={24} />
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom end"
          className=" origin-top-right rounded-md border  w-36 bg-sky-100 p-1 text-sm/6 text-gray-800 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <strong>User profile</strong>
          <MenuItem>
            <button
              onClick={() => navigate("/login")}
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
              href="link1target1StudentsParents"
            >
              Login
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={() => navigate("/users/ForgotPassword")}
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
              href="/target 1"
            >
              Forgot Password
            </button>
          </MenuItem>
          <div className="my-1 h-px bg-gray-500" />
          <MenuItem>{logoutButton}</MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
  return content;
};

export default PublicHeader;
