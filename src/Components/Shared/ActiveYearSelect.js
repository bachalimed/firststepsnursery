import React from 'react';
import {ActiveYearOptions} from '../lib/Consts/ActiveYearOptions.js';
import { Description, Field, Label, Select } from '@headlessui/react';

import { BsChevronDown } from "react-icons/bs";
//import clsx from 'clsx'


const ActiveYearSelect = () => {
  return (
    
    
        
      <Field className=' flex flex-col items-center'>
        <Label className="text-sm/5 font-medium text-black ">Academic Year</Label>
        {/* <Description className="text-sm/6 text-white/50"> clients on the project.</Description> */}
        <div className="">
          <Select name="CurrentAcademicYear"  className= ' relative mt-1 block w-30  appearance-none rounded-sm border-gray-600 bg-white/5 py-0 px-3 text-md/6 text-gray-900 border data-[hover]:shadow data-[focus]:bg-blue-200'>
          {ActiveYearOptions.map((option, index)=> (<option key= {index} value ={option.title} className=''> {option.title} </option> ))}
          </Select>
          {/* <BsChevronDown className="group pointer-events-none  right-2.5 size-4" aria-hidden="true"/> */}
        </div>
      </Field>
 
    
  )
}

export default ActiveYearSelect