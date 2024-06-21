import React from 'react';
import { Outlet} from "react-router-dom";
import Sidebar from "./../Sidebar";
import Header from "./../Header";
import Footer from "./../Footer";


const Layout = () => {
  	return (
		<div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
			<div className='bg-sky-200'>{<Sidebar/>}</div>
			<div className='p-4'>
				<div className='bg-teal-200'>{<Header/>}</div>
				<div>{<Outlet/>}</div>
				<div className='bg-teal-200'>{<Footer/>}</div>
			</div>	
			
			
		</div>
  )
};
export default Layout;