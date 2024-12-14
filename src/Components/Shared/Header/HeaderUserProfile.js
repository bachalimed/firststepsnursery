import React from "react";
import { LuUserCircle2 } from "react-icons/lu";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TbLogout } from "react-icons/tb";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from "../../../features/auth/authApiSlice";
import useAuth from "../../../hooks/useAuth";
import { PiUserSquare } from "react-icons/pi";
import { LuKeyRound } from "react-icons/lu";
import { PiUserCircleLight } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";

const HeaderUserProfile = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { userId } = useAuth();
  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  if (isLoading) return <>Logging Out...</>;

  if (isError) return <>Error: {error.data?.message}</>;

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
      <TbLogout aria-label="Logout" className=" text-2xl right" />
      Logout
    </button>
  );

  const content = (
    <Menu>
      <MenuButton>
        <PiUserCircleLight
          aria-label="manage profile"
          fontSize={24}
          className="text-4xl text-white-500"
        />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        aria-label="manage profile"
        className=" origin-top-right  border  w-42 bg-sky-100 p-1 text-sm/6 text-gray-800 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <strong>Manage profile</strong>
        {/* <MenuItem>
            
            <button onClick={()=>navigate('/login')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" href="link1target1StudentsParents">
              Login
            </button>
            
          </MenuItem>
          <MenuItem>
            <button onClick={()=>navigate('/users/ForgotPassword')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" href="/target 1">        
              Forgot Password 
            </button>
          </MenuItem> */}
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
        <MenuItem>
          <button
            onClick={() => navigate(`/myProfile/editMyProfile/${userId}`)}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
            aria-label="edit my details"
          >
            <FiSettings aria-label="edit my details" className="size-4 " />
            Edit Profile
          </button>
        </MenuItem>
        <MenuItem>
          <button
            onClick={() => navigate("/MyProfile/ResetPassword/")}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
            aria-label="reset password"
          >
            <LuKeyRound
              aria-label="user details"
              className="size-4 fill-white/30  "
            />
            Reset Password
          </button>
        </MenuItem>

        <div className="my-1 h-px bg-gray-500 "></div>
        <MenuItem>{logoutButton}</MenuItem>
      </MenuItems>
    </Menu>
  );
  return content;
};
export default HeaderUserProfile;
