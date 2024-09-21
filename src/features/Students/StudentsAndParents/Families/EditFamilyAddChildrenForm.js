import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../../config/UserRoles";
import { ACTIONS } from "../../../../config/UserActions";
import StudentsParents from "../../StudentsParents";
import { useGetFamiliesByYearQuery } from "./familiesApiSlice";
import { useGetStudentsByYearQuery } from "../Students/studentsApiSlice";
import { useContext } from "react";
import { StepperContext } from "../../../../contexts/StepperContext";
//constrains on inputs when creating new parent

export default function EditFamilyAddChildrenForm() {
  //an add parent function that can be called inside the component
  const { children, setChildren, canSaveChildren, setCanSaveChildren } = useContext(StepperContext);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [unselectedStudents, setUnselectedStudents] = useState([]);
  //console.log(children,'children frist in add children')
  const [isUpdatingChildren, setIsUpdatingChildren] = useState(false)//to ensure state properly updated
  const {
    data: students, //the data is renamed parents
    isLoading: isStudentListLoading, //monitor several situations
    isSuccess: isStudentListSuccess,
    isError: isStudentListError,
    error: studentListError,
  } = useGetStudentsByYearQuery(
    {
      selectedYear: "1000",
      criteria: "No Family",
      endpointName: "studentsList",
    } || {},
    {
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );
  let studentsList = [];

  if (isStudentListSuccess) {
    const { entities } = students;
    studentsList = Object.values(entities)
	// .map(student => ({
    //   _id: student.id,
    //   studentFullName: `${student.studentName.firstName} ${student.studentName.middleName || ''} ${student.studentName.lastName}`.trim()
    // }));
  }

// Helper function to transform student objects
const transformStudent = (student) => ({
  _id: student._id || student.id, // Use `_id`
  studentName: student.studentName, // Keep only `studentName`
  isSelected: false, // Default to not selecte
});
// Update allStudents whenever students data changes or children change
useEffect(() => {
  if (isStudentListSuccess) {
    const studentsList = Object.values(students.entities).map(
      transformStudent
    );
    //console.log(studentsList,'studentsList1')
    const allInitialStudents = [
      ...children.map((child) => ({
        _id: child.child._id,
        studentName: child.child.studentName,
        isSelected: true, // Mark as selected
      })),
      ...studentsList,
    ];
    setAllStudents(allInitialStudents);
    const selectedStu = () => {
      return allInitialStudents.filter((student) => student.isSelected ===true
    )
  }
  setSelectedStudents(selectedStu())
    const unselectedStu = () => {
      return allInitialStudents.filter((student) => student.isSelected !==true
    )
  }
  setUnselectedStudents(unselectedStu())
}
}, [students, children, isStudentListSuccess]);
console.log(allStudents,'allStudents')
console.log(children,'children')
console.log(selectedStudents,'selectedStudents')
console.log(unselectedStudents,'unselectedStudents')

const handleChildChange = (id) => {
// Handle changes in the child dropdown selection
  // Find the selected student based on the ID
  const selectedStudent = allStudents.find((student) => student._id === id);

  // Update allStudents to mark the selected student as selected
  const updatedStudents = allStudents.map((student) =>
    student._id === selectedStudent._id
      ? { ...student, isSelected: true } // Mark as selected
      : student // Keep the original student
  );

  // Set the updated state for allStudents
  setAllStudents(updatedStudents);

  // Create a new child object to add to the children array
  const newChild = {
    child: {
      _id: selectedStudent._id,
      studentName: selectedStudent.studentName,
    },
  };

  // Update children array by adding the new child object
  setChildren([...children, newChild]);
};

  // const addChildDropdown = () => {
  //   //setAllStudents([...allStudents, {_id:"",studentName:{firstName:"", middleName:"", lastName:""}}]);
  //   setChildren([...children, {child:{_id:"",studentName:{firstName:"", middleName:"", lastName:""}}}]);
  // };
let firstAvailableStudent
  const addChildDropdown = () => {
    // Find the first student that is not selected
     firstAvailableStudent = allStudents.find(
      (student) => !student.isSelected
    );
    //console.log(firstAvailableStudent,'firstAvailableStudent')
    // If a student was added, update their isSelected state to true
    if (firstAvailableStudent) {
      // Update the children array with the new child
      
          setChildren([...children, {child:{...firstAvailableStudent, isSelected:true}}]);
          //console.log(children,'children111')
		 
        }
      };
    
  console.log(firstAvailableStudent)

  // Refactored removeChildDropdown function
  // remove from children and set isselected to false and it will update inthe useeffect
  const removeChildDropdown = (childId) => {
    // Remove the child from the children array by filtering out the child with the specified childId
    const updatedChildren = children.filter((child) => child.child._id !== childId);
    
    // Update the children state
    setChildren(updatedChildren);

    // Update the student's isSelected status in allStudents
    const updatedAllStudents = allStudents.map((student) =>
      student._id === childId ? { ...student, isSelected: false } : student
    );
    setAllStudents(updatedAllStudents);

    // Update selected and unselected students
    setSelectedStudents(updatedAllStudents.filter((student) => student.isSelected));
    setUnselectedStudents(updatedAllStudents.filter((student) => !student.isSelected));
  };


 
  useEffect(() => {
    // Set the save button's availability based on whether valid children exist
    setCanSaveChildren(Array.isArray(children) && children.length > 0 && children[0]?.child !== "");
  }, [children, setCanSaveChildren]);

  let content;
  if (isStudentListSuccess&&(!isUpdatingChildren)) {
    content = (
      <form className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Add Children</h2>
        </div>

        {/* Display selected children */}
        {children.map((childObj) => {//this is the number of lines selected
          // Find the selected child from the students list
          const selectedChild = allStudents.find((student) => student._id === childObj.child._id);
			console.log(selectedChild,'selectedChild')
          return (
            <div key={childObj.child._id} className="mb-4 flex items-center space-x-4">
              <select
                value={childObj.child._id}
                onChange={(e) => handleChildChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {/* Display the name of the selected child */}
                {selectedChild ? (
                  <option value={selectedChild._id}>
                    {selectedChild?.studentName?.firstName} {selectedChild?.studentName?.middleName} {selectedChild?.studentName?.lastName}
                  </option>
                ) : (
                  <option value="">Select a child</option>
                )}
                
                  

                {/* Display remaining students in the dropdown */}
                {unselectedStudents
                  .filter(
                    (option) => option._id !== childObj.child._id // Avoid duplicate entries
                  )
                  .map((option) => (
                    <option key={option._id} value={option._id}>
                      {option?.studentName?.firstName}{" "}
                      {option?.studentName?.middleName}{" "}
                      {option?.studentName?.lastName}
                    </option>
                ))}
              </select>

              {children.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeChildDropdown(selectedChild._id)}
                  className="px-3 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Remove
                </button>
              )}
            </div>
          );
        })}

        <div className="mb-6">
          {(selectedStudents.length>0)&&<button
            type="button"
            onClick={addChildDropdown}
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Child
          </button>}
        </div>
      </form>
    );
  }

  return content || null;
}