//import { Link } from "react-router-dom";

import { HiOutlineBell } from "react-icons/hi2";
import { LuUserCircle2 } from "react-icons/lu";
import HeaderChat from "./HeaderChat"
const NavbarHeader = () => {
  return (
    <div className='flex items-center gap-2 mr-2'>
     
        
		<div className="">
			<HeaderChat/>
			
		</div>
		<div>
			<HiOutlineBell fontSize={24}/>
		</div>
		<div>
			<LuUserCircle2 fontSize={24}/>
		</div>         
    </div>  
  )
};

export default NavbarHeader;