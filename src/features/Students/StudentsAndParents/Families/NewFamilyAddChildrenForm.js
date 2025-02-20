import { useState, useEffect } from "react";
import { useGetStudentsByYearQuery } from "../Students/studentsApiSlice";
import { useContext } from "react";
import { StepperContext } from "../../../../contexts/StepperContext";
//constrains on inputs when creating new parent

const NewFamilyAddChildrenForm = () => {
  useEffect(() => {
    document.title = "Add Children";
  });
  //an add parent function that can be called inside the component
  const { children, setChildren, canSaveChildren, setCanSaveChildren } =
    useContext(StepperContext);

  const {
    data: students, 
    // isLoading: isStudentListLoading, 
    isSuccess: isStudentListSuccess,
    // isError: isStudentListError,
    // error: studentListError,
  } = useGetStudentsByYearQuery(
    {
      selectedYear: "1000",
      criteria: "No Family",
      endpointName: "NewFamilyAddChildrenForm",
    } || {},
    {
     
      refetchOnFocus: true, 
      refetchOnMountOrArgChange: true, 
    }
  );

  let studentsList = [];

  if (isStudentListSuccess) {
    //set to the state to be used for other component s and edit student component

    const { entities } = students;
    //we need to change into array to be read??
    studentsList = Object.values(entities);
    //console.log(studentsList, 'studetns list')
  }

  const handleChildChange = (index, value) => {
    const newChildren = [...children];
    newChildren[index] = { child: value };
    setChildren(newChildren);
  };

  const addChildDropdown = () => {
    setChildren([...children, { child: "" }]);
  };

  const removeChildDropdown = (index) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  //console.log('children', children)

  // Function to get remaining studetns after seledction
  const getFilteredStudents = (currentChildren, selectedIndex) => {
    return studentsList.filter(
      (student) =>
        !currentChildren.some((childObj) => childObj.child === student.id) ||
        student.id === currentChildren[selectedIndex]?.child
    );
  };
  let content;
  if (isStudentListSuccess) {
    setCanSaveChildren(Array.isArray(children) && children[0] !== ""); //will ensure children is not an empty array or with only an emptry value
    //console.log(canSaveChildren,'canSaveChildren')
    // console.log(children, "children array");
    content = (
      <>
        <form className="form-container">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Add Children</h2>
          </div>

          {children?.map((childObj, index) => (
            <div key={index} className="mb-4 flex items-center space-x-4">
              <select
                value={childObj.child} // Use childObj.child as the value
                onChange={(e) => handleChildChange(index, e.target.value)} // Pass the new value to handleChildChange
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-700"
              >
                <option value="">Select a child</option>
                {getFilteredStudents(children, index).map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.studentName.firstName}{" "}
                    {option.studentName.middleName}{" "}
                    {option.studentName.lastName}
                  </option>
                ))}
              </select>

              {children.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeChildDropdown(index)}
                  className="px-3 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
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
              className="w-full px-4 py-2 bg-sky-700 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-sky-700"
            >
              Add Child
            </button>
          </div>
        </form>
      </>
    );
  }

  return content;
};
export default NewFamilyAddChildrenForm;
