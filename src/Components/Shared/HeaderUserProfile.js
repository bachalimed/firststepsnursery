import React from 'react'
import { LuUserCircle2 } from "react-icons/lu";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link, useNavigate } from 'react-router-dom';
import Login from '../../pages/Login';
import { Navigate } from 'react-router-dom';

const HeaderUserProfile = () => {
  const Navigate = useNavigate();
  return (
   
      <Menu>
        <MenuButton className=" ">  
          <LuUserCircle2 fontSize={24} />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className=" origin-top-right rounded-md border  w-36 bg-sky-100 p-1 text-sm/6 text-gray-800 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <strong>Manage user profile</strong>
          <MenuItem>
            
            <button onClick={()=>Navigate('/User/Login')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" href="link1target1StudentsParents">
              Login
            </button>
            
          </MenuItem>
          <MenuItem>
            <button onClick={()=>Navigate('/User/ForgotPassword')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" href="/target 1">        
              Forgot Password 
            </button>
          </MenuItem>
          <MenuItem>
            <button onClick={()=>Navigate('/User/ResetPassword')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" href="/target 1">
              {/* <LuUserCircle2 className="size-4 fill-white/30" /> */}
              Reset Password        
            </button>    
          </MenuItem>
          <div className="my-1 h-px bg-gray-500" />
          <MenuItem>
            <button onClick={()=>Navigate('/User/Logout')} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">          
              Logout
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
)
}
export default HeaderUserProfile