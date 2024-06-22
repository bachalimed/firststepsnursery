import React from 'react';
import { Outlet} from "react-router-dom";
import Sidebar from "./../Sidebar";
import Header from "./../Header";
import Footer from "./../Footer";

// the layout contains all persistant elements that exist in all pagesm the outlet element is the vaiable content
const Layout = () => {
  	return (
		<div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
			<div className=''>{<Sidebar/>}</div>
			<div className='flex-1'>
				<div className=''>{<Header/>}</div>
				<div className='p-4'>{<Outlet/>}</div>
				<div className='bg-teal-200'>{<Footer/>}</div>
			</div>	
			
			
		</div>
  )
};
export default Layout;