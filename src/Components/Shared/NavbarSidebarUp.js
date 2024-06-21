import React from 'react'
//import { Link } from 'react-router-dom';
import { RiDashboard2Line } from "react-icons/ri";
//import { TbReport } from "react-icons/tb";
//import { FaChevronDown } from "react-icons/fa";
//import { PiStudentBold } from "react-icons/pi";
//import { FaSackDollar } from "react-icons/fa6";







const NavbarSidebarUp = () => {

	const Menus=[
		{title:"Dashboard",
		icon: "RiDashboard2Line",
		path:"/Dashboard",
		spacing:true
		 },
		 {title:"Student Affairs",
			icon: "",
			path:"/StudentAffairs",
			submenu:true,
			SubmenuItems:
			[{title:"Students & Parents",
				icon: "RiDashboard2Line",
				path:"/Student",
				spacing:true
				 },
				 {title:"Admissions",
					icon: "RiDashboard2Line",
					path:"",
					spacing:true
					 },
					 {title:"Enrolments",
						icon: "RiDashboard2Line",
						path:"",
						spacing:true
						 }

			]
			 },
			 {title:"Finances",
				icon: "FaSackDollar",
				path:"/Finances"
				 }
	]

	

  return (
	<div className=''>
			
	<ul className='pt-2'>
		{Menus.map((menu, index)=>(
			<>
			<li key={index} className='text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md mt-2'>
				<span className='text-2xl block float-left'> <RiDashboard2Line/></span>
				
			</li>
			</>
		))}
	</ul>
	</div>)
}

export default NavbarSidebarUp ();