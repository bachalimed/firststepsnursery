// import { useState, useEffect } from "react";
// import { useOutletContext } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   useAddNewInvoiceMutation,
//   useGetInvoicesQuery,
// } from "./invoicesApiSlice"; // Redux API action

// import Finances from "../Finances";
// import useAuth from "../../../hooks/useAuth";
// import { useGetAttendedSchoolsQuery } from "../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
// import { useGetEnrolmentsByYearQuery } from "../../Students/Enrolments/enrolmentsApiSlice";
// import {
//   selectCurrentAcademicYearId,
//   selectAcademicYearById,
//   selectAllAcademicYears,
// } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
// import {
//   NAME_REGEX,
//   DATE_REGEX,
//   OBJECTID_REGEX,
//   NUMBER_REGEX,
// } from "../../../config/REGEX"

// import { MONTHS } from "../../../config/Months";
// import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
// const NewInvoiceForm = () => {
//   const { userId } = useAuth();
//   const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
//   const selectedAcademicYear = useSelector((state) =>
//     selectAcademicYearById(state, selectedAcademicYearId)
//   ); // Get the full academic year object
//   const academicYears = useSelector(selectAllAcademicYears);

//   //function to return curent month for month selection
//   const getCurrentMonth = () => {
//     const currentMonthIndex = new Date().getMonth(); // Get current month (0-11)
//     return MONTHS[currentMonthIndex]; // Return the month name with the first letter capitalized
//   };

//   const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
//   const {
//     data: enrolment, //the data is renamed enrolment
//     isLoading: isEnrolmentLoading, 
//     isSuccess: isEnrolmentSuccess,
//     isError: isEnrolmentError,
//     error: enrolmentError,
//   } = useGetEnrolmentsByYearQuery(
//     {
//       selectedMonth: selectedMonth,
//       selectedYear: selectedAcademicYear?.title,
//       endpointName: "NewInvoiceForm",
//     } || {},
//     {
     
//       refetchOnFocus: true, 
//       refetchOnMountOrArgChange: true,
//     }
//   );

//   const [formData, setFormData] = useState({
//     invoiceYear: selectedAcademicYear?.title || "",
//     invoiceMonth: getCurrentMonth(),
//     invoiceEnrolments: [
//       {
//         invoiceDueDate: "",
//         invoiceAmount: "",
//         invoiceDiscountAmount: "",
//         invoiceStudent: "",
//       },
//     ],
//     invoiceIssueDate: "",
//     invoiceCreator: userId,
//     invoiceOperator: userId,
//   });
// //confirmation Modal states
// const [showConfirmation, setShowConfirmation] = useState(false);
//   //let schoolsList = isSchoolSuccess ? Object.values(schools.entities) : [];
//   const { triggerBanner } = useOutletContext(); // Access banner trigger
//   let enrolmentList = [];

//   if (isEnrolmentSuccess) {
//     const { entities } = enrolment;
//     enrolmentList = Object.values(entities);
//   }

//   const [validity, setValidity] = useState({
//     validInvoiceYear: false,
//     validInvoiceMonth: false,
//     //validInvoiceEnrolments: false,
//     validAssignedFrom: false,
//     validAssignedTo: false,
//     validInvoiceDueDate: "",
//     validInvoiceIssueDate: "",
//     validInvoiceAmount: "",
//     validInvoiceDiscountAmount: "",
//     validInvoiceCreator: userId,
//     validInvoiceOperator: userId,
//   });

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Redux mutation for adding the attended school
//   const [
//     addNewInvoice,
//     {
//       isLoading: isAddLoading,
//       isError: isAddError,
//       error: addError,
//       isSuccess: isAddSuccess,
//     },
//   ] = useAddNewInvoiceMutation();

//   // Validate inputs using regex patterns
//   useEffect(() => {
//     setValidity((prev) => ({
//       ...prev,
//       validInvoiceYear: DATE_REGEX.test(formData?.invoiceYear),
//       validInvoiceMonth: NAME_REGEX.test(formData?.invoiceMonth),
//       // validInvoiceEnrolments: formData?.invoiceEnrolments?.length > 0,
//       //validInvoiceDueDate: DATE_REGEX.test(formData?.invoiceDueDate),
//       validInvoiceIssueDate: DATE_REGEX.test(formData?.invoiceIssueDate),
//       // validInvoiceAmount: NUMBER_REGEX.test(formData?.invoiceAmount),
//       // validInvoiceDiscountAmount: NUMBER_REGEX.test(formData?.invoiceDiscountAmount ),
//       validInvoiceCreator: OBJECTID_REGEX.test(formData?.invoiceCreator),
//       validInvoiceOperator: OBJECTID_REGEX.test(formData?.invoiceOperator),
//     }));
//   }, [formData]);

//   // Clear form and errors on success
//   useEffect(() => {
//     if (isAddSuccess) {
//       setFormData({
//         invoiceYear: "",
//         invoiceMonth: "",
//         invoiceEnrolments: [],
//         invoiceIssueDate: "",
//         invoiceIsFullyPaid: false,
//         invoiceCreator: "",
//         invoiceOperator: "",
//       });

//       navigate("/finances/invoices/invoicesList");
//     }
//   }, [isAddSuccess, navigate]);

