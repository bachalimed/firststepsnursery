// import React from 'react'
// import { useState } from 'react'
// import { Link,useNavigate, useLocation } from 'react-router-dom'
// import { BsChevronDown } from 'react-icons/bs'
// import { PiDotsThreeVerticalLight } from 'react-icons/pi'

// import useAuth from '../../../hooks/useAuth'


// const SidebarItem = (props) => {
// const [submenuOpen, setSubmenuOpen] = useState(false)
// const {pathname} = useLocation();//to know which link is selected and then set the active to different color
// // onClick={()=> props.setOpen(true)}
// //onClick={()=> props.setOpen(!props.open)}
// const {username, userRoles}=useAuth()
// const isAnyValueInMenu = userRoles.some(value => props.menu.allowedRoles.includes(value))
// //const isAnyValueInSubmenu = userRoles.some(value => props.menu.submenuItem.allowedRoles.includes(value))
// //for the logout button:
// const{canEdit, canDelete, canAdd, canCreate}=useAuth()
// // console.log('canEdit', canEdit)
// // console.log('canEdit', canEdit)
// // console.log('canEdit', canEdit)
// // console.log('canEdit', canEdit)

// 	return (   
// 		<>
// 		{/* if the link has submenum it will not linkm if selected, it will have a color */}
// 		{isAnyValueInMenu?(
// 			<Link to= {!props.menu.submenu?props.menu.path: null}  className={pathname===props.menu.path? 'text-teal-200':''}>
// 			<li key={props.key} className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md ${props.menu.spaced ? "mt-8" : "mt-0" } `}>
// 				<span className='text-2xl block float-left' onClick={()=>props.menu.submenu? props.setOpen(true):null}   >  {props.menu.icon? props.menu.icon:<PiDotsThreeVerticalLight/>}</span>
// 				<span className={`text-base font-light flex-1 ${!props.open && "hidden"} duration-200`} onClick={()=> props.setOpen(!props.open)}> {props.menu.title}</span>
// 				{props.menu.submenu && props.open &&(<BsChevronDown className={`${submenuOpen && "rotate-180"}`} onClick={()=>
// 					setSubmenuOpen(!submenuOpen)}/>
// 				)}
// 			</li>
// 		</Link>):null}
		
// 		{props.menu.submenu && submenuOpen && props.open  && (
// 			<ul>
// 				{props.menu.submenuItems.map((submenuItem, index)=>(
					
// 						<Link to={submenuItem.path} className={pathname===submenuItem.path? 'text-teal-200':''}> 
// 						<li key={index} className={userRoles.some(value => submenuItem.allowedRoles.includes(value))?'  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md ':'hidden'}>
// 							<span className='text-1xl block float-left'> {submenuItem.icon} </span>
// 							{submenuItem.title}

// 						</li>
// 						</Link>
					
				

// 				))}
// 			</ul>

// 			)}
			
			
// 		</>	
//   )
// }
// export default SidebarItem