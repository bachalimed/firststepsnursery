
// //this is the menu of the side barm the path should correspond to the App.js paths used in the routes
// import { VscDashboard, VscPerson } from "react-icons/vsc"
// import { PiStudent } from "react-icons/pi"
// import { GrUserAdmin, GrTask } from "react-icons/gr"
// import { LuCircleDollarSign, LuSchool, LuMail } from "react-icons/lu"
// import { GiHumanPyramid, GiReceiveMoney, GiPayMoney } from "react-icons/gi"
// import { FaMailBulk } from "react-icons/fa"
// import { SiWebmoney } from "react-icons/si"
// import { SlSettings } from "react-icons/sl"
// import { BiHome } from "react-icons/bi"
// import { RiParentLine } from "react-icons/ri"
// import { IoFileTrayStackedOutline, IoSchoolOutline } from "react-icons/io5"
// import { MdOutlineBusinessCenter } from "react-icons/md"
// import { LiaFileInvoiceDollarSolid } from "react-icons/lia"
// import { FaListCheck } from "react-icons/fa6"
// import { HiMiniArrowsUpDown } from "react-icons/hi2"
// import { TbCreditCardPay, TbLogout } from "react-icons/tb"
// import { MdOutlinePermContactCalendar } from "react-icons/md"
// import { BsQuestionSquare } from "react-icons/bs"
// import { HiOutlineChatAlt } from "react-icons/hi"

// export const sidebarMenuUp=[
	
// 	{title:"Dashboard",
// 	icon: <VscDashboard/>,
// 	path:"/dashboard",
// 	spaced:false,
// 	allowedRoles:["Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"]
// 	 },
	 
// 	{title:"Students",
// 	icon: <PiStudent/>,
// 	path:"",
// 	allowedRoles:["Parent", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 	submenu:true,
// 	subOpen:false,
// 	submenuItems:
// 		[{title:"Students & Parents",
// 			icon: <RiParentLine/>,
// 			path:"/students/studentsParents/",//needs to finish with this path and not /students so that section tabs could work
// 			allowedRoles:["Parent", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 			spaced:false,
// 			sectionTabs:[
// 				{title:"Students",
// 				path:"/students/studentsParents/students/"
// 				},
// 				{title:"Parents",
// 				path:"/students/studentsParents/parents/"
// 				},
// 				{title:"New Student",
// 				path:"/students/studentsParents/newStudent/"
// 				}
// 				]
// 			},
// 			{title:"Admissions",
// 			icon: <IoFileTrayStackedOutline/>,
// 			path:"/students/admissions",
// 			allowedRoles:["Parent", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 			spaced:false,
// 			sectionTabs:[
// 				{title:"Find",
// 				path:"/students/admissions/find"},
// 				{title:"New Admission",
// 				path:"/students/admissions/newAdmission"},
// 				{title:"blabla",
// 				path:"/students/admissions/blablabla"}
// 			]
// 			},
// 			{title:"Enrolments",
// 			icon: <FaListCheck/>,
// 			path:"/students/enrolments",
// 			allowedRoles:["Parent", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 			spaced:false,
// 			sectionTabs:[
// 				{title:"ff",
// 				path:"/students/admissions/ff"},
// 				{title:"New enrr",
// 				path:"/students/admissions/nqwenr"},
// 				{title:"ffffff",
// 				path:"/students/admissions/ffefef"}
// 			]
// 			}
// 		]
// 	},
// 	{title:"Academics",
// 		icon: <IoSchoolOutline/>,
// 		path:"",
// 		allowedRoles:["Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 		submenu:true,
// 		subOpen:false,
// 		submenuItems:
// 		[{title:"School Plannings",
// 			icon: <MdOutlineBusinessCenter/>,
// 			path:"/academics/schoolPlannings",
// 			allowedRoles:["Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 			spaced:false
// 			},
// 			{title:"Nursery Plannings",
// 			icon: <LuSchool/>,
// 			path:"/academics/nurseryPlannings",
// 			allowedRoles:["Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 			spaced:false
// 			},
// 			{title:"Collection&Drop",
// 				icon: <HiMiniArrowsUpDown/>,
// 				path:"/academics/collectionDrop",
// 				allowedRoles:["Parent","ContentManager", "Animator", "Academic", "Director",  "Desk", "Manager", "Admin"],
// 				spaced:false
// 			}
// 			]
// 	},
// 	{title:"Finances",
// 	icon: <LuCircleDollarSign/>,
// 	path:"",
// 	allowedRoles:["Academic", "Director", "Finance", "HR",  "Manager", "Admin"],
// 	spaced:false,
// 	submenu:true,
// 	subOpen:false,
// 	submenuItems:
// 		[{title:"Invoices",
// 			icon: <LiaFileInvoiceDollarSolid/>,
// 			path:"/finances/invoices",
// 			allowedRoles:["Academic", "Director", "Finance", "HR",   "Manager", "Admin"],
// 			spaced:false
// 			},
// 			{title:"Payments",
// 			icon: <GiReceiveMoney/>,
// 			path:"/finances/payments",
// 			allowedRoles:["Academic", "Director", "Finance",   "Manager", "Admin"],
// 			spaced:false
// 			},
// 			{title:"Expenses",
// 				icon: <GiPayMoney/>,
// 				path:"/finances/expenses",
// 				allowedRoles:["Academic", "Director", "Finance",   "Manager", "Admin"],
// 				spaced:false
// 			}
// 			]
// 		},
	
