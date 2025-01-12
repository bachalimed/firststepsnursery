//import { Link } from "react-router-dom"

// import HeaderChat from "./HeaderChat";
// import HeaderNotifications from "./HeaderNotifications";
import HeaderUserProfile from "./HeaderUserProfile";

const NavbarHeader = () => {
  return (
    <div className="flex items-center gap-2 md:gap-4 ">
      {/* <div className="hidden sm:block">
        <HeaderChat className="" />
      </div> */}
      {/* <div className="hidden sm:block">
        <HeaderNotifications className="" />
      </div> */}
      <div className="flex items-center justify-between">
        <HeaderUserProfile className="relative z-60 " />
      </div>
    </div>
  );
};

export default NavbarHeader;
