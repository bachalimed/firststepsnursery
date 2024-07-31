import React from 'react'

import { Field, Label, Select } from '@headlessui/react'
// import { Description } from '@headlessui/react';
import { useGetAcademicYearsQuery, selectAllAcademicYears } from "../../../features/AppSettings/Academics/academicYearsApiSlice"

import { BsChevronDown } from "react-icons/bs"
import { useSelector, useDispatch } from 'react-redux'
import useAcademicYears from '../../../hooks/useAcademicYears'



const AcademicYears = () => {
  //get several things from the query
  const {
    data: AcademicYears,//the data is renamed academicYears
    isLoading,//monitor several situations is loading...
    isSuccess,
    isError,
    error
} = useGetAcademicYearsQuery()
const allAcademicYears = useSelector(state => selectAllAcademicYears(state))


const { currentAcademicYear, academicYears, selectedAcademicYear}= useAcademicYears()


let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>//errormessage class defined in the css, the error has data and inside we have message of error
    }

    if (isSuccess) {
  return (
    
    
        
      <Field className=' flex flex-col items-center'>
        <Label className="text-sm/5 font-medium text-black ">Academic Year</Label>
        {/* <Description className="text-sm/6 text-white/50"> clients on the project.</Description> */}
        <div className="inline-flex relative">
          <BsChevronDown className="absolute right-2 top-2" aria-hidden="true" />
          <Select name="SlectedAcademicYear"  className= ' relative mt-1  w-32 data-[hover]:shadow block data-[focus]:bg-blue-200 appearance-none rounded-sm border-gray-600 bg-white/5 py-0 px-3 text-md/6 text-gray-900 border '>
          {allAcademicYears.map((option, index)=> (<option key= {index} value ={option.title} className=''> {option.title} </option> ))}
          </Select>
        </div>
      </Field>
 
    
  )
}}

export default AcademicYears





