
import { VscDashboard } from "react-icons/vsc";
import { PiStudent, PiStudentBold } from "react-icons/pi";
import { GrSchedules, GrUserAdmin } from "react-icons/gr";
import { LuCircleDollarSign } from "react-icons/lu";
import { GiHumanPyramid } from "react-icons/gi";
import { FaMailBulk } from "react-icons/fa";
import { SiWebmoney } from "react-icons/si";
import { SlSettings } from "react-icons/sl";
import { BiHome } from "react-icons/bi";
import { RiParentLine } from "react-icons/ri";
import { IoFileTrayStackedOutline } from "react-icons/io5";
import { MdOutlineAttachFile } from "react-icons/md";
import { IoSchoolOutline } from "react-icons/io5";
import { LuSchool } from "react-icons/lu";
import { IoBusinessOutline } from "react-icons/io5";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { BiBus } from "react-icons/bi";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { GiReceiveMoney } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";










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
			icon: <RiParentLine/>,
			path:"/students",
			spaced:false
			},
			{title:"Admissions",
			icon: <IoFileTrayStackedOutline/>,
			path:"/students/admissions",
			spaced:false
			},
			{title:"Enrolments",
			icon: <MdOutlineAttachFile/>,
			path:"/students/enrolments",
			spaced:false
			}
		]
	},
	{title:"Academics",
		icon: <IoSchoolOutline/>,
		path:"",
		submenu:true,
		subOpen:false,
		submenuItems:
		[{title:"School Planings",
			icon: <MdOutlineBusinessCenter/>,
			path:"/academics/planings",
			spaced:false
			},
			{title:"Nursery Planings",
			icon: <LuSchool/>,
			path:"/academics/nurseryPlanings",
			spaced:false
			},
			{title:"Collection",
				icon: <BiBus/>,
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
			icon: <LiaFileInvoiceDollarSolid/>,
			path:"/finances/invoices",
			spaced:false
			},
			{title:"Payments",
			icon: <GiReceiveMoney/>,
			path:"/finances/payments",
			spaced:false
			},
			{title:"Expenses",
				icon: <GiPayMoney/>,
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