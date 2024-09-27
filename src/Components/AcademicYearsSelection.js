import React from 'react'

import { Field, Label, Select } from '@headlessui/react'
// import { Description } from '@headlessui/react';
import { useGetAcademicYearsQuery, selectAllAcademicYears } from '../features/AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice'

import { BsChevronDown } from "react-icons/bs"
import { useSelector, useDispatch } from 'react-redux'
import {academicYearSelected,  setAcademicYears} from '../features/AppSettings/AcademicsSet/AcademicYears/academicYearsSlice'
import { useState , useEffect} from 'react'
//import useAcademicYears from '../../../hooks/useAcademicYears'
import { useSelectedAcademicYear } from '../hooks/useSelectedAcademicYear'
import useAuth from '../hooks/useAuth'

//we could include permissions to only allow some users to select
const AcademicYearsSelection = () => {
  const dispatch = useDispatch()
//const listOfAcademicYears = useSelector(state => selectAllAcademicYears(state))//this is original but not working if we did not use the query in the list
const academicYears = useSelector(selectAllAcademicYears)//this works because prefetch?

//very important to dispatch every time there is a refresh
useEffect(()=>{
  dispatch(setAcademicYears(academicYears))//dispatch list to state,this only shows tehn redux state not empty in the browser tools, check later if this is needed as the query updated the state in apislice
},[academicYears, dispatch])// added dispatch here

const {isAdmin, isManager}=useAuth()

//update the state when we select a year using the reducer from slice
const handleSelectedAcademicYear =(e) =>{
  const  id = e.target.value
 //console.log(selectedTitle)
 //this will publish the curretn selectiont ob eused by other components
  dispatch(academicYearSelected({id:id}))
}
//const sortedList = academicYears.sort((a, b) => b.title.localeCompare(a.title))//will sort the selection options with topo most recent

 
  const content = (
     
      <Field className="flex items-center space-x-4">
        <Label className="text-sm font-medium text-black">Academic Year</Label>
        {/* <Description className="text-sm/6 text-white/50"> clients on the project.</Description> */}
        <div className="inline-flex relative">
          <BsChevronDown className="absolute right-2 top-3 pointer-events-none text-gray-400"  aria-hidden="true" />
          {/*add defaultvalue the curretn  academic year to select */}
          <Select 
            name="SelectedAcademicYear"  
           
            onChange={handleSelectedAcademicYear}  
            className="relative mt-1 w-36 pl-3 pr-8 py-2 text-md text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
          {academicYears.map(year=> (
            <option key= {year.id} value ={year.id}  className=''> {year.title} </option> ))}
            {/* {isManager&&<option  value ='1000' > 1000 </option>} */}
          </Select>
        </div>
      </Field>
 
    
      )
    return content}



export default AcademicYearsSelection