//   // Check if all fields are valid and enable the submit button
//   const canSubmit = Object.values(validity).every(Boolean) && !isAddLoading;

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Ensure all fields are valid
//     if (canSubmit) {
//       setShowConfirmation(true);
//     }
//   };
//  // This function handles the confirmed save action
//  const handleConfirmSave = async () => {
//   // Close the confirmation modal
//   setShowConfirmation(false);
//   try {
//     const response =await addNewInvoice(formData).unwrap();
//     if (response.data && response.data.message) {
//       // Success response
//       triggerBanner(response.data.message, "success");

//     } else if (response?.error && response?.error?.data && response?.error?.data?.message) {
//       // Error response
//       triggerBanner(response.error.data.message, "error");
//     } else {
//       // In case of unexpected response format
//       triggerBanner("Unexpected response from server.", "error");
//     }
//   } catch (error) {
//     triggerBanner("Failed to create invoice. Please try again.", "error");

//     console.error("Error creating invoice:", error);
//   }
// };
// // Close the modal without saving
// const handleCloseModal = () => {
//   setShowConfirmation(false);
// };
//   // Handler for changing input values
//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handler for changing enrolment fields
//   const handleEnrolmentChange = (index, event) => {
//     const { name, value } = event.target;
//     const updatedEnrolments = formData.invoiceEnrolments.map((enrolment, idx) =>
//       idx === index ? { ...enrolment, [name]: value } : enrolment
//     );
//     setFormData({ ...formData, invoiceEnrolments: updatedEnrolments });
//   };

//   // Add new enrolment field set
//   const handleAddEnrolment = () => {
//     setFormData({
//       ...formData,
//       invoiceEnrolments: [
//         ...formData.invoiceEnrolments,
//         {
//           invoiceDueDate: "",
//           invoiceAmount: "",
//           invoiceDiscountAmount: "",
//           invoiceStudent: "",
//         },
//       ],
//     });
//   };

//   // Remove enrolment field set
//   const handleRemoveEnrolment = (index) => {
//     const updatedEnrolments = formData.invoiceEnrolments.filter(
//       (_, idx) => idx !== index
//     );
//     setFormData({ ...formData, invoiceEnrolments: updatedEnrolments });
//   };

//   console.log(formData, "formdata");

//   return (
//     <>
//       <Finances />
//       <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
//         <h2 className="text-2xl font-bold mb-6 text-center">Add Invoices</h2>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor=""  className="formInputLabel">
//               Invoice Year{" "}
//               {!validity.validInvoiceYear && (
//                 <span className="text-red-600">*</span>
//               )}
           
//             <input
//               type="text"
//               name="invoiceYear"
//               value={formData.invoiceYear}
//               readOnly
//               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
//             /> </label>
//           </div>
//           <div className="mb-4">
//           <select
//             value={formData.invoiceMonth}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
//           >
//             {/* Default option is the current month */}
//             <option value={getCurrentMonth()}>{getCurrentMonth()}</option>

//             {/* Render the rest of the months, excluding the current month */}
//             {MONTHS.map(
//               (month, index) =>
//                 month !== getCurrentMonth() && (
//                   <option key={index} value={month}>
//                     {month}
//                   </option>
//                 )
//             )}
//           </select>
//           </div>

//           <div className="mb-4">
//             <label htmlFor="">Invoice Issue Date:</label>
//             <input
//               type="date"
//               name="invoiceIssueDate"
//               value={formData.invoiceIssueDate}
//               onChange={handleInputChange}
//             />
//           </div>

//           {formData.invoiceEnrolments.map((enrolment, index) => (
//             <div key={index} className="enrolment-section">
//               <h3>Invoice Enrolment {index + 1}</h3>

//               <div>
//                 <label htmlFor="">Invoice Due Date:</label>
//                 <input
//                   type="date"
//                   name="invoiceDueDate"
//                   value={enrolment.invoiceDueDate}
//                   onChange={(event) => handleEnrolmentChange(index, event)}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="">Invoice Amount:</label>
//                 <input
//                   type="number"
//                   name="invoiceAmount"
//                   value={enrolment.invoiceAmount}
//                   onChange={(event) => handleEnrolmentChange(index, event)}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="">Invoice Discount Amount:</label>
//                 <input
//                   type="number"
//                   name="invoiceDiscountAmount"
//                   value={enrolment.invoiceDiscountAmount}
//                   onChange={(event) => handleEnrolmentChange(index, event)}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="">Invoice Student:</label>
//                 <input
//                   type="text"
//                   name="invoiceStudent"
//                   value={enrolment.invoiceStudent}
//                   onChange={(event) => handleEnrolmentChange(index, event)}
//                 />
//               </div>

//               <button
//                 type="button"
//                 onClick={() => handleRemoveEnrolment(index)}
//               >
//                 Remove Enrolment
//               </button>
//             </div>
//           ))}

//           <button type="button" onClick={handleAddEnrolment}>
//             Add Enrolment
//           </button>

//           <div>
//             <button type="submit">Submit</button>
//           </div>
//         </form>
//       </div>
//        {/* Confirmation Modal */}
//        <ConfirmationModal
//         show={showConfirmation}
//         onClose={handleCloseModal}
//         onConfirm={handleConfirmSave}
//         title="Confirm Save"
//         message="Are you sure you want to save?"
//       />
//     </>
//   );
// };

// export default NewInvoiceForm;
