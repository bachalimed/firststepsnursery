import React from 'react'

import { Field, Label, Select } from '@headlessui/react'
// import { Description } from '@headlessui/react';
import { useGetAcademicYearsQuery, selectAllAcademicYears } from '../../../features/AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice'

import { BsChevronDown } from "react-icons/bs"
import { useSelector, useDispatch } from 'react-redux'
import {selectAcademicYear,  setAcademicYears} from '../../../features/AppSettings/AcademicsSet/AcademicYears/academicYearsSlice'
import { useState , useEffect} from 'react'
//import useAcademicYears from '../../../hooks/useAcademicYears'
import { useSelectedAcademicYear } from "../../../hooks/useSelectedAcademicYears"

const AcademicYearsSelection = () => {
  const dispatch = useDispatch()
//const listOfAcademicYears = useSelector(state => selectAllAcademicYears(state))//this is original
const academicYears = useSelector(selectAllAcademicYears)//this works
const [defaultAcademicYearId, setDefaultAcademicYearId] = useState('');

const getCurrentAcademicYear = () => {
  const today = new Date() // Get today's date
  const currentYear = today.getUTCFullYear() // Get the current year

  // Define the academic year start and end dates
  const startDate = new Date(Date.UTC(currentYear, 8, 1, 0, 0, 0)) // 1st September of the current year
  const endDate = new Date(Date.UTC(currentYear + 1, 7, 31, 23, 59, 59, 999)) // 31st August of the next year

  // Determine the academic year based on the current date
  let academicYear
  if (today >= startDate && today <= endDate) {
    academicYear = `${currentYear}/${currentYear + 1}`
  } else {
    academicYear = `${currentYear - 1}/${currentYear}`
  }
  return academicYear
}

//compare the selcted with the current year only the first time




useEffect(()=>{
  dispatch(setAcademicYears(academicYears))//dispatch list to state,this only shows tehn redux state not empty in the browser tools, check later if this is needed as the query updated the state in apislice
},[academicYears, dispatch])// added dispatch here




//update the state when we select a year using the reducer from slice
const handleSelectedAcademicYear =(e) =>{
  const  id = e.target.value
 //console.log(selectedTitle)
 //this will publish the curretn selectiont ob eused by other components
  dispatch(selectAcademicYear({id:id}))
}
//const sortedList = academicYears.sort((a, b) => b.title.localeCompare(a.title))//will sort the selection options with topo most recent

 
  const content = (
     
      <Field className=' flex flex-col items-center'>
        <Label className="text-sm/5 font-medium text-black ">Academic Year</Label>
        {/* <Description className="text-sm/6 text-white/50"> clients on the project.</Description> */}
        <div className="inline-flex relative">
          <BsChevronDown className="absolute right-2 top-2" aria-hidden="true" />
          {/*add defaultvalue the curretn  academic year to select */}
          <Select 
            name="SelectedAcademicYear"  
           
            onChange={handleSelectedAcademicYear}  
            className= ' relative mt-1  w-32 data-[hover]:shadow block data-[focus]:bg-blue-200 appearance-none rounded-sm border-gray-600 bg-white/5 py-0 px-3 text-md/6 text-gray-900 border '
          >
          {academicYears.map(year=> (<option key= {year.id} value ={year.id}  className=''> {year.title} </option> ))}
          </Select>
        </div>
      </Field>
 
    
      )
    return content}



export default AcademicYearsSelection





