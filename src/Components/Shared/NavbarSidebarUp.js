
import SidebarUpItem from './SidebarUpItem';
import { Link } from 'react-router-dom';
import { VscDashboard } from "react-icons/vsc";
import { PiStudent, PiStudentBold } from "react-icons/pi";
import { GrSchedules } from "react-icons/gr";
import { LuCircleDollarSign } from "react-icons/lu";
import { GiHumanPyramid } from "react-icons/gi";
import { FaMailBulk } from "react-icons/fa";
import { SiWebmoney } from "react-icons/si";
import { SlSettings } from "react-icons/sl";
import { BiHome } from "react-icons/bi";
// import menus from './../../Data/SidebarUp.json';

const menus=[
	{title:"Home",
	icon: <BiHome/>,
	path:"/",
	spaced:false
	 },
	{title:"Dashboard",
	icon: <VscDashboard/>,
	path:"/",
	spaced:false
	 },
	 
	{title:"Students",
	icon: <PiStudent/>,
	path:"",
	submenu:true,
	subOpen:false,
	submenuItems:
		[{title:"Students & Parents",
			icon: <PiStudent/>,
			path:"/",
			spaced:false
			},
			{title:"Admissions",
			icon: "",
			path:"",
			spaced:false
			},
			{title:"Enrolments",
			icon: "",
			path:"",
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
		[{title:"School Plan",
			icon: "",
			path:"/",
			spaced:false
			},
			{title:"Nursery Plan",
			icon: "",
			path:"",
			spaced:false
			},
			{title:"Collection",
				icon: "",
				path:"",
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
			path:"/",
			spaced:false
			},
			{title:"Payments",
			icon: "",
			path:"",
			spaced:false
			},
			{title:"Expenses",
				icon: "",
				path:"",
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
			path:"/",
			spaced:false
			},
			{title:"Payroll",
			icon: "",
			path:"",
			spaced:false
			},
			{title:"Leave",
				icon: "",
				path:"",
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
			path:"/",
			spaced:false
			},
			{title:"Tasks",
			icon: "",
			path:"",
			spaced:false
			},
			{title:"Communication",
				icon: "",
				path:"",
				spaced:false
			
			},
			{title:"Mailing",
				icon: "",
				path:"",
				spaced:false
			}
			]
	},
	{title:"CMS",
	icon: <SiWebmoney/>,
	path:"",
	spaced:false
	},
	{title:"Settings",
		icon: <SlSettings/>,
		path:"/StudentAffairs",
		submenu:true,
		subOpen:false,
		submenuItems:
		[{title:"Dashboard",
			icon: <PiStudentBold/>,
			path:"/Student",
			
			 },
			 {title:"Students",
				icon: "",
				path:"",
				spaced:false
				 },
			 
				 {title:"Academics",
					icon: "",
					path:"",
					spaced:false
					 },
			 
				 {title:"Finances",
					icon: "",
					path:"",
					spaced:false
					 },
			 
				 {title:"HR",
					icon: "",
					path:"",
					spaced:false
					 },
			 
				 {title:"Desk",
					icon: "",
					path:"",
					spaced:false
					 },
			 
				 {title:"CMS",
					icon: "",
					path:"",
					spaced:false
					 }
		]
		 }
	
]
const NavbarSidebarUp = (props) => {	
	return (
		<ul  className='pt-2' >
		 { menus.map((menu, index) => <SidebarUpItem key={index} menu={menu} open={props.open}/>) }	
		</ul>
	)
  }

export default NavbarSidebarUp;