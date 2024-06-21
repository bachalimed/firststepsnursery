import React from 'react'
import { useState } from 'react'


import NavbarSidebarDown from './Shared/NavbarSidebarDown'
import logo from './../Data/logo.jpg'
import { RiDashboard2Line } from "react-icons/ri";
import { CgPushChevronLeftR } from "react-icons/cg";
import { BsChevronDown } from "react-icons/bs";
import { TbReport } from "react-icons/tb";

import { PiStudentBold } from "react-icons/pi";
import { FaSackDollar } from "react-icons/fa6";
const Menus=[
	{title:"Dashboard",
	icon: <RiDashboard2Line/>,
	path:"/Dashboard",
	spaced:true
	 },
	 
	 {title:"Students",
		icon: <PiStudentBold/>,
		path:"/StudentAffairs",
		submenu:true,
		submenuItems:
		[{title:"Students & Parents",
			icon: <PiStudentBold/>,
			path:"/Student",
			
			 },
			 {title:"Admissions",
				icon: "",
				path:"",
				spaced:false
				 },
			 
				 {title:"Enrolments",
					icon: "",
					path:"",
					spaced:true
					 }

		]
		 },
		 {title:"Academics",
			icon: "",
			path:"",
			spaced:false
			 },
		 {title:"CMS",
			icon: "",
			path:"/",
			spaced:true
			 },
		 {title:"Desk",
			icon: <FaSackDollar/>,
			path:"/",
			spaced:true
			 }
]


const Sidebar = () => {
	//to set the open close of side bar
	const [open, setOpen]= useState(true);
	const [submenuOpen, setSubmenuOpen] = useState(false);
	const company ={label:"First Steps", type:"Nursery"};

	
  return (
    
	<div className={`bg-neutral-900 ${open?"w-56":"w-20" } p-3 flex flex-col text-white h-full duration-300 relative`}> 
		<div className='inline-flex items-center '>
			<img  src = {logo} className='h-14 w-14 rounded block float-left mr-2 mt-4 ' alt='logo image' />
			<span className={`origin-left duration-300 ${!open&&"scale-0"  }`}>{company.label} <br/>{company.type}</span>
		</div>
		<CgPushChevronLeftR className={` text-black text-3xl  ${!open&&"rotate-180" } absolute -right-9 top-7 cursor-pointer`} onClick={()=>setOpen(!open)}/>

		<div className='flex-1'  >
			<ul className='pt-2'> {Menus.map((menu, index)=>(
				<>
					<li key={index} className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md ${menu.spaced ? "mt-8" : "mt-1" } `}>
					<span className='text-2xl block float-left'> {menu.icon? menu.icon:<RiDashboard2Line/>}</span>
					<span className={`text-base font-medium flex-1 ${!open && "hidden"} duration-200`}> {menu.title}</span>
					{menu.submenu&& open &&(
						<BsChevronDown className={`${submenuOpen && "rotate-180"}`} onClick={()=>
							setSubmenuOpen(!submenuOpen)}/>
					)}
					</li>
					{menu.submenu&& submenuOpen && open && (
						<ul>
							{menu.submenuItems.map((submenuItem, index)=>(
								<li key={index} className='text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-light-white rounded-md'>
									{submenuItem.title}

								</li>
							))	}
						</ul>
					)}
				</>
				))}
			</ul>
		</div>

		<div><NavbarSidebarDown/></div>





    	</div>
  )
}

export default Sidebar;