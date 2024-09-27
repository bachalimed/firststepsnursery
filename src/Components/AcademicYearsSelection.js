import React from "react";

import { Field, Label, Select } from "@headlessui/react";
// import { Description } from '@headlessui/react';
import { selectAllAcademicYears } from "../features/AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice";
import { createSelector } from "@reduxjs/toolkit";

import { BsChevronDown } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import {
  academicYearSelected,
  setAcademicYears,
  selectCurrentAcademicYearId,
} from "../features/AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useState, useEffect } from "react";

import useAuth from "../hooks/useAuth";

//we could include permissions to only allow some users to select
const AcademicYearsSelection = () => {
  const dispatch = useDispatch();
  //const listOfAcademicYears = useSelector(state => selectAllAcademicYears(state))//this is original but not working if we did not use the query in the list
  const academicYears = useSelector(selectAllAcademicYears); //this works because prefetch and from apislice not slice not in teh state redux yet
  //console.log(academicYears,'academicYears from apislice')
  //very important to dispatch every time there is a refresh

  //const academicYears = useSelector(selectAllAcademicYears)//we are trying to get from the state of the slice after it was updated in the usehook later we will get from teh hook directly
  useEffect(() => {
    dispatch(setAcademicYears(academicYears)); //dispatch list to state,this only shows tehn redux state not empty in the browser tools, check later if this is needed as the query updated the state in apislice
  }, [academicYears, dispatch]); // added dispatch here
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the currently selected academic year
  const { isAdmin, isManager } = useAuth();
  console.log("selected year idnow", selectedAcademicYearId);
  //update the state when we select a year using the reducer from slice
  const handleSelectedAcademicYear = (e) => {
    const id = e.target.value;
    //console.log(selectedTitle)
    //this will publish the curretn selectiont ob eused by other components
    dispatch(academicYearSelected({ id }));
  };
  //const sortedList = academicYears.sort((a, b) => b.title.localeCompare(a.title))//will sort the selection options with topo most recent

  const content = (
    <Field className="flex items-center space-x-4">
      <Label className="text-sm font-medium text-black">Academic Year</Label>
      <div className="inline-flex relative">
        <BsChevronDown
          className="absolute right-2 top-3 pointer-events-none text-gray-400"
          aria-hidden="true"
        />
        <Select
          name="SelectedAcademicYear"
          onChange={handleSelectedAcademicYear}
          value={selectedAcademicYearId || ""} // Set the value to the currently selected academic year
          className="relative mt-1 w-36 pl-3 pr-8 py-2 text-md text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {academicYears.map((year) => (
            <option key={year.id} value={year.id}>
              {year.title}
            </option>
          ))}
        </Select>
      </div>
    </Field>
  );
  return content;
};

export default AcademicYearsSelection;

// Selector to get the full academic year object based on the selected id
export const selectCurrentAcademicYear = createSelector(
  [
    selectAllAcademicYears,
    (state) => state.academicYear.selectedAcademicYearId,
  ],
  (academicYears, selectedId) =>
    academicYears.find((year) => year.id === selectedId)
);
