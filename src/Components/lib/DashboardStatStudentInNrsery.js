import React from 'react'
import { GrUserExpert } from "react-icons/gr";

const DashboardStatStudentInNrsery = () => {
  return (
    <div div className='bg-teal-100 rounded-sm p-3 flex-1 border border-gray-200 flex items-center '>
       <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-200'>
				<GrUserExpert className='text-2xl'/>
		</div>
			<div className='pl-4'>
				<span className='text-sm text-gray-500 font-light'> Students in Nursery</span>
				<div className='flex items-center'> 
					<strong className='text-xl text-gray-700 font-semi-bold'> 42</strong>
					<span className='pl-2 text-sm text-green-500'>Total 78</span>
				</div>
			</div>
    </div>
  )
}

export default DashboardStatStudentInNrsery