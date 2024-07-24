import React from 'react'
import { useState } from 'react'
import NavbarSidebarUp from './NavbarSidebarUp'
import NavbarSidebarDown from './NavbarSidebarDown'
import logo from './../../../Data/logo.jpg'

import { LuChevronLeft } from "react-icons/lu";
// import { CgPushChevronLeftR } from "react-icons/cg";




const DashboardSidebar = () => {
	//to set the open close of side bar
	const [open, setOpen]= useState(true);
	
	const company ={label:"First Steps", type:"Nursery"};

	
  return (
    
	<div className={`bg-gray-900 ${open?"w-56":"w-20" } p-3 flex flex-1 flex-col min-h-screen text-white  duration-300 relative`}> 
		<div className='inline-flex items-center '>
			<img  src = {logo} className='h-14 w-14 rounded block float-left mr-2 mt-4 ' alt='logo image' />
			<span className={`origin-left font-medium duration-300 ${!open&&"scale-0"  }`}>{company.label} <br/>{company.type}</span>
		</div>
		<LuChevronLeft className={` text-gray-600 text-3xl rounded-lg ${!open&&"rotate-180" } bg-teal-200 absolute -right-4 top-6 cursor-pointer`} onClick={()=>setOpen(!open)}/>
		<br/>
		<div className='flex-1 border-t border-neutral-600'><NavbarSidebarUp open={open} setOpen={setOpen}/></div>
		<div><NavbarSidebarDown open={open} setOpen={setOpen}/></div>
	</div>
  )}

  
export default DashboardSidebar;