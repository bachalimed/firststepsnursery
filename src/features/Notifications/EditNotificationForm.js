// import { useState, useEffect } from "react";
// import { useUpdateNotificationMutation } from "./notificationsApiSlice";
// import { useNavigate } from "react-router-dom";

// import { ROLES } from "../../../config/UserRoles";
// import { ACTIONS } from "../../../config/UserActions";
// import useAuth from "../../../hooks/useAuth";
// import Notifications from "../Notifications";
// import {
//   selectAllAcademicYears,
//   selectCurrentAcademicYearId,
//   selectAcademicYearById,
// } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
// import { useSelector } from "react-redux";

// //constrains on inputs when creating new user
// const USER_REGEX = /^[A-z 0-9]{6,20}$/;
// const NAME_REGEX = /^[A-z 0-9]{3,18}$/;
// const NUMBER_REGEX = /^[0-9]{1,4}(\.[0-9]{0,3})?$/;
// const PHONE_REGEX = /^[0-9]{6,15}$/;
// const DOB_REGEX = /^[0-9/-]{4,10}$/;
// const YEAR_REGEX = /^[0-9]{4}\/[0-9]{4}$/;
// const EditNotificationForm = ({ employee }) => {
//   const navigate = useNavigate();

//   const { isAdmin, isManager } = useAuth();
//   const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
//   const selectedAcademicYear = useSelector((state) =>
//     selectAcademicYearById(state, selectedAcademicYearId)
//   ); // Get the full academic year object
//   const academicYears = useSelector(selectAllAcademicYears);
//   // console.log(employee,'employee')

//   const [updateNotification, { isLoading, isSuccess, isError, error }] =
//     useUpdateNotificationMutation();

//   // Consolidated form state
//   const [formData, setFormData] = useState({
//     employeeId: employee?.employeeId,
//     userId: employee?.id,
//     userFullName: employee?.userFullName,
//     userDob: employee?.userDob.split("T")[0],
//     userSex: employee?.userSex,
//     userAddress: employee?.userAddress,
//     userContact: employee?.userContact,
//     userRoles: employee?.userRoles,
//     employeeAssessment: employee?.employeeData?.employeeAssessment,
//     employeeWorkHistory: employee.employeeData?.employeeWorkHistory || [],
//     employeeIsActive: employee?.employeeData?.employeeIsActive,
//     employeeYears: employee?.employeeData?.employeeYears || [],
//     employeeCurrentEmployment: employee?.employeeData
//       .employeeCurrentEmployment || {
//       position: "",
//       joinDate: "",
//       contractType: "",
//       salaryPackage: {
//         basic: "",
//         payment: "",
//       },
//     },
//   });
//   // console.log(formData.userRoles);
//   const [validity, setValidity] = useState({
//     validFirstName: false,
//     validLastName: false,
//     validDob: false,
//     validUserSex: false,
//     validHouse: false,

//     validStreet: false,
//     validCity: false,
//     validPrimaryPhone: false,
//     validCurrentPosition: false,
//     validJoinDate: false,
//     validContractType: false,
//     validBasic: false,
//     validPayment: false,
//     validNotificationYear: false,
//   });

//   // Validate inputs using regex patterns
//   useEffect(() => {
//     setValidity((prev) => ({
//       ...prev,

