import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { VscDashboard } from "react-icons/vsc";
import { PiStudent, PiStudentBold } from "react-icons/pi";
import { BsChevronDown } from "react-icons/bs";
import { GrSchedules } from "react-icons/gr";
import { LuCircleDollarSign } from "react-icons/lu";
import { GiHumanPyramid } from "react-icons/gi";
import { FaMailBulk } from "react-icons/fa";
import { SiWebmoney } from "react-icons/si";
import { SlSettings } from "react-icons/sl";
import { BiHome } from "react-icons/bi";

const Menus=[
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
	const [submenuOpen, setSubmenuOpen] = useState(false);
	return (
		<div   >
		<ul className='pt-2'> {Menus.map((menu, index)=>(
			<>
				<li key={index} className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md ${menu.spaced ? "mt-8" : "mt-0" } `}>
				<span className='text-2xl block float-left'> {menu.icon? menu.icon:<VscDashboard/>}</span>
				<span className={`text-base font-medium flex-1 ${!props.open && "hidden"} duration-200`}> {menu.title}</span>
				{menu.submenu&& props.open &&(
					<BsChevronDown className={`${submenuOpen && "rotate-180"}`} onClick={()=>
						setSubmenuOpen(!submenuOpen)}/>
				)}
				</li>
				{menu.submenu&& submenuOpen && props.open && (
					<ul>
						{menu.submenuItems.map((submenuItem, index)=>(
							<li key={index} className='text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md'>
								{submenuItem.title}

							</li>
						))	}
					</ul>
				)}
			</>
			))}
		</ul>
	</div>)
  }

export default NavbarSidebarUp;