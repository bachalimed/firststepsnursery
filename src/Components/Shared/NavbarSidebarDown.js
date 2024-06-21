import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiDashboard2Line } from "react-icons/ri";
import { BsChevronDown } from "react-icons/bs";
import { GrUserAdmin } from "react-icons/gr";
import { TbLogout } from "react-icons/tb";


const Menus=[
	
	 {title:"Admin",
		icon: <GrUserAdmin/>,
		path:"",
		spaced:false
		},	 	 		 
		 {title:"Logout",
			icon: <TbLogout/>,
			path:"/",
			spaced:false
			 }
]

const NavbarSidebarDown = (props) => {
	const [submenuOpen, setSubmenuOpen] = useState(false);
	return (
		<div   >
		<ul className='pt-2'> {Menus.map((menu, index)=>(
			<>
				<li key={index} className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2  hover:bg-sky-700 rounded-md ${menu.spaced ? "mt-8" : "mt-0" } `}>
				<span className='text-2xl block float-left'> {menu.icon? menu.icon:<RiDashboard2Line/>}</span>
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

export default NavbarSidebarDown;