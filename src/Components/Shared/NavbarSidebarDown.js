import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import {sidebarMenuDown} from '../lib/Consts/SidebarMenu.js';


const NavbarSidebarDown = (props) => {
	const [submenuOpen, setSubmenuOpen] = useState(false);
	return (
		<div  className='border-t border-neutral-600' >
		<ul  className='pt-2' >
		 { sidebarMenuDown.map((menu, index) => <SidebarItem key={index} menu={menu} open={props.open} setOpen={props.setOpen}/>) }	
		</ul>
	</div>)
  }

export default NavbarSidebarDown;