//       validFirstName: NAME_REGEX.test(formData.userFullName?.userFirstName),
//       validLastName: NAME_REGEX.test(formData.userFullName?.userLastName),
//       validDob: DOB_REGEX.test(formData.userDob.split("T")[0]),
//       validUserSex: NAME_REGEX.test(formData.userSex),
//       validHouse: NAME_REGEX.test(formData.userAddress?.house),
//       validStreet: NAME_REGEX.test(formData.userAddress?.street),
//       validCity: NAME_REGEX.test(formData.userAddress?.city),
//       validPrimaryPhone: PHONE_REGEX.test(formData.userContact?.primaryPhone),
//       validCurrentPosition: USER_REGEX.test(
//         formData.employeeCurrentEmployment?.position
//       ),
//       validJoinDate: DOB_REGEX.test(
//         formData.employeeCurrentEmployment.joinDate.split("T")[0]
//       ),
//       validContractType: USER_REGEX.test(
//         formData.employeeCurrentEmployment?.contractType
//       ),
//       validBasic: NUMBER_REGEX.test(
//         formData.employeeCurrentEmployment?.salaryPackage?.basic
//       ),
//       validPayment: NAME_REGEX.test(
//         formData.employeeCurrentEmployment?.salaryPackage?.payment
//       ),
//       validNotificationYear: YEAR_REGEX.test(
//         formData.employeeYears[0].academicYear
//       ),
//     }));
//   }, [formData]);


//   useEffect(() => {
//     if (isSuccess) {
//       setFormData({});

//       navigate("/hr/employees/");
//     }
//   }, [isSuccess, navigate]);
//   const handleInputChange = (e) => {
//     // console.log(e.target.name, e.target.value); // Debugging line
//     const { name, value } = e.target;

//     // Handle nested object updates
//     if (name.startsWith("userFullName.")) {
//       const field = name.split(".")[1]; // Get the field name after 'userFullName.'
//       setFormData((prev) => ({
//         ...prev,
//         userFullName: {
//           ...prev.userFullName,
//           [field]: value,
//         },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };
//   const onAcademicYearChanged = (e, yearTitle) => {
//     const { checked } = e.target;

//     setFormData((prev) => {
//       const updatedYears = [...prev.employeeYears];

//       if (checked) {
//         // Add the selected year if it's checked and not already in the array
//         if (
//           !updatedYears.some((empYear) => empYear.academicYear === yearTitle)
//         ) {
//           updatedYears.push({ academicYear: yearTitle });
//         }
//       } else {
//         // Remove the year if unchecked
//         const filteredYears = updatedYears.filter(
//           (empYear) => empYear.academicYear !== yearTitle
//         );
//         return { ...prev, employeeYears: filteredYears };
//       }

//       return { ...prev, employeeYears: updatedYears };
//     });
//   };
//   const onuserRolesChanged = (e, role) => {
//     const { checked } = e.target;

//     setFormData((prev) => {
//       // Clone the previous userRoles array to avoid direct mutation
//       const updatedUserRoles = [...prev.userRoles];

//       if (checked) {
//         // Add the selected role if it's checked and not already in the array
//         if (!updatedUserRoles.includes(role)) {
//           updatedUserRoles.push(role);
//         }
//       } else {
//         // Remove the role if unchecked
//         const filteredRoles = updatedUserRoles.filter(
//           (userRole) => userRole !== role
//         );
//         return { ...prev, userRoles: filteredRoles };
//       }

//       return { ...prev, userRoles: updatedUserRoles };
//     });
//   };
//   // Handler to update work history
//   const handleWorkHistoryChange = (index, field, value) => {
//     // Create a new copy of employeeWorkHistory
//     const updatedWorkHistory = formData.employeeWorkHistory.map((work, i) => {
//       if (i === index) {
//         return {
//           ...work, // Spread the existing work object
//           [field]: value, // Update the specific field
//         };
//       }
//       return work; // Return the existing work object for others
//     });

//     // Update the formData state
//     setFormData((prevState) => ({
//       ...prevState,
//       employeeWorkHistory: updatedWorkHistory, // Set the updated work history
//     }));
//   };

//   // Handler to remove work history
//   const handleRemoveWorkHistory = (index) => {
//     // Filter out the work history item to be removed
//     const updatedWorkHistory = formData.employeeWorkHistory.filter(
//       (_, i) => i !== index
//     );

//     // Update the formData state
//     setFormData((prevState) => ({
//       ...prevState,
//       employeeWorkHistory: updatedWorkHistory,
//     }));
//   };

