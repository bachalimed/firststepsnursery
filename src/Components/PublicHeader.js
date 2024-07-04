import React from 'react';
import {  useNavigate, useLocation } from 'react-router';
import { VscDashboard } from "react-icons/vsc";

import { LuUserCircle2 } from "react-icons/lu";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import logo from './../Data/logo.jpg';
// import { Link} from 'react-router';



const PublicHeader = () => {
	const navigate = useNavigate();
	const {pathname} = useLocation();
	//will show the dashboard button  icon in the header when not in dashboard page
	const onGoHomeClicked = () => navigate('/dashboard')

    let goHomeButton = null
    if (pathname !== '/dashboard') {
        goHomeButton = (
            <button
                className="" 
                title="Home"
                onClick={onGoHomeClicked}
            >
                <VscDashboard />
            </button>
        )
    }
	const content = (
		<div className='flex  items-center place-content-stretch  bg-gray-100 h-20'>
      	 	<div className='mr-2 '> <img  src = {logo} className='h-14 w-14 rounded block float-left  ' alt='logo image' /></div>
			<div  className='flex-1 '>{goHomeButton }</div>
			<Menu>
				<MenuButton className="mr-4 ">  
				<LuUserCircle2 fontSize={24} />
				</MenuButton>
				<MenuItems
				transition
				anchor="bottom end"
				className=" origin-top-right rounded-md border  w-36 bg-sky-100 p-1 text-sm/6 text-gray-800 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
				>
				<strong>User profile</strong>
				<MenuItem>
					
					<button onClick={()=>navigate('/User/Login')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" href="link1target1StudentsParents">
					Login
					</button>				
				</MenuItem>
				<MenuItem>
					<button onClick={()=>navigate('/User/ForgotPassword')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" href="/target 1">        
					Forgot Password 
					</button>
				</MenuItem>		
				<div className="my-1 h-px bg-gray-500" />			
				</MenuItems>
			</Menu>






    	</div>
  )
  return content
}

export default PublicHeader;
