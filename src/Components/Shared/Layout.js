import React from 'react';
import { Outlet} from "react-router-dom";
import Sidebar from "./../Sidebar";
import Header from "./../Header";
import Footer from "./../Footer";




// the layout contains all persistant elements that exist in all pagesm the outlet element is the vaiable content


const Layout = () => {
  	return (
		<div className='flex bg-neutral-100 h-screen w-screen '>
			<div className='h-full '>{<Sidebar/>}</div>
			<div className='flex-1'>
				<div className='flex-1 '>{<Header/>}</div>
				<div className=' flex-1 p-1 h-screen '>{<Outlet className=''/>}</div>
				{/* <div className=' flex-1 p-1 h-screen'>{<Outlet/>}</div> */}
				<div className=' flex-1 bg-teal-200 '>{<Footer/>}</div>
			</div>	
			
			
		</div>
  )
};
export default Layout;