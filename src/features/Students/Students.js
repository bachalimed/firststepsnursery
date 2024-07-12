
//the students tab in the students and parents page
import React from 'react'
import StudentsTableList from '../../Components/Shared/StudentsTableList'
import SectionTabs from '../../Components/Shared/Tabs/SectionTabs'

const Students = () => {
  return (
    <div>
      <SectionTabs/>
      <StudentsTableList classname=''/>
    </div>
  )
}

export default Students