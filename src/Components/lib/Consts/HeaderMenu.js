//not used so far


import { VscDashboard } from "react-icons/vsc";
import { PiStudent } from "react-icons/pi";

import { BiHome } from "react-icons/bi";

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
