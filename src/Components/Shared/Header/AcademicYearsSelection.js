import React from 'react'

import { Field, Label, Select } from '@headlessui/react'
// import { Description } from '@headlessui/react';
import { useGetAcademicYearsQuery, selectAllAcademicYears } from "../../../features/AppSettings/Academics/academicYearsApiSlice"

import { BsChevronDown } from "react-icons/bs"
import { useSelector, useDispatch } from 'react-redux'
import {selectAcademicYear,  setAcademicYears} from '../../../features/AppSettings/Academics/academicYearsSlice'
import { useState , useEffect} from 'react'
import useAcademicYears from '../../../hooks/useAcademicYears'


const AcademicYearsSelection = () => {
  const dispatch = useDispatch()



//const listOfAcademicYears = useSelector(state => selectAllAcademicYears(state))//this is original
const academicYears = useSelector(selectAllAcademicYears)//this works
//const initialAcademicYears = useSelector(state=>state.academicYears)//this is new
//const academicYears = Object.values(initialAcademicYears.entities)

//default selection is the year selcted if exists or current year
const [defaultYear, setDefaultYear] =useState('')
useEffect(()=>{
  dispatch(setAcademicYears(academicYears))//dispatch list to state,this only shows tehn redux state not empty in the browser tools
  const selectedYear =  academicYears.find((year)=>year.isSelected===true)
  const currentYear =  academicYears.find((year)=>year.currentYear===true)

  if (selectedYear) {  setDefaultYear(selectedYear)}
  else{setDefaultYear(currentYear)}
},[academicYears])

//update the state when we select a year using the reducer from slice
const handleSelectedAcademicYear =(e) =>{
  const  id = e.target.value
 //console.log(selectedTitle)
  dispatch(selectAcademicYear({id:id}))
}
const sortedAcademicYears = [...academicYears].sort((a, b) => b.title.localeCompare(a.title))//will sort the selection options 
let content

  return (
     
      <Field className=' flex flex-col items-center'>
        <Label className="text-sm/5 font-medium text-black ">Academic Year</Label>
        {/* <Description className="text-sm/6 text-white/50"> clients on the project.</Description> */}
        <div className="inline-flex relative">
          <BsChevronDown className="absolute right-2 top-2" aria-hidden="true" />
          {/*add defaultvalue the curretn  academic year to select */}
          <Select name="SelectedAcademicYear"   onChange={handleSelectedAcademicYear} defaultValue={defaultYear} className= ' relative mt-1  w-32 data-[hover]:shadow block data-[focus]:bg-blue-200 appearance-none rounded-sm border-gray-600 bg-white/5 py-0 px-3 text-md/6 text-gray-900 border '>
          {sortedAcademicYears.map(year=> (<option key= {year.id} value ={year.id}  className=''> {year.title} </option> ))}
          </Select>
        </div>
      </Field>
 
    
      )}



export default AcademicYearsSelection





