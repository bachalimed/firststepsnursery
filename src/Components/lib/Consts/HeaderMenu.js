
import { VscDashboard } from "react-icons/vsc";
import { PiStudent, PiStudentBold } from "react-icons/pi";
import { GrSchedules, GrUserAdmin } from "react-icons/gr";
import { LuCircleDollarSign } from "react-icons/lu";
import { GiHumanPyramid } from "react-icons/gi";
import { FaMailBulk } from "react-icons/fa";
import { SiWebmoney } from "react-icons/si";
import { SlSettings } from "react-icons/sl";
import { BiHome } from "react-icons/bi";

import { TbLogout } from "react-icons/tb";

export const headerMenu=[
	{title:"home",
	icon: <BiHome/>,
	path:"/",
	spaced:false
	 },
	{title:"Dashboard",
	icon: <VscDashboard/>,
	path:"/dashboard",
	spaced:false
	 },
	 
	{title:"Students",
	icon: <PiStudent/>,
	path:"",
	submenu:true
	
	}
]
