import React from 'react'
import { Link } from 'react-router-dom';

const NavbarSidebarDown = () => {
  return (
          <nav>   
               <ul>       
              <li>
                <Link to="Configurations">to Configurations</Link>
              </li>
              <li>
                <Link to="Logout">to Logout</Link>
              </li>
              
            </ul>
          

          
        </nav>)
}

export default NavbarSidebarDown;