// 	{title:"HR",
// 	icon: <GiHumanPyramid/>,
// 	path:"",
// 	allowedRoles:["Employee","Animator", "Academic", "Director", "HR", "Desk", "Manager", "Admin"],
// 	spaced:false,
// 	submenu:true,
// 	subOpen:false,
// 	submenuItems:
// 		[{title:"Employees",
// 			icon: <VscPerson/>,
// 			path:"/hr/employees/",
// 			allowedRoles:["Employee","Animator", "Academic", "Director", "HR", "Desk", "Manager", "Admin"],
// 			spaced:false,
// 			sectionTabs:[
// 				{title:"Employees",
// 				path:"/hr/employees/"},
				
// 				{title:"New Employee",
// 				path:"/hr/newEmployee/"}
// 			]
// 			},
// 			{title:"Payroll",
// 			icon: <TbCreditCardPay/>,
// 			path:"/hr/payroll",
// 			allowedRoles:["Employee","Animator", "Academic", "Director", "HR", "Desk", "Manager", "Admin"],
// 			spaced:false
// 			},
// 			{title:"Leave",
// 				icon: <MdOutlinePermContactCalendar/>,
// 				path:"/hr/leave",
// 				allowedRoles:["Employee","Animator", "Academic", "Director", "HR", "Desk", "Manager", "Admin"],
// 				spaced:false
// 			}
// 			]
// 		},
// 	{title:"Desk",
// 	icon: <FaMailBulk/>,
// 	path:"",
// 	allowedRoles:["Employee", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 	spaced:false,
// 	submenu:true,
// 	subOpen:false,
// 	submenuItems:
// 		[{title:"Inquiries",
// 			icon: <BsQuestionSquare/>,
// 			path:"/desk/inquiries/",
// 			allowedRoles:["Employee", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 			spaced:false
// 			},
// 			{title:"Tasks",
// 			icon: <GrTask/>,
// 			path:"/desk/tasks/",
// 			allowedRoles:["Employee", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 			spaced:false,
// 			sectionTabs:[
// 				{title:"All Tasks",
// 				path:"/desk/tasks/tasks/"},

// 				{title:"My Tasks",
// 				path:"/desk/tasks/myTasks/"},
				
