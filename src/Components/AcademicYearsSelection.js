import React from "react";
import { selectAllAcademicYears } from "../features/AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import {
  academicYearSelected,
  setAcademicYears,
  selectCurrentAcademicYearId,
} from "../features/AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

//we could include permissions to only allow some users to select
const AcademicYearsSelection = () => {
  const dispatch = useDispatch();
  //const listOfAcademicYears = useSelector(state => selectAllAcademicYears(state))//this is original but not working if we did not use the query in the list
  const academicYears = useSelector(selectAllAcademicYears); //this works because prefetch and from apislice not slice not in teh state redux yet
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the currently selected academic year
  const { isAdmin, isManager, isDirector } = useAuth();

  //to ensure update of value every render
  useEffect(() => {
    if (academicYears && academicYears.length > 0) {
      dispatch(setAcademicYears(academicYears));
    } //dispatch list to state,this only shows tehn redux state not empty in the browser tools, check later if this is needed as the query updated the state in apislice
  }, [academicYears, dispatch]); // added dispatch here

  // Automatically select the first academic year if none is selected
  useEffect(() => {
    if (!selectedAcademicYearId && academicYears.length > 0) {
      const defaultYearId = academicYears[0].id;
      dispatch(academicYearSelected({ id: defaultYearId }));
    }
  }, [selectedAcademicYearId, academicYears, dispatch]);

  //console.log("selected year idnow", selectedAcademicYearId);
  //update the state when we select a year using the reducer from slice
  const handleSelectedAcademicYear = (e) => {
    const id = e.target.value;
    console.log(selectedAcademicYearId);
    //this will publish the curretn selectiont ob eused by other components
    dispatch(academicYearSelected({ id }));
  };
  //const sortedList = academicYears.sort((a, b) => b.title.localeCompare(a.title))//will sort the selection options with topo most recent

  const content = (
    <div className="flex items-center space-x-2">
      <div className="inline-flex relative">
        {/* <BsChevronDown
          className="absolute right-1 top-3 pointer-events-none text-gray-300"
          aria-hidden="true"
        /> */}
        <label htmlFor="SelectedAcademicYear" hidden={!( isAdmin || isManager || isDirector)} className="formInputLabel">
          Academic Year
          <select
            id="SelectedAcademicYear"
            name="SelectedAcademicYear"
            onChange={handleSelectedAcademicYear}
            value={selectedAcademicYearId} // Set the value to the currently selected academic year
            className="relative   ml-2  pl-3  py-2 text-md bg-gray-300 text-gray-900  border border-gray-400  shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-sky-700"
            hidden={!( isAdmin || isManager || isDirector)}
          >
            {academicYears.map(
              (year) =>
                (year.title !== "1000" ||
                  isAdmin ||
                  isManager ||
                  isDirector) && (
                  <option
                    key={year.id}
                    value={year.id}
                    aria-placeholder="select AcademicYear"
                  >
                    {year.title}
                  </option>
                )
            )}
          </select>
        </label>
      </div>
    </div>
  );
  return content;
};

export default AcademicYearsSelection;

//Selector to get the full academic year object based on the selected id
export const selectCurrentAcademicYear = createSelector(
  [
    selectAllAcademicYears,
    (state) => state.academicYear.selectedAcademicYearId,
  ],
  (academicYears, selectedId) =>
    academicYears.find((year) => year.id === selectedId)
);
