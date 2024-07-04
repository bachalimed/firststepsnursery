import React from 'react'
import { HiOutlineSearch } from 'react-icons/hi';
// import { Description, Field, Label, Select } from '@headlessui/react';
// import { BsChevronDown } from "react-icons/bs";

const SearchBar = () => {
  	return (
		<div className=' flex '>
			<div className='relative mr-2'>
				<HiOutlineSearch fontSize={20} className='text-gray-400 absolute top-1/2 -translate-y-1/2 left-3'/>
				<input type='text' placeholder='search' className='text-sm focus:outline-none active:outline-none h-10 w-[24rem] border border-gray-300 rounded-md px-4 pl-11 pr-4'   />
			</div>
        
        {/* <Field className=' flex flex-col items-center'>
          	<div className="inline-flex relative">
					<BsChevronDown className="absolute right-2 top-2" aria-hidden="true" />
					<Select name="SearchItem"  className= ' relative mt-1  w-32 data-[hover]:shadow block data-[focus]:bg-blue-200 appearance-none rounded-sm border-gray-600 bg-white/5 py-0 px-3 text-md/6 text-gray-900 border '>
						<option  value ='' className=''> Student </option>    
						<option  value ='' className=''> Parent </option>   
						<option  value ='' className=''> Gardian </option> 
					
					</Select>
          	</div>
        </Field> */}
      </div>






			
      
   
   
  )
}

export default SearchBar;