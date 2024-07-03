import React from 'react';
import { Outlet} from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardFooter from "./DashboardFooter";




// the layout contains all persistant elements that exist in all pagesm the outlet element is the vaiable content


const DashboardLayout = () => {
  	return (
		
			<div className='flex bg-neutral-100 h-screen w-screen '>
				<div className='overflow-visible min-h-screen'>{<DashboardSidebar/>}</div>
				<div className='flex-1'>
					<div className='flex-1 '>{<DashboardHeader/>}</div>
					<main className=' flex-1 p-1 min-h-screen '>{<Outlet className=''/>}</main>
					{/* <div className=' flex-1 p-1 h-screen'>{<Outlet/>}</div> */}
					<div className=' flex-1 bg-teal-200 w-full '>{<DashboardFooter/>}</div>
				</div>	
				
				
			</div>
			
		
  )
}
export default DashboardLayout;