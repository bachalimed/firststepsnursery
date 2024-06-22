//import { Link } from "react-router-dom";

import { HiOutlineBell } from "react-icons/hi2";
import { HiOutlineChatAlt } from "react-icons/hi";
import { LuUserCircle2 } from "react-icons/lu";

const NavbarHeader = () => {
  return (
    <div className='flex items-center gap-2 mr-2'>
     
        
            <div className="">
              <HiOutlineChatAlt fontSize={24}/>
            </div>
            <div>
              <HiOutlineBell fontSize={24}/>
            </div>
            <div>
              <LuUserCircle2 fontSize={24}/>
            </div>
            
         
            <div>dropdwn</div>
         
               
    </div>
    
  )
};

export default NavbarHeader;