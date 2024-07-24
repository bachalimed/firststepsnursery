import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { sidebarMenuUp } from '../../lib/Consts/SidebarMenu'
import { useState, useEffect } from 'react'


const SectionTabs = () => {
  const location = useLocation()
  const [sectionTabs, setSectionTabs] = useState([]);
//find the submenu corresponding to the path we are in and get the sections from it
//loop through the menu and get the submenus, them filter the submeu that has the  same beginni gof the pathname and then get the sections

useEffect(() => {
  
  const currentPath = location.pathname;
  //console.log(currentPath)
  let foundSectionTabs = []

  for (const menuItem of sidebarMenuUp) {
    //console.log(`menuItem ${menuItem}`)
    if(currentPath.startsWith(menuItem.path)) {

    if (menuItem.submenuItems){const submenu = menuItem.submenuItems.find(submenuItem => currentPath.startsWith(submenuItem.path))
    if (submenu) {
      foundSectionTabs = submenu.sectionTabs
      
     // console.log(`foundSectionTabs ${foundSectionTabs}`)
           break;
    }}}
  }
  setSectionTabs(foundSectionTabs)
}, [location.pathname]);

return (  
    <ul className='flex gap-2 px-2 py-2 bg-gray-300'>
      {sectionTabs.map((tab, index) => (
        <Link to={tab.path}><li key={index}>{tab.title}</li></Link>
      ))}
    </ul>
)}

export default SectionTabs

 
    