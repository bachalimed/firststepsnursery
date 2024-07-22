
//this is the menu of the side barm the path should correspond to the App.js paths used in the routes
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
			path:"/students/studentsParents/",//needs to finish with this path and not /students so that section tabs could work
			spaced:false,
			sectionTabs:[
				{title:"Students",
				path:"/students/studentsParents/students/"},
				{title:"Parents",
				path:"/students/studentsParents/parents/"},
				{title:"New Student",
				path:"/students/studentsParents/newStudent/"}
			]
			},
			{title:"Admissions",
			icon: <IoFileTrayStackedOutline/>,
			path:"/students/admissions",
			spaced:false,
			sectionTabs:[
				{title:"Find",
				path:"/students/admissions/find"},
				{title:"New Admission",
				path:"/students/admissions/newAdmission"},
				{title:"blabla",
				path:"/students/admissions/blablabla"}
			]
			},
			{title:"Enrolments",
			icon: <FaListCheck/>,
			path:"/students/enrolments",
			spaced:false,
			sectionTabs:[
				{title:"ff",
				path:"/students/admissions/ff"},
				{title:"New enrr",
				path:"/students/admissions/nqwenr"},
				{title:"ffffff",
				path:"/students/admissions/ffefef"}
			]
			}
		]
	},
	{title:"Academics",
		icon: <IoSchoolOutline/>,
		path:"",
		submenu:true,
		subOpen:false,
		submenuItems:
		[{title:"School Plannings",
			icon: <MdOutlineBusinessCenter/>,
			path:"/academics/schoolPlannings",
			spaced:false
			},
			{title:"Nursery Plannings",
			icon: <LuSchool/>,
			path:"/academics/nurseryPlannings",
			spaced:false
			},
			{title:"Collection&Drop",
				icon: <HiMiniArrowsUpDown/>,
				path:"/academics/collectionDrop",
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
		[{title:"Employees",
			icon: <VscPerson/>,
			path:"/hr/employees/",
			spaced:false,
			sectionTabs:[
				{title:"Employees",
				path:"/hr/employees/"},
				
				{title:"New Employee",
				path:"/hr/newEmployee/"}
			]
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
			spaced:false,
			sectionTabs:[
				{title:"Tasks",
				path:"/desk/tasks"},
				
				{title:"New Task",
				path:"/desk/tasks/newTask/"}
			]
			},
			{title:"Chat",
				icon: <HiOutlineChatAlt/>,
				path:"/desk/Chat",
				spaced:false
			
			},
			{title:"Mails",
				icon: <LuMail/>,
				path:"/desk/mails",
				spaced:false
			}
			]
	},
	{title:"CMS",
		icon: <SiWebmoney/>,
		path:"/cms",
		spaced:false
	},
	{title:"Public",
		icon: <BiHome/>,
		path:"/",
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
			path:"/settings/dashboardSet",
			
			 },
		{title:"Students",
		icon: <PiStudent/>,
		path:"/settings/studentsSet",
		spaced:false
			},
			 
		{title:"Academics",
		icon: <IoSchoolOutline/>,
		path:"/settings/academicsSet",
		spaced:false,
		sectionTabs:[
			{title:"Academic Years",
			path:"/academicYears/"},
			
			{title:"bloblo",
			path:"/settings/bloblo/"}
		]
			},
	
		{title:"Finances",
		icon: <LiaFileInvoiceDollarSolid/>,
		path:"/settings/financesSet",
		spaced:false
			},
			 
		{title:"HR",
		icon: <GiHumanPyramid/>,
		path:"/settings/HRSet",
		spaced:false
			},
	
		{title:"Desk",
		icon: <FaMailBulk/>,
		path:"/settings/deskSet",
		spaced:false
			},
	
		{title:"CMS",
		icon: <SiWebmoney/>,
		path:"/settings/cmsSet",
		spaced:false
			}
		]
		 }
	
]

export const sidebarMenuDown=[
	

	{title:"Admin",
	   icon: <GrUserAdmin/>,
	   path:"",
	   spaced:false,
	   submenu:true,
	   subOpen:false,
	   submenuItems:
		   [{title:"Users Management",
				icon: <BsQuestionSquare/>,
				path:"/admin/usersManagement/",
				spaced:false,
				sectionTabs:[
					{title:"All Users",
					path:"/admin/usersManagement/users/"},
					
					{title:"New User",
					path:"/admin/usersManagement/newUser/"}
				]
			},
			{title:"blabla",
			icon: <GrTask/>,
			path:"/admin/blabla",
			spaced:false
			}]
	   },	 	 		 
	{title:"Logout",
		icon: <TbLogout/>,
		path:"/logout",
		spaced:false
		}
]
