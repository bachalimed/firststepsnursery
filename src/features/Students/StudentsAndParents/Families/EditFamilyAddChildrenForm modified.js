// import { useState, useEffect, useContext } from "react";
// import { useGetStudentsByYearQuery } from "../Students/studentsApiSlice";
// import { StepperContext } from "../../../../contexts/StepperContext";

// export default function EditFamilyAddChildrenForm() {
//   const { children, setChildren, setCanSaveChildren } =
//     useContext(StepperContext);
//   const [isUpdatingChildren, setIsUpdatingChildren] = useState(false);
//   const [allStudents, setAllStudents] = useState([]);

//   // Fetch students data
//   const {
//     data: students,
//     isLoading: isStudentListLoading,
//     isSuccess: isStudentListSuccess,
//   } = useGetStudentsByYearQuery(
//     {
//       selectedYear: "1000",
//       criteria: "No Family",
//       endpointName: "studentsList",
//     },
//     { refetchOnFocus: true, refetchOnMountOrArgChange: true }
//   );
//   // Helper function to transform student objects
//   const transformStudent = (student) => ({
//     _id: student._id || student.id, // Use `_id`
//     studentName: student.studentName, // Keep only `studentName`
//     isSelected: false, // Default to not selecte
//   });
//   // Update allStudents whenever students data changes
//   useEffect(() => {
//     if (isStudentListSuccess) {
//       const studentsList = Object.values(students.entities).map(
//         transformStudent
//       );
//       const allInitialStudents = [
//         ...children.map((child) => ({
//           _id: child.child._id,
//           studentName: child.child.studentName,
//           isSelected: true, // Mark as selected
//         })),
//         ...studentsList,
//       ];
//       setAllStudents(allInitialStudents);
//     }
//   }, [students, children, isStudentListSuccess]);

//   const handleChildChange = (id) => {
//     // Find the selected student by ID
//     const selectedStudent = allStudents.find((student) => student._id === id);

//     // Update allStudents to mark the selected student as selected
//     const updatedStudents = allStudents.map((student) => {
//       if (student._id === selectedStudent._id) {
//         return { ...student, isSelected: true };
//       }
//       return student; // Return the student as is if not selected
//     });

//     // Set the updated state for allStudents
//     setAllStudents(updatedStudents);

//     // Update the children array by adding a new object with the selected student's ID
//     const updatedChildren = [...children, { child: selectedStudent._id }];

//     // Set the updated state for children
//     setChildren(updatedChildren);
//   };

//   // UseEffect to update save button state
//   useEffect(() => {
//     setCanSaveChildren(
//       Array.isArray(children) &&
//         children.length > 0 &&
//         children[0]?.child !== ""
//     );
//   }, [children, setCanSaveChildren]);

//   const addChildDropdown = () => {
//     // Find the first student that is not selected
//     const firstAvailableStudent = allStudents.find(
//       (student) => !student.isSelected
//     );

//     // If a student was added, update their isSelected state to true
//     if (firstAvailableStudent) {
//       // Update the children array with the new child
//       const updatedStudents = allStudents.map((student) => {
//         if (student._id === firstAvailableStudent._id) {
//           const updatedStudent = { ...student, isSelected: true };
//           setChildren({ ...children, child: updatedStudent });
//           setAllStudents(updatedStudents);
//         }
//       });
//     }
//   };
//   // Remove a child selection dropdown
//   const removeChildDropdown = (id) => {
//     // Update allStudents to set isSelected to false for the removed student
//     const updatedStudents = allStudents.map((student) =>
//       student._id === id ? { ...student, isSelected: false } : student
//     );

//     // Update children array to remove the selected student
//     const updatedChildren = children.filter((child) => child.child._id !== id);

//     // Update state
//     setAllStudents(updatedStudents);
//     setChildren(updatedChildren);
//   };
//   // console.log(children, "children");
//   // console.log(allStudents, "allStudents");

//   let content;
//   if (isStudentListSuccess && !isUpdatingChildren) {
//     content = (
//       <form className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
//         <div className="mb-6 text-center">
//           <h2 className="text-2xl font-bold text-gray-800">Add Children</h2>
//         </div>

//         {/* Display selected children */}
//         {children.map((childObj) => {
//           const selectedChild = childObj.child;

//           return (
//             <div
//               key={selectedChild._id}
//               className="mb-4 flex items-center space-x-4"
//             >
//               <select
//                 value={selectedChild?._id}
//                 onChange={(e) => handleChildChange(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-700"
//               >
//                 <option value="">Select a child</option>

//                 {/* Display all students with their selection status */}
//                 {allStudents.map((option) => (
//                   <option
//                     key={option._id}
//                     value={option?._id}
//                     disabled={
//                       option?.isSelected //&& option?._id !== selectedChild?._id
//                     }
//                   >
//                     {option?.studentName?.firstName}{" "}
//                     {option?.studentName?.middleName || ""}{" "}
//                     {option?.studentName?.lastName}
//                     {/* {option.isSelected &&
//                         option._id !== selectedChild?._id &&
//                         " (Already Selected)"} */}
//                   </option>
//                 ))}
//               </select>

//               {children.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeChildDropdown(selectedChild._id)}
//                   className="px-3 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           );
//         })}

//         <div className="mb-6">
//           <button
//             type="button"
//             onClick={addChildDropdown}
//             className="w-full px-4 py-2 bg-sky-700 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-sky-700"
//           >
//             Add Child
//           </button>
//         </div>
//       </form>
//     );
//   }

//   return content || null;
// }