//   // Handler to add work history
//   const handleAddWorkHistory = () => {
//     // Add a new empty work history object
//     const newWorkHistory = {
//       institution: "",
//       fromDate: "",
//       toDate: "",
//       position: "",
//       contractType: "",
//       salaryPackage: "",
//     };

//     // Update the formData state
//     setFormData((prevState) => ({
//       ...prevState,
//       employeeWorkHistory: [...prevState.employeeWorkHistory, newWorkHistory],
//     }));
//   };

//   const canSave =
//     Object.values(validity).every(Boolean) &&
//     formData?.userRoles?.length > 0 &&
//     !isLoading;

//   // console.log(formData, "formData");
//   // console.log(canSave, "canSave");
//   const onSaveNotificationClicked = async (e) => {
//     e.preventDefault();
//     if (canSave) {
//       try {
//         await updateNotification(formData);
//       } catch (err) {
//         console.error("Failed to save the employee:", err);
//       }
//     }
//   };

//   const handleCancel = () => {
//     navigate("/hr/employees/");
//   };

//   const content = (
//     <>
//       <Notifications />

//       <form onSubmit={onSaveNotificationClicked} className="form-container">
//         <h2  className="formTitle ">
//           Edit Notification :{" "}
//           {`${formData.userFullName.userFirstName} ${formData.userFullName.userMiddleName} ${formData.userFullName.userLastName}`}
//         </h2>
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">Notification Information</h3>
//           <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
//             <div>
//               <label htmlFor=""  className="formInputLabel">
//                 First Name{" "}
//                 {!validity.validFirstName && (
//                   <span className="text-red-600">*</span>
//                 )}
//               </label>
//               <input
//                 type="text"
//                 name="userFullName.userFirstName" // Changed to match the nested structure
//                 value={formData.userFullName.userFirstName}
//                 onChange={handleInputChange}
//                 className={`mt-1 block w-full border ${
//                   validity.validFirstName ? "border-gray-300" : "border-red-600"
//                 } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
//                 placeholder="Enter First Name"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor=""  className="formInputLabel">
//                 Middle Name
//               </label>
//               <input
//                 type="text"
//                 name="userFullName.userMiddleName" // Changed to match the nested structure
//                 value={formData.userFullName.userMiddleName}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <label htmlFor=""  className="formInputLabel">
//                 Last Name{" "}
//                 {!validity.validLastName && (
//                   <span className="text-red-600">*</span>
//                 )}
//               </label>
//               <input
//                 type="text"
//                 name="userFullName.userLastName" // Changed to match the nested structure
//                 value={formData.userFullName.userLastName}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             {/* DOB and Sex */}
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor=""
//                    className="formInputLabel"
//                   htmlFor="userDob"
//                 >
//                   Date of Birth{" "}
//                   {!validity.validDob && (
//                     <span className="text-red-600">*</span>
//                   )}
//                 </label>
//                 <input
//                   type="date"
//                   name="userDob"
//                   value={formData.userDob}
//                   onChange={handleInputChange}
//                   className={`mt-1 block w-full border ${
//                     validity.validDob ? "border-gray-300" : "border-red-600"
//                   } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor=""  className="formInputLabel">
//                   Sex{" "}
//                   {!validity.validUserSex && (
//                     <span className="text-red-600">*</span>
//                   )}
//                 </label>
//                 <div className="flex items-center space-x-4 mt-1">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       name="userSex"
//                       value="Male"
//                       checked={formData.userSex === "Male"}
//                       onChange={(e) => {
//                         setFormData((prev) => ({
//                           ...prev,
//                           userSex: e.target.checked
//                             ? "Male"
//                             : formData.userSex === "Male"
//                             ? ""
//                             : formData.userSex,
//                         }));
//                       }}
//                       className={`h-4 w-4 ${
//                         validity.validUserSex
//                           ? "border-gray-300 rounded"
//                           : "border-red-600 rounded"
//                       } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
//                     />
//                     <label htmlFor="" className="ml-2 text-sm text-gray-700">Male</label>
//                   </div>