// 				{title:"New Task",
// 				path:"/desk/tasks/newTask/"}
// 			]
// 			},
// 			{title:"Chat",
// 				icon: <HiOutlineChatAlt/>,
// 				path:"/desk/Chat",
// 				allowedRoles:["Employee", "Animator", "Academic", "Director",  "Desk", "Manager", "Admin"],
// 				spaced:false
			
// 			},
// 			{title:"Mails",
// 				icon: <LuMail/>,
// 				path:"/desk/mails",
// 				allowedRoles:["Employee", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 				spaced:false
// 			}
// 			]
// 	},
// 	{title:"CMS",
// 		icon: <SiWebmoney/>,
// 		path:"/cms",
// 		allowedRoles:["ContentManager", "Director",  "Manager", "Admin"],
// 		spaced:false
// 	},
// 	{title:"Public",
// 		icon: <BiHome/>,
// 		path:"/",
// 		allowedRoles:["Employee","Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 		spaced:false
// 		 },
// 	{title:"Settings",
// 		icon: <SlSettings/>,
// 		path:"",
// 		allowedRoles:["Employee","Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 		submenu:true,
// 		subOpen:false,
// 		submenuItems:
// 		[{title:"Dashboard",
// 			icon: <VscDashboard/>,
// 			path:"/settings/dashboardSet",
// 			allowedRoles:["Employee","Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
			
// 			 },
// 		{title:"Students",
// 		icon: <PiStudent/>,
// 		path:"/settings/studentsSet",
// 		allowedRoles:["Employee","Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 		spaced:false
// 			},
			 
// 		{title:"Academics",
// 		icon: <IoSchoolOutline/>,
// 		path:"/settings/academicsSet",
// 		allowedRoles:["Employee","Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 		spaced:false,
// 		sectionTabs:[
// 			{title:"Academic Years",
// 			path:"academicYears/",
// 			allowedRoles:[ "Academic", "Director","Manager", "Admin"]
// 			},

// 			{title:"option2",
// 			path:"academicYears/",
// 			allowedRoles:[ "Academic", "Director","Manager", "Admin"]
// 			},
			
// 			{title:"bloblo",
// 			path:"/settings/bloblo/",
// 			allowedRoles:["Employee","Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"]
// 		}
			
// 		]
// 			},
	
// 		{title:"Finances",
// 		icon: <LiaFileInvoiceDollarSolid/>,
// 		path:"/settings/financesSet",
// 		allowedRoles:["Employee","Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 		spaced:false
// 			},
			 
// 		{title:"HR",
// 		icon: <GiHumanPyramid/>,
// 		path:"/settings/HRSet",
// 		allowedRoles:["Employee","Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 		spaced:false
// 			},
	
// 		{title:"Desk",
// 		icon: <FaMailBulk/>,
// 		path:"/settings/deskSet",
// 		allowedRoles:["Employee","Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 		spaced:false
// 			},
	
// 		{title:"CMS",
// 		icon: <SiWebmoney/>,
// 		path:"/settings/cmsSet",
// 		allowedRoles:["Employee","Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
// 		spaced:false
// 			}
// 		]
// 		 }
	
// ]

// export const sidebarMenuDown=[
	

// 	{title:"Admin",
// 	   icon: <GrUserAdmin/>,
// 	   path:"",
// 	   allowedRoles:[ "Admin"],
// 	   spaced:false,
// 	   submenu:true,
// 	   subOpen:false,
// 	   submenuItems:
// 		   [{title:"Users Management",
// 				icon: <BsQuestionSquare/>,
// 				path:"/admin/usersManagement/",
// 				allowedRoles:[ "Admin"],
// 				spaced:false,
// 				sectionTabs:[
// 					{title:"All Users",
// 					path:"/admin/usersManagement/users/"},
					
// 					{title:"New User",
// 					path:"/admin/usersManagement/newUser/"}
// 				]
// 			},
// 			{title:"blabla",
// 			icon: <GrTask/>,
// 			path:"/admin/blabla",
// 			allowedRoles:[ "Admin"],
// 			spaced:false
// 			}]
// 	   }
	 
// ]

