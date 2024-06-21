import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { BsChevronDown } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";

const SidebarUpItem = (props) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  return (
    
			<>
				
				<li key={props.key} className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md ${props.menu.spaced ? "mt-8" : "mt-0" } `}>
				
					<span className='text-2xl block float-left'>  {props.menu.icon}</span>
					
					<span className={`text-base font-medium flex-1 ${!props.open && "hidden"} duration-200`}> {props.menu.title}</span>
				
					{props.menu.submenu && props.open &&(<BsChevronDown className={`${submenuOpen && "rotate-180"}`} onClick={()=>
						setSubmenuOpen(!submenuOpen)}/>
					
					)}
				</li>
				
				{props.menu.submenu && submenuOpen && props.open  && (
					<ul>
						{props.menu.submenuItems.map((submenuItem, index)=>(
							<li key={index} className='text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md'>
								<span className='text-1xl block float-left'> {<CiMenuKebab/>}</span>
								{submenuItem.title}

							</li>
						))	}
					</ul>
				)}
			</>
			
		
  )
}

export default SidebarUpItem