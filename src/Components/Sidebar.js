import React from 'react'
import { useState } from 'react'


import NavbarSidebarUp from './Shared/NavbarSidebarUp'
import NavbarSidebarDown from './Shared/NavbarSidebarDown'
import logo from './../Data/logo.jpg'

import { CgPushChevronLeftR } from "react-icons/cg";




const Sidebar = () => {
	//to set the open close of side bar
	const [open, setOpen]= useState(true);
	
	const company ={label:"First Steps", type:"Nursery"};

	
  return (
    
	<div className={`bg-gray-900 ${open?"w-56":"w-20" } p-3 flex flex-col text-white h-full duration-300 relative`}> 
		<div className='inline-flex items-center '>
			<img  src = {logo} className='h-14 w-14 rounded block float-left mr-2 mt-4 ' alt='logo image' />
			<span className={`origin-left font-medium duration-300 ${!open&&"scale-0"  }`}>{company.label} <br/>{company.type}</span>
		</div>
		<CgPushChevronLeftR className={` text-black text-3xl  ${!open&&"rotate-180" } absolute -right-8 top-4 cursor-pointer`} onClick={()=>setOpen(!open)}/>
		<br/>
		<div className='flex-1 border-t border-neutral-600'><NavbarSidebarUp open={open} setOpen={setOpen}/></div>
		<div><NavbarSidebarDown open={open} setOpen={setOpen}/></div>
	</div>
  )}

  
export default Sidebar;