import React from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import SearchBar from '../Components/Shared/SearchBar';
import Students from './Students';
import Parents from './Parents';
import NewStudent from './NewStudent';



const StudentsParents = () => {
  return (
  
    <div className="flex w-full  justify-left  ">
    
      <div className="w-full max-w-md">
        
        <TabGroup>
          <TabList className="flex gap-1">
            
              <Tab  className="rounded-sm  bg-sky-100 px-2 text-sm/6 font-semibold text-gray-800 focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white" >
                Students
					 
              </Tab>
              <Tab  className="rounded-sm  bg-sky-100 px-2 text-sm/6 font-semibold text-gray-800 focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white" >
               Parents
              </Tab>
              <Tab  className="rounded-full  bg-sky-100 px-2 text-sm/6 font-semibold text-gray-800 focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white" >
                New Student
              </Tab>
            
          </TabList>
          <TabPanels className=" flex">
           
              <TabPanel   className="  rounded-md bg-white/5 p-3  "> 
				  		<SearchBar className=""/> 
				  		<Students/>
				  </TabPanel>
              <TabPanel   className="rounded-md bg-white/5 p-3"> 
				  <SearchBar className=""/>
				  <Parents/>
				  </TabPanel>
              <TabPanel   className="rounded-md bg-white/5 p-3">
				  <SearchBar className=""/>
				   <NewStudent/>
				  </TabPanel>
                
          </TabPanels>
        </TabGroup>
      
      </div>
    </div>
      
 
  )
}

export default StudentsParents