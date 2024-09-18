import { useState, useEffect } from "react"
import { useAddNewFamilyMutation } from "./familiesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../../../config/UserRoles"
import { ACTIONS } from "../../../../config/UserActions"
import StudentsParents from '../../StudentsParents'
import { useGetFamiliesByYearQuery } from "./familiesApiSlice"
import { useGetStudentsByYearQuery } from "../Students/studentsApiSlice"
import { useContext } from "react"
import { StepperContext } from "../../../../contexts/StepperContext"
//constrains on inputs when creating new parent


const NewFamilyAddChildrenForm = () => {//an add parent function that can be called inside the component
    const {children, setChildren}= useContext(StepperContext)
    const {family, setFamily}= useContext(StepperContext)
    const{canSaveChildren,  setCanSaveChildren }= useContext(StepperContext)
const Navigate = useNavigate()
    
const [addNewFamily, {//an object that calls the status when we execute the newParentForm function
        isLoading:isAddFamilyLoading,
        isSuccess:isAddFamilySuccess,
        isError:isAddFamilyError,
        error:addFamilyError
    }] = useAddNewFamilyMutation()//it will not execute the mutation nownow but when called

    
    const {
        data: students,//the data is renamed parents
        isLoading: isStudentListLoading,//monitor several situations
        isSuccess: isStudentListSuccess,
        isError: isStudentListError,
        error: studentListError
      } = useGetStudentsByYearQuery({selectedYear:'1000' , criteria:'No Family',endpointName: 'studentsList'}||{},{//this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
        //pollingInterval: 60000,//will refetch data every 60seconds
        refetchOnFocus: true,//when we focus on another window then come back to the window ti will refetch data
        refetchOnMountOrArgChange: true//refetch when we remount the component
      })


      let studentsList =[]
      
      if (isStudentListSuccess){
        //set to the state to be used for other component s and edit student component
        
        const {entities}=students
        //we need to change into array to be read??
        studentsList = Object.values(entities)
        //console.log(studentsList, 'studetns list')
      }


      const handleChildChange = (index, value) => {
        const newChildren = [...children];
        newChildren[index] = { child: value };  // Store the value as an object with 'child' as key
        setChildren(newChildren);
    };
    
    const addChildDropdown = () => {
        setChildren([...children, { child: '' }]);  // Add a new object to the array
    };
    
    const removeChildDropdown = (index) => {
        setChildren(children.filter((_, i) => i !== index));
    };
    
console.log('children', children)

    const handleCancel= ()=>{
        Navigate ('/students/studentsParents/families/')
    }
  // Function to get remaining studetns after seledction
const getFilteredStudents = (currentChildren, selectedIndex) => {
    return studentsList.filter(student => !currentChildren.includes(student.id) || student.id === currentChildren[selectedIndex]);
}
let content
if (isStudentListSuccess){
setCanSaveChildren(Array.isArray(children)&&children[0]!=='')//will ensure children is not an empty array or with only an emptry value
//console.log(canSaveChildren,'canSaveChildren')
//console.log(children, 'children array')
    content = (
        <>
  <form className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Add Children</h2>
    </div>

    {children?.map((child, index) => (
      <div key={index} className="mb-4 flex items-center space-x-4">
        <select
          value={child}
          onChange={(e) => handleChildChange(index, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a child</option>
          {getFilteredStudents(children, index).map((option) => (
            <option key={option.id} value={option.id}>
              {option.studentName.firstName} {option.studentName.middleName}{' '}
              {option.studentName.lastName}
            </option>
          ))}
        </select>

        {children.length > 1 && (
          <button
            type="button"
            onClick={() => removeChildDropdown(index)}
            className="px-3 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Remove
          </button>
        )}
      </div>
    ))}

    <div className="mb-6">
      <button
        type="button"
        onClick={addChildDropdown}
        className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Child
      </button>
    </div>

    {/* <div className="flex justify-end space-x-4">
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        type="submit"
        title="Save"
        onClick={onSaveParentClicked}
        disabled={!canSave}
      >
        Save Changes
      </button>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div> */}
  </form>
</>
    )}

    return content
}
export default NewFamilyAddChildrenForm