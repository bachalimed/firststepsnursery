import React from 'react';
//import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
//import SearchBar from '../../Components/Shared/SearchBar';
//import Students from './Students';
//import Parents from './Parents';
//import NewStudent from './NewStudent';
import { Link } from 'react-router-dom';
import SectionTabs from '../../Components/Shared/Tabs/SectionTabs'
//import SidebarMenu from '../../Components/Shared/Sidebar/SidebarMenu'

// import { Description, Field, Label, Select } from '@headlessui/react';

//we will  find the object corresponding to the page and extract the section tabs
const StudentsParents = () => {


  return (
  
    <div className="flex bg-gray-300 justify-left  ">  
	  <SectionTabs/>
    </div>
  )
}

export default StudentsParents