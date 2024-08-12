// import React from 'react'
// // import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import SidebarItem from './SidebarItem.js';
// import {sidebarMenuDown} from '../../lib/Consts/SidebarMenu';

// import { BsChevronDown } from "react-icons/bs"

// import { GrUserAdmin, GrTask } from "react-icons/gr"

// import { FaMailBulk } from "react-icons/fa"

// import { BsQuestionSquare } from "react-icons/bs"
// import { HiOutlineChatAlt } from "react-icons/hi"
// import { PiDotsThreeVerticalLight } from 'react-icons/pi'

// const NavbarSidebarDown = (props) => {


// 	// const [submenuOpen, setSubmenuOpen] = useState(false);
// 	let content
// 	content =(
		
// 		<div  className='border-t border-neutral-600' >

// 			<Link to='/admin/'> 
// 				<li className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}>    
// 				<span className='text-2xl block float-left'  ><GrUserAdmin/> </span>
// 				<span className={`text-base font-light flex-1 `} > Admin</span><BsChevronDown/>
// 				</li >
// 			</Link>
// 				<ul>							
// 					<Link to='/admin/usersManagement/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <BsQuestionSquare/> </span>
// 						Users Management
// 					</li>
// 					</Link>		
// 					<Link to='/settings/deskSet/blabla' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <FaMailBulk/> </span>
// 						Blabla
// 					</li>
// 					</Link>			
// 				</ul>



// 		{/* <ul  className='pt-2' >
// 		 { sidebarMenuDown.map((menu, index) => <SidebarItem key={index} menu={menu} open={props.open} setOpen={props.setOpen}/>) }	
// 		</ul> */}
		
// 	</div>
// 	)
// 	return content
//   }

// export default NavbarSidebarDown;