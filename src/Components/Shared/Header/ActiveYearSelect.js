import React from 'react';
import {ActiveYearOptions} from '../../lib/Consts/ActiveYearOptions.js';
import { Field, Label, Select } from '@headlessui/react';
// import { Description } from '@headlessui/react';

import { BsChevronDown } from "react-icons/bs";
//import clsx from 'clsx'


const ActiveYearSelect = () => {
  return (
    
    
        
      <Field className=' flex flex-col items-center'>
        <Label className="text-sm/5 font-medium text-black ">Academic Year</Label>
        {/* <Description className="text-sm/6 text-white/50"> clients on the project.</Description> */}
        <div className="inline-flex relative">
          <BsChevronDown className="absolute right-2 top-2" aria-hidden="true" />
          <Select name="CurrentAcademicYear"  className= ' relative mt-1  w-32 data-[hover]:shadow block data-[focus]:bg-blue-200 appearance-none rounded-sm border-gray-600 bg-white/5 py-0 px-3 text-md/6 text-gray-900 border '>
          {ActiveYearOptions.map((option, index)=> (<option key= {index} value ={option.title} className=''> {option.title} </option> ))}
          </Select>
        </div>
      </Field>
 
    
  )
}

export default ActiveYearSelect