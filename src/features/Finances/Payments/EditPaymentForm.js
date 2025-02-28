// import { useState, useEffect } from "react";

// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   useUpdatePaymentMutation,

// } from "./paymentsApiSlice"; // Redux API action


// import Finances from "../Finances";
// import useAuth from "../../../hooks/useAuth";

// import {
//   selectCurrentAcademicYearId,
//   selectAcademicYearById,
//   selectAllAcademicYears,
// } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
// import {
//   NAME_REGEX,
//   DATE_REGEX,
//   OBJECTID_REGEX,
//   YEAR_REGEX,
//   NUMBER_REGEX,
//   COMMENT_REGEX,
// } from "../../../config/REGEX";
// import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
// const EditPaymentForm = ({ payment }) => {
//   const { userId, isManager } = useAuth();
//   const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
//   const selectedAcademicYear = useSelector((state) =>
//     selectAcademicYearById(state, selectedAcademicYearId)
//   ); // Get the full academic year object
//   const academicYears = useSelector(selectAllAcademicYears);

//   // Redux mutation for adding the attended school
//   const [
//     updatePayment,
//     {
//       isLoading: isUpdateLoading,
//       isError: isUpdateError,
//       error: updateError,
//       isSuccess: isUpdateSuccess,
//     },
//   ] = useUpdatePaymentMutation();

//   const DiscountTypes = ["second Sibling", "Third Sibling", "Other"];
//   console.log(payment, "payment");
//   const [formData, setFormData] = useState({
//     id: payment?._id,
//     paymentYear: payment?.paymentYear,
//     paymentMonth: payment?.paymentMonth,
//     paymentEnrolment: payment?.paymentEnrolment,
//     paymentDueDate: payment?.paymentDueDate?.split("T")[0],
//     paymentIssueDate: payment?.paymentIssueDate?.split("T")[0], //not to be edited
//     paymentIsFullyPaid: payment?.paymentIsFullyPaid,
//     paymentAmount: payment?.paymentAmount,
//     paymentAuthorisedAmount: payment?.paymentAuthorisedAmount,
//     paymentDiscountAmount: payment?.paymentDiscountAmount || "",
//     paymentDiscountType: payment?.paymentDiscountType || "",
//     paymentDiscountNote: payment?.paymentDiscountNote || "",
//     paymentOperator: userId,
//   });

//   const [validity, setValidity] = useState({
//     validPaymentDueDate: false,

//     validPaymentAmount: false,
//     validPaymentAuthorisedAmount: false,
//     validPaymentDiscountAmount: false,
//     validPaymentDiscountType: false,
//     validPaymentDiscountNote: false,
//   });

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   //confirmation Modal states
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   // Validate inputs using regex patterns
//   useEffect(() => {
//     setValidity((prev) => ({
//       ...prev,

//       validPaymentDueDate: DATE_REGEX.test(formData.paymentDueDate),

//       validPaymentAmount: NUMBER_REGEX.test(formData.paymentAmount),
//       validPaymentAuthorisedAmount: NUMBER_REGEX.test(
//         formData.paymentAuthorisedAmount
//       ),
//       validPaymentDiscountAmount: NUMBER_REGEX.test(
//         formData.paymentDiscountAmount
//       ),
//       validPaymentDiscountType:
//         NAME_REGEX.test(formData.paymentDiscountType) ||
//         (formData.paymentDiscountAmount &&
//           (formData.paymentDiscountAmount !== "" ||
//             formData.paymentDiscountAmount !== "0")), // no type saved without an actual amount
//       validPaymentDiscountNote: COMMENT_REGEX.test(
//         formData.paymentDiscountNote
//       ),
//     }));
//   }, [formData]);
//   console.log(validity);

//   // Update paymentAmount dynamically based on authorised and discount amounts
//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       paymentAmount: prev.paymentAuthorisedAmount - prev.paymentDiscountAmount,
//     }));
//   }, [formData.paymentAuthorisedAmount, formData.paymentDiscountAmount]);
//   // Clear form and errors on success
//   // Clear form and navigate on success
//   useEffect(() => {
//     if (isUpdateSuccess) {
//       setFormData({
//         id: "",
//         paymentYear: "",
//         paymentMonth: "",
//         paymentEnrolment: "",
//         paymentDueDate: "",
//         paymentIssueDate: "",
//         paymentIsFullyPaid: "",
//         paymentAmount: 0,
//         paymentAuthorisedAmount: 0,
//         paymentDiscountAmount: 0,
//         paymentDiscountType: "",
//         paymentDiscountNote: "",
//         paymentOperator: "",
//       });

//       navigate("/finances/payments/paymentsList");
//     }
//   }, [isUpdateSuccess, navigate]);

