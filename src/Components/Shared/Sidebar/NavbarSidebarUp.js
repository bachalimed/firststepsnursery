
import SidebarItem from './SidebarItem.js'
// import { Link } from 'react-router-dom';

import {sidebarMenuUp} from '../../lib/Consts/SidebarMenu'


const NavbarSidebarUp = (props) => {	
	return (
		<ul  className='pt-2 '>
		 { sidebarMenuUp.map((menu, index) => <SidebarItem key={index} menu={menu} open={props.open} setOpen={props.setOpen}/>) }	
		</ul>
	)
  }

export default NavbarSidebarUp