
import React from 'react';
import  useAuth from '../../hooks/useAuth'


import SectionTabs from '../../Components/Shared/Tabs/SectionTabs'

const Tasks = () => {
  //const { userId } = useAuth()//pull the id from use params from the url

  //const{userId}=useAuth()


  const content = (
  
    <div className="flex bg-gray-300 justify-left  ">  

       
	  <SectionTabs />

    </div>
  )
  return content
}

export default Tasks