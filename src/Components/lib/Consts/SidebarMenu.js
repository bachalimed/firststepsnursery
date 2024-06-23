
import { VscDashboard, VscPerson } from "react-icons/vsc";
import { PiStudent } from "react-icons/pi";
import { GrUserAdmin, GrTask } from "react-icons/gr";
import { LuCircleDollarSign, LuSchool, LuMail } from "react-icons/lu";
import { GiHumanPyramid, GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { FaMailBulk } from "react-icons/fa";
import { SiWebmoney } from "react-icons/si";
import { SlSettings } from "react-icons/sl";
import { BiHome } from "react-icons/bi";
import { RiParentLine } from "react-icons/ri";
import { IoFileTrayStackedOutline, IoSchoolOutline } from "react-icons/io5";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { FaListCheck } from "react-icons/fa6";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { TbCreditCardPay, TbLogout } from "react-icons/tb";
import { MdOutlinePermContactCalendar } from "react-icons/md";
import { BsQuestionSquare } from "react-icons/bs";
import { HiOutlineChatAlt } from "react-icons/hi";



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
			icon: <FaListCheck/>,
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
				icon: <HiMiniArrowsUpDown/>,
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
			icon: <VscPerson/>,
			path:"/hr/staff",
			spaced:false
			},
			{title:"Payroll",
			icon: <TbCreditCardPay/>,
			path:"/hr/payroll",
			spaced:false
			},
			{title:"Leave",
				icon: <MdOutlinePermContactCalendar/>,
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
			icon: <BsQuestionSquare/>,
			path:"/desk/inquiries",
			spaced:false
			},
			{title:"Tasks",
			icon: <GrTask/>,
			path:"/desk/tasks",
			spaced:false
			},
			{title:"Chat",
				icon: <HiOutlineChatAlt/>,
				path:"/desk/Chat",
				spaced:false
			
			},
			{title:"Mailing",
				icon: <LuMail/>,
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
			icon: <VscDashboard/>,
			path:"/settings/dashboard",
			
			 },
			 {title:"Students",
				icon: <PiStudent/>,
				path:"/settings/students",
				spaced:false
				 },
			 
				 {title:"Academics",
					icon: <IoSchoolOutline/>,
					path:"/settings/academics",
					spaced:false
					 },
			 
				 {title:"Finances",
					icon: <LiaFileInvoiceDollarSolid/>,
					path:"/settings/finances",
					spaced:false
					 },
			 
				 {title:"HR",
					icon: <GiHumanPyramid/>,
					path:"/settings/hr",
					spaced:false
					 },
			 
				 {title:"Desk",
					icon: <FaMailBulk/>,
					path:"/settings/desk",
					spaced:false
					 },
			 
				 {title:"CMS",
					icon: <SiWebmoney/>,
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