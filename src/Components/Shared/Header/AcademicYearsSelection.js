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
  const {
    data: academicYearsData,
    isLoading,//monitor several situations is loading...
    isSuccess,
    isError,
    error
} = useGetAcademicYearsQuery('academicYearsListt', {//this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
    //pollingInterval: 60000,//will refetch data every 60seconds
    //refetchOnFocus: true,//when we focus on another window then come back to the window ti will refetch data
    refetchOnMountOrArgChange: true//refetch when we remount the component
})


//const listOfAcademicYears = useSelector(state => selectAllAcademicYears(state))//this is original
const academicYears = useSelector(selectAllAcademicYears)//this works
//dispatch list to state

useEffect(() => {
  if (isSuccess) {
    dispatch(setAcademicYears(academicYears))
  }
},[isSuccess, dispatch, academicYearsData])
  // dispatch(setAcademicYears({ academicYears }))},[dispatch])

//default selection is the year selcted if exists or current year
const [defaultYear, setDefaultYear] =useState({})
useEffect(()=>{
  const selectedYear =  academicYears.find((year)=>year.isSelected===true)
  const currentYear =  academicYears.find((year)=>year.currentYear===true)

  if (selectedYear) {  setDefaultYear(selectedYear)}
  else{setDefaultYear(currentYear)}
},[academicYears])


//update the state with the selected year using the reducer from slice
const handleSelectedAcademicYear =(e) =>{
  const  selectedTitle = e.target.value
 //console.log(selectedTitle)
 
  dispatch(selectAcademicYear({selectedTitle:selectedTitle}))
}
// const {currentAcademicYear} = useAcademicYears
// console.log('currentAcademicYear')
// console.log(currentAcademicYear)



let content
// if (isLoading) content = <p>Loading...</p>

// if (isError) {
//     content = <p className="errmsg">{error?.data?.message}</p>//errormessage class defined in the css, the error has data and inside we have message of error
// }

// if (isSuccess) {
          
  return (
    
    
        
      <Field className=' flex flex-col items-center'>
        <Label className="text-sm/5 font-medium text-black ">Academic Year</Label>
        {/* <Description className="text-sm/6 text-white/50"> clients on the project.</Description> */}
        <div className="inline-flex relative">
          <BsChevronDown className="absolute right-2 top-2" aria-hidden="true" />
          {/*add defaultvalue the curretn  academic year to select */}
          <Select name="SelectedAcademicYear"   onChange={handleSelectedAcademicYear} defaultValue={defaultYear} className= ' relative mt-1  w-32 data-[hover]:shadow block data-[focus]:bg-blue-200 appearance-none rounded-sm border-gray-600 bg-white/5 py-0 px-3 text-md/6 text-gray-900 border '>
          {academicYears.map(year=> (<option key= {year.id} value ={year.title}  className=''> {year.title} </option> ))}
          </Select>
        </div>
      </Field>
 
    
      )}
// }


export default AcademicYearsSelection