//   // Check if all fields are valid and enable the submit button
//   const canSubmit = Object.values(validity).every(Boolean) && !isUpdateLoading;

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Ensure all fields are valid
//     if (canSubmit) {
//       setShowConfirmation(true);
//     }
//   };

//   const handleConfirmSave = async () => {
//     // Close the confirmation modal
//     setShowConfirmation(false);

//     try {
//       const updatedPayment = await updatePayment(formData).unwrap();
//     } catch (err) {
//       //setError("Failed to add the attended school.");
//     }
//   };
//   // Close the modal without saving
//   const handleCloseModal = () => {
//     setShowConfirmation(false);
//   };
//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle checkbox change
//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: checked,
//     }));
//   };

//   console.log(formData, "formdata");

//   return (
//     <>
//       <Finances />

//       <form onSubmit={handleSubmit} className="form-container">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           Edit Payment:{" "}
//           <div>
//             {payment?.enrolments[0]?.student?.studentName?.firstName}{" "}
//             {payment?.enrolments[0]?.student?.studentName?.middleName}{" "}
//             {payment?.enrolments[0]?.student?.studentName?.lastName}{" "}
//           </div>
//           <div>
//             {payment?.enrolments[0]?.servicePeriod}{" "}
//             {payment?.enrolments[0]?.serviceType}{" "}
//           </div>
//           <div>
//             {formData.paymentMonth}-{formData.paymentYear}{" "}
//           </div>
//         </h2>
//         <div className="mb-4">
//           <label htmlFor=""  className="formInputLabel">
//             Authorised Amount: {formData.paymentAuthorisedAmount}
//           </label>
//           {/* <input
//               type="number"
//               name="paymentAuthorisedAmount"
//               value={formData.paymentAuthorisedAmount}
//               onChange={handleChange}
//               disabled
//               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
//             /> */}
//         </div>
//         <div className="mb-4">
//           <label htmlFor=""  className="formInputLabel">
//             Payment Amount : {formData.paymentAmount}
//           </label>
//           {/* <input
//               type="number"
//               name="paymentAmount"
//               value={formData.paymentAmount}
//               disabled
//               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
//             /> */}
//         </div>

//         <div className="mb-4">
//           <label htmlFor=""  className="formInputLabel">
//             Discount Type
//           </label>
//           <select
//             name="paymentDiscountType"
//             value={formData.paymentDiscountType}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
//           >
//             <option value="">No additional discount</option>
//             {DiscountTypes.map((type, index) => (
//               <option key={index} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//         </div>

//         {formData?.paymentDiscountType && (
//           <div className="mb-4">
//             <label htmlFor=""  className="formInputLabel">
//               Discount Amount
//             </label>
//             <input
//               type="number"
//               name="paymentDiscountAmount"
//               value={formData.paymentDiscountAmount}
//               onChange={handleChange}
//               placeholder="Enter discount amount"
//               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
//             />
//           </div>
//         )}

//         {formData.paymentDiscountAmount !== "0" && (
//           <div className="mb-4">
//             <label htmlFor=""  className="formInputLabel">
//               Discount Note
//             </label>
//             <input
//               type="text"
//               name="paymentDiscountNote"
//               value={formData.paymentDiscountNote}
//               onChange={handleChange}
//               placeholder="Optional note"
//               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
//               required={formData.paymentDiscountAmount}
//             />
//           </div>
//         )}

//         <div className="mb-4">
//           <label htmlFor=""  className="formInputLabel">
//             Due Date{" "}
//             {!validity.validPaymentDueDate && (
//               <span className="text-red-600">*</span>
//             )}
//           </label>
//           <input
//             type="date"
//             name="paymentDueDate"
//             value={formData.paymentDueDate}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor=""  className="formInputLabel">
//             Is Fully Paid
//           </label>
//           <input
//             type="checkbox"
//             name="paymentIsFullyPaid"
//             checked={formData.paymentIsFullyPaid}
//             onChange={handleCheckboxChange}
//             className="form-checkbox"
//             disabled={!isManager}
//           />
//         </div>

//         <div className="cancelSavebuttonsDiv">
//           <button
//             type="button"
//             className="cancel-button"
//             onClick={() => navigate("/finances/payments/paymentsList/")}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={!canSubmit || isUpdateLoading}
//             className={`w-full py-2 px-4 font-bold text-white rounded-md focus:outline-none ${
//               canSubmit
//                 ? "bg-sky-700 hover:bg-blue-700"
//                 : "bg-gray-400 cursor-not-allowed"
//             }`}
//           >
//             {isUpdateLoading ? "Saving..." : "Update Payment"}
//           </button>
//         </div>

//         {isUpdateError && (
//           <p className="text-red-600 text-center mt-4">
//             {updateError?.data?.message || "Error updating the payment"}
//           </p>
//         )}
//       </form>
//     </>
//   );
// };

// export default EditPaymentForm;
