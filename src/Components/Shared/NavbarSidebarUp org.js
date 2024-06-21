//we splitted the menu into two to allow opening and closing of submenu that was performed to all


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
import { CiMenuKebab } from "react-icons/ci";


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
	const [submenuOpen, setSubmenuOpen] = useState(false);
	const  handleTheClick = (event) => {
		const itemId = event.target.id;
		alert(`Clicked item with ID: ${itemId}`);
		setSubmenuOpen(!submenuOpen)
	 };
	return (
		<nav   >
		<ul className='pt-2'> {Menus.map((menu, index)=>(
			<>
				{/* the menu items are mapped from the menu list */}
				<li key={index} className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md ${menu.spaced ? "mt-8" : "mt-0" } `}>
					{/* the icon is put before the menu title */}
					<span className='text-2xl block float-left'> {menu.icon? menu.icon:<CiMenuKebab/>}</span>
					{/* if the side bar is open it will show the title or it will be hidden */}
					<span className={`text-base font-medium flex-1 ${!props.open && "hidden"} duration-200`}> {menu.title}</span>
					{/* if the menu has submenu and the side bar is open it shows the chevron to open close submenu */}
					{menu.submenu && props.open &&(
					<BsChevronDown className={`${submenuOpen && "rotate-180"}`} onClick={()=>
						setSubmenuOpen(!submenuOpen)}/>
					
					)}
				</li>
				{/* if menu has sub and the side bar open and submenu state is open, it will show the submenum  */}
				{menu.submenu && submenuOpen && props.open  && (
					<ul>
						{menu.submenuItems.map((submenuItem, index)=>(
							<li key={index} className='text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md'>
								<span className='text-1xl block float-left'> {<CiMenuKebab/>}</span>
								{submenuItem.title}

							</li>
						))	}
					</ul>
				)}
			</>
			))}
		</ul>
	</nav>)
  }

export default NavbarSidebarUp;