
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

export const sidebarMenuUp=[
	{title:"home",
	icon: <BiHome/>,
	path:"/",
	spaced:false
	 },
	{title:"Dashboard",
	icon: <VscDashboard/>,
	path:"/dashboard",
	spaced:false,
	allowedRoles:["04","05"]
	 },
	 
	{title:"Students",
	icon: <PiStudent/>,
	path:"",
	submenu:true,
	subOpen:false,
	submenuItems:
		[{title:"Students & Parents",
			icon: <PiStudent/>,
			path:"/students",
			spaced:false
			},
			{title:"Admissions",
			icon: "",
			path:"/students/admissions",
			spaced:false
			},
			{title:"Enrolments",
			icon: "",
			path:"/students/enrolments",
			spaced:false
			}
		]
	},
	{title:"Academics",
		icon: <GrSchedules/>,
		path:"",
		submenu:true,
		subOpen:false,
		submenuItems:
		[{title:"School Planings",
			icon: "",
			path:"/academics/planings",
			spaced:false
			},
			{title:"Nursery Planings",
			icon: "",
			path:"/academics/nurseryPlanings",
			spaced:false
			},
			{title:"Collection",
				icon: "",
				path:"/academics/collection",
				spaced:false
			}
			]
	},
	{title:"Finances",
	icon: <LuCircleDollarSign/>,
	path:"",
	spaced:false,
	submenu:true,
	subOpen:false,
	submenuItems:
		[{title:"Invoices",
			icon: "",
			path:"/finances/invoices",
			spaced:false
			},
			{title:"Payments",
			icon: "",
			path:"/finances/payments",
			spaced:false
			},
			{title:"Expenses",
				icon: "",
				path:"/finances/expenses",
				spaced:false
			}
			]
		},
	
	{title:"HR",
	icon: <GiHumanPyramid/>,
	path:"",
	spaced:false,
	submenu:true,
	subOpen:false,
	submenuItems:
		[{title:"Staff",
			icon: "",
			path:"/hr/staff",
			spaced:false
			},
			{title:"Payroll",
			icon: "",
			path:"/hr/payroll",
			spaced:false
			},
			{title:"Leave",
				icon: "",
				path:"/hr/leave",
				spaced:false
			}
			]
		},
	{title:"Desk",
	icon: <FaMailBulk/>,
	path:"",
	spaced:false,
	submenu:true,
	subOpen:false,
	submenuItems:
		[{title:"Inquiries",
			icon: "",
			path:"/desk/inquiries",
			spaced:false
			},
			{title:"Tasks",
			icon: "",
			path:"/desk/tasks",
			spaced:false
			},
			{title:"Communication",
				icon: "",
				path:"/desk/communication",
				spaced:false
			
			},
			{title:"Mailing",
				icon: "",
				path:"/desk/mailing",
				spaced:false
			}
			]
	},
	{title:"CMS",
	icon: <SiWebmoney/>,
	path:"/cms",
	spaced:false
	},
	{title:"Settings",
		icon: <SlSettings/>,
		path:"",
		submenu:true,
		subOpen:false,
		submenuItems:
		[{title:"Dashboard",
			icon: <PiStudentBold/>,
			path:"/settings/dashboard",
			
			 },
			 {title:"Students",
				icon: "",
				path:"/settings/students",
				spaced:false
				 },
			 
				 {title:"Academics",
					icon: "",
					path:"/settings/academics",
					spaced:false
					 },
			 
				 {title:"Finances",
					icon: "",
					path:"/settings/finances",
					spaced:false
					 },
			 
				 {title:"HR",
					icon: "",
					path:"/settings/hr",
					spaced:false
					 },
			 
				 {title:"Desk",
					icon: "",
					path:"/settings/desk",
					spaced:false
					 },
			 
				 {title:"CMS",
					icon: "",
					path:"/settings/cms",
					spaced:false
					 }
		]
		 }
	
]

export const sidebarMenuDown=[
	
	{title:"Admin",
	   icon: <GrUserAdmin/>,
	   path:"/admin",
	   spaced:false
	   },	 	 		 
		{title:"Logout",
		   icon: <TbLogout/>,
		   path:"/logout",
		   spaced:false
			}
]