//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       name="userSex"
//                       value="Female"
//                       checked={formData.userSex === "Female"}
//                       onChange={(e) => {
//                         setFormData((prev) => ({
//                           ...prev,
//                           userSex: e.target.checked
//                             ? "Female"
//                             : formData.userSex === "Female"
//                             ? ""
//                             : formData.userSex,
//                         }));
//                       }}
//                       className="h-4 w-4 border-gray-300 rounded focus:ring-indigo-500"
//                     />
//                     <label htmlFor="" className="ml-2 text-sm text-gray-700">Female</label>
//                   </div>
//                 </div>

//                 {/* Notification Years */}
//                 <h3 className="text-lg font-semibold mt-6">
//                   Notification Years
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {academicYears && academicYears.length > 0 ? (
//                     academicYears.map((year, index) => {
//                       const isChecked = formData.employeeYears.some(
//                         (empYear) => empYear.academicYear === year.title
//                       );

//                       return (
//                         <div key={index} className="flex items-center">
//                           <input
//                             type="checkbox"
//                             checked={isChecked}
//                             onChange={(e) =>
//                               onAcademicYearChanged(e, year.title)
//                             }
//                             className="mr-2"
//                           />
//                           <label htmlFor="" className="text-gray-700">{year.title}</label>
//                         </div>
//                       );
//                     })
//                   ) : (
//                     <p>No academic years available.</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Current Employment */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">
//             Notification Current EmploymentWork History
//           </h3>
//           <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
//             <div className="flex items-center space-x-3">
//               <input
//                 type="checkbox"
//                 id="employeeIsActive"
//                 checked={formData.employeeIsActive === true}
//                 onChange={(e) => {
//                   setFormData((prev) => ({
//                     ...prev,
//                     employeeIsActive: e.target.checked ? true : false,
//                   }));
//                 }}
//                 className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//               />
//               <label htmlFor=""
//                 htmlFor="employeeIsActive"
//                 className="text-sm font-medium text-gray-700"
//               >
//                 Notification is Active
//               </label>
//             </div>
//             <div>
//               <label htmlFor=""  className="formInputLabel">
//                 Current Position{" "}
//                 {!validity.validCurrentPosition && (
//                   <span className="text-red-600">*</span>
//                 )}
//               </label>
//               <input
//                 type="text"
//                 name="position"
//                 value={formData.employeeCurrentEmployment.position}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     employeeCurrentEmployment: {
//                       ...prev.employeeCurrentEmployment,
//                       position: e.target.value,
//                     },
//                   }))
//                 }
//                 className={`mt-1 block w-full border ${
//                   validity.validCurrentPosition
//                     ? "border-gray-300"
//                     : "border-red-600"
//                 } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
//                 placeholder="Enter Position"
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor=""  className="formInputLabel">
//                 Join Date{" "}
//                 {!validity.validJoinDate && (
//                   <span className="text-red-600">*</span>
//                 )}
//               </label>
//               <input
//                 type="date"
//                 name="joinDate"
//                 value={
//                   formData.employeeCurrentEmployment.joinDate.split("T")[0]
//                 }
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     employeeCurrentEmployment: {
//                       ...prev.employeeCurrentEmployment,
//                       joinDate: e.target.value,
//                     },
//                   }))
//                 }
//                 className={`mt-1 block w-full border ${
//                   validity.validJoinDate ? "border-gray-300" : "border-red-600"
//                 } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor=""  className="formInputLabel">
//                 Contract Type{" "}
//                 {!validity.validContractType && (
//                   <span className="text-red-600">*</span>
//                 )}
//               </label>
//               <input
//                 type="text"
//                 name="contractType"
//                 value={formData.employeeCurrentEmployment.contractType}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     employeeCurrentEmployment: {
//                       ...prev.employeeCurrentEmployment,
//                       contractType: e.target.value,
//                     },
//                   }))
//                 }
//                 className={`mt-1 block w-full border ${
//                   validity.validContractType
//                     ? "border-gray-300"
//                     : "border-red-600"
//                 } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
//                 placeholder="Enter Contract Type"
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor=""  className="formInputLabel">
//                 Salary Package
//               </label>
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <div>
//                   <label htmlFor=""  className="formInputLabel">
//                     Basic{" "}
//                     {!validity.validBasic && (
//                       <span className="text-red-600">*</span>
//                     )}
//                   </label>
//                   <input
//                     type="number"
//                     name="basic"
//                     value={
//                       formData.employeeCurrentEmployment.salaryPackage.basic
//                     }
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         employeeCurrentEmployment: {
//                           ...prev.employeeCurrentEmployment,
//                           salaryPackage: {
//                             ...prev.employeeCurrentEmployment.salaryPackage,
//                             basic: e.target.value,
//                           },
//                         },
//                       }))
//                     }
//                     className={`mt-1 block w-full border ${
//                       validity.validCity ? "border-gray-300" : "border-red-600"
//                     } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
//                     placeholder="Enter Basic Salary"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor=""  className="formInputLabel">
//                     Payment{" "}
//                     {!validity.validPayment && (
//                       <span className="text-red-600">*</span>
//                     )}
//                   </label>
//                   <input
//                     type="text"
//                     name="payment"
//                     value={
//                       formData.employeeCurrentEmployment.salaryPackage.payment
//                     }
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         employeeCurrentEmployment: {
//                           ...prev.employeeCurrentEmployment,
//                           salaryPackage: {
//                             ...prev.employeeCurrentEmployment.salaryPackage,
//                             payment: e.target.value,
//                           },
//                         },
//                       }))
//                     }
//                     className={`mt-1 block w-full border ${
//                       validity.validPayment
//                         ? "border-gray-300"
//                         : "border-red-600"
//                     } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
//                     placeholder="Enter Salary payment period"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor=""  className="formInputLabel">
//                     CNSS
//                   </label>
//                   <input
//                     type="number"
//                     name="cnss"
//                     value={
//                       formData.employeeCurrentEmployment.salaryPackage.cnss
//                     }
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         employeeCurrentEmployment: {
//                           ...prev.employeeCurrentEmployment,
//                           salaryPackage: {
//                             ...prev.employeeCurrentEmployment.salaryPackage,
//                             cnss: e.target.value,
//                           },
//                         },
//                       }))
//                     }
//                     className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                     placeholder="Enter CNSS"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor=""  className="formInputLabel">
//                     Other
//                   </label>
//                   <input
//                     type="number"
//                     name="other"
//                     value={
//                       formData.employeeCurrentEmployment.salaryPackage.other
//                     }
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         employeeCurrentEmployment: {
//                           ...prev.employeeCurrentEmployment,
//                           salaryPackage: {
//                             ...prev.employeeCurrentEmployment.salaryPackage,
//                             other: e.target.value,
//                           },
//                         },
//                       }))
//                     }
//                     className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                     placeholder="Enter Other Salary"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           {(isAdmin || isManager) && (
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Assign User Roles</h3>

//               <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
//                 <div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {Object.values(ROLES).map((role) => (
//                       <div key={role} className="flex items-center space-x-3">
//                         <input
//                           type="checkbox"
//                           id={`role-${role}`}
//                           checked={formData.userRoles.includes(role)}
//                           onChange={(e) => onuserRolesChanged(e, role)}
//                           className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                         />
//                         <label htmlFor=""
//                           htmlFor={`role-${role}`}
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           {role}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">Notification Work History</h3>
//           {formData.employeeWorkHistory.map((work, index) => (
//             <div
//               key={index}
//               className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2"
//             >
//               {/* Institution */}
//               <div>
//                 <label htmlFor=""  className="formInputLabel">
//                   Institution{" "}
//                   {!work.institution && <span className="text-red-600">*</span>}
//                 </label>
//                 <input
//                   type="text"
//                   name="institution"
//                   value={work.institution}
//                   onChange={(e) =>
//                     handleWorkHistoryChange(
//                       index,
//                       "institution",
//                       e.target.value
//                     )
//                   }
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                   placeholder="Enter Institution"
//                 />
//               </div>

//               {/* From Date */}
//               <div>
//                 <label htmlFor=""  className="formInputLabel">
//                   From Date{" "}
//                   {!work.fromDate && <span className="text-red-600">*</span>}
//                 </label>
//                 <input
//                   type="date"
//                   name="fromDate"
//                   value={work.fromDate}
//                   onChange={(e) =>
//                     handleWorkHistoryChange(index, "fromDate", e.target.value)
//                   }
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 />
//               </div>

//               {/* To Date */}
//               <div>
//                 <label htmlFor=""  className="formInputLabel">
//                   To Date{" "}
//                   {!work.toDate && <span className="text-red-600">*</span>}
//                 </label>
//                 <input
//                   type="date"
//                   name="toDate"
//                   value={work.toDate}
//                   onChange={(e) =>
//                     handleWorkHistoryChange(index, "toDate", e.target.value)
//                   }
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 />
//               </div>

//               {/* Position */}
//               <div>
//                 <label htmlFor=""  className="formInputLabel">
//                   Position{" "}
//                   {!work.position && <span className="text-red-600">*</span>}
//                 </label>
//                 <input
//                   type="text"
//                   name="position"
//                   value={work.position}
//                   onChange={(e) =>
//                     handleWorkHistoryChange(index, "position", e.target.value)
//                   }
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                   placeholder="Enter Position"
//                 />
//               </div>

//               {/* Contract Type */}
//               <div>
//                 <label htmlFor=""  className="formInputLabel">
//                   Contract Type{" "}
//                   {!work.contractType && (
//                     <span className="text-red-600">*</span>
//                   )}
//                 </label>
//                 <input
//                   type="text"
//                   name="contractType"
//                   value={work.contractType}
//                   onChange={(e) =>
//                     handleWorkHistoryChange(
//                       index,
//                       "contractType",
//                       e.target.value
//                     )
//                   }
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                   placeholder="Enter Contract Type"
//                 />
//               </div>

//               {/* Salary Package */}
//               <div>
//                 <label htmlFor=""  className="formInputLabel">
//                   Salary Package
//                 </label>
//                 <input
//                   type="text"
//                   name="salaryPackage"
//                   value={work.salaryPackage}
//                   onChange={(e) =>
//                     handleWorkHistoryChange(
//                       index,
//                       "salaryPackage",
//                       e.target.value
//                     )
//                   }
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                   placeholder="Enter Salary Package"
//                 />
//               </div>

//               {/* Remove Work History Button */}
//               <button
//                 type="button"
//                 onClick={() => handleRemoveWorkHistory(index)}
//                 className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}

//           {/* Add Work History Button */}
//           <button
//             type="button"
//             onClick={handleAddWorkHistory}
//             className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Add Work History
//           </button>
//         </div>

//         {/* Submit Button */}
//         <div className="cancelSavebuttonsDiv">
//           <button
//             type="button"
//             onClick={() => navigate("/hr/employees/employees")}
//             className="cancel-button"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={!canSave || isLoading}
//             className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
//               canSave
//                 ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
//                 : "bg-gray-400 cursor-not-allowed"
//             } focus:outline-none focus:ring-2 focus:ring-offset-2`}
//           >
//             Save
//           </button>
//         </div>
//       </form>
//     </>
//   );
//   return content;
// };

// export default EditNotificationForm;
