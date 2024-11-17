//import { Link } from "react-router-dom"

import HeaderChat from "./HeaderChat";
import HeaderNotifications from "./HeaderNotifications";
import HeaderUserProfile from "./HeaderUserProfile";

const NavbarHeader = () => {
  return (
    <div className="flex items-center gap-2 mr-2">
      
      
      {/* <div className="">
        <HeaderChat className="" />
      </div> */}
      <div>
        <HeaderNotifications className="" />
      </div>
      <div>
        <HeaderUserProfile />
      </div>
    </div>
  );
};

export default NavbarHeader;
