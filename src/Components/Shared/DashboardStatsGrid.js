import React from 'react'
// import { GrUserExpert } from "react-icons/gr";
import DashboardStatStudentInNrsery from '../lib/DashboardStatStudentInNrsery';



//a wrapper to format the stats
// const BoxWrapper=({children})=> {
// 	return <div className='bg-teal-100 rounded-sm p-4 flex-1 border border-gray-200 flex items-center '>
// 		{children} </div>	
// }

const DashboardStatsGrid = () => {
  return (
	//we can plan ;ultiple dashboardstas and import here
    <div className='flex gap-4 w-full'>
      
			<DashboardStatStudentInNrsery/>
			<DashboardStatStudentInNrsery/>
			<DashboardStatStudentInNrsery/>
			<DashboardStatStudentInNrsery/>
		
       {/* <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper> */}
       
    </div>
  )
}

export default DashboardStatsGrid