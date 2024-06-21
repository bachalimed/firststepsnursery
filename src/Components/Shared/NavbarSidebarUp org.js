import React from 'react'
import { Link } from 'react-router-dom';
import { RiDashboard2Line } from "react-icons/ri";
import { TbReport } from "react-icons/tb";

const NavbarSidebarUp = () => {
  return (
          <nav className=''>
            
            <ul >
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="Dashboard">to Dashboard</Link>
              </li>
              <li>
                <Link to="StudentAffairs"> to StudentAffairs</Link>
                  <ul>
                    <li>
                      Student&Parent
                    </li>
                    <li>
                      Admission
                    </li>
                    <li>
                      Enrolment
                    </li>
                    <li>
                      Setup
                    </li>
                  </ul>
              </li>
              <li>
                <Link to="Academics"> to Academics</Link>
              </li>
              <li>
                <Link to="Finances">to Finances</Link>
              </li>
              <li>
                <Link to="HumanResources"> to Human resources</Link>
              </li>
              <li>
                <Link to="FrontDesk">to Front desk</Link>
              </li>
              <li>
                <Link to="Cms">to CMS</Link>
              </li>
              
              <li>
                <Link to="Admin">to Admin</Link>
              </li>
            
              
            </ul>
          hi

          
        </nav>)
}

export default NavbarSidebarUp;