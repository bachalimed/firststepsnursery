import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useUpdateInvoiceMutation,
  useGetInvoicesQuery,
} from "./invoicesApiSlice"; // Redux API action

import Finances from "../Finances";
import useAuth from "../../../hooks/useAuth";

import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  NAME_REGEX,
  DATE_REGEX,
  OBJECTID_REGEX,
  YEAR_REGEX,
  NUMBER_REGEX,
  COMMENT_REGEX,
} from "../../../config/REGEX"
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
const EditInvoiceForm = ({ invoice }) => {
  const { userId, isManager } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  // Redux mutation for adding the attended school
  const [
    updateInvoice,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      isSuccess: isUpdateSuccess,
    },
  ] = useUpdateInvoiceMutation();

  const DiscountTypes = ["second Sibling", "Third Sibling", "Other"];
  
  //confirmation Modal states
const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    id: invoice?._id,
    invoiceYear: invoice?.invoiceYear,
    invoiceMonth: invoice?.invoiceMonth,
    invoiceEnrolment: invoice?.invoiceEnrolment,
    invoiceDueDate: invoice?.invoiceDueDate?.split("T")[0],
    invoiceIssueDate: invoice?.invoiceIssueDate?.split("T")[0], //not to be edited
    invoiceIsFullyPaid: invoice?.invoiceIsFullyPaid,
    invoiceAmount: invoice?.invoiceAmount,
    invoiceAuthorisedAmount: invoice?.invoiceAuthorisedAmount,
    invoiceDiscountAmount: invoice?.invoiceDiscountAmount || "",
    invoiceDiscountType: invoice?.invoiceDiscountType || "",
    invoiceDiscountNote: invoice?.invoiceDiscountNote || "",
    invoiceOperator: userId,
  });

  const [validity, setValidity] = useState({
    
    
    validInvoiceDueDate: false,
    
    validInvoiceAmount: false,
    validInvoiceAuthorisedAmount: false,
    validInvoiceDiscountAmount: false,
    validInvoiceDiscountType: false,
    validInvoiceDiscountNote: false,
    
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
     
     
      validInvoiceDueDate: DATE_REGEX.test(formData.invoiceDueDate),
   
      validInvoiceAmount: NUMBER_REGEX.test(formData.invoiceAmount),
      validInvoiceAuthorisedAmount: NUMBER_REGEX.test(
        formData.invoiceAuthorisedAmount
      ),
      validInvoiceDiscountAmount: NUMBER_REGEX.test(
        formData.invoiceDiscountAmount
      ),
      validInvoiceDiscountType:
        NAME_REGEX.test(formData.invoiceDiscountType) ||(
        formData.invoiceDiscountAmount &&
        (formData.invoiceDiscountAmount !== "" ||
          formData.invoiceDiscountAmount !== "0")), // no type saved without an actual amount
      validInvoiceDiscountNote: COMMENT_REGEX.test(
        formData.invoiceDiscountNote
      ),
      
    }));
  }, [formData]);
console.log(validity)


  // Update invoiceAmount dynamically based on authorised and discount amounts
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      invoiceAmount: prev.invoiceAuthorisedAmount - prev.invoiceDiscountAmount,
    }));
  }, [formData.invoiceAuthorisedAmount, formData.invoiceDiscountAmount]);
  // Clear form and errors on success
  // Clear form and navigate on success
  useEffect(() => {
    if (isUpdateSuccess) {
      setFormData({
        id: "",
        invoiceYear: "",
        invoiceMonth: "",
        invoiceEnrolment: "",
        invoiceDueDate: "",
        invoiceIssueDate: "",
        invoiceIsFullyPaid: "",
        invoiceAmount: 0,
        invoiceAuthorisedAmount: 0,
        invoiceDiscountAmount: 0,
        invoiceDiscountType: "",
        invoiceDiscountNote: "",
        invoiceOperator: "",
      });

      navigate("/finances/invoices/invoicesList");
    }
  }, [isUpdateSuccess, navigate]);

  // Check if all fields are valid and enable the submit button
  const canSubmit = Object.values(validity).every(Boolean) && !isUpdateLoading;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are valid
    if (canSubmit) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);
    try {
      const updatedInvoice = await updateInvoice(formData).unwrap();
    } catch (err) {
      //setError("Failed to add the attended school.");
    }
  };
 // Close the modal without saving
 const handleCloseModal = () => {
  setShowConfirmation(false);
};
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  console.log(formData, "formdata");

  return (
    <>
      <Finances />
      <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Edit Invoice:{" "}
          <div>
            {invoice?.enrolments[0]?.student?.studentName?.firstName}{" "}
            {invoice?.enrolments[0]?.student?.studentName?.middleName}{" "}
            {invoice?.enrolments[0]?.student?.studentName?.lastName}{" "}
          </div>
          <div>
            {invoice?.enrolments[0]?.servicePeriod}{" "}
            {invoice?.enrolments[0]?.serviceType}{" "}
          </div>
          <div>
            {formData.invoiceMonth}-{formData.invoiceYear}{" "}
          </div>
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Authorised Amount: {formData.invoiceAuthorisedAmount}
            </label>
            {/* <input
              type="number"
              name="invoiceAuthorisedAmount"
              value={formData.invoiceAuthorisedAmount}
              onChange={handleChange}
              disabled
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            /> */}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Invoice Amount : {formData.invoiceAmount}
            </label>
            {/* <input
              type="number"
              name="invoiceAmount"
              value={formData.invoiceAmount}
              disabled
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            /> */}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Discount Type
            </label>
            <select
              name="invoiceDiscountType"
              value={formData.invoiceDiscountType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            >
              <option value="">No additional discount</option>
              {DiscountTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {formData?.invoiceDiscountType && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Discount Amount
              </label>
              <input
                type="number"
                name="invoiceDiscountAmount"
                value={formData.invoiceDiscountAmount}
                onChange={handleChange}
                placeholder="Enter discount amount"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
              />
            </div>
          )}

          {formData.invoiceDiscountAmount !== "0" && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Discount Note
              </label>
              <input
                type="text"
                name="invoiceDiscountNote"
                value={formData.invoiceDiscountNote}
                onChange={handleChange}
                placeholder="Optional note"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
                required={formData.invoiceDiscountAmount}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Due Date{" "}
              {!validity.validInvoiceDueDate && <span className="text-red-600">*</span>}
            </label>
            <input
              type="date"
              name="invoiceDueDate"
              value={formData.invoiceDueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Is Fully Paid
            </label>
            <input
              type="checkbox"
              name="invoiceIsFullyPaid"
              checked={formData.invoiceIsFullyPaid}
              onChange={handleCheckboxChange}
              className="form-checkbox"
              disabled={!isManager}
            />
          </div>

          <div className="flex justify-end gap-4">
          <button
            type="button"
            
            className="cancel-button"
            onClick={() =>
              navigate("/academics/plannings/animatorsAssignments/")
            }
          >
            Cancel
          </button>
            <button
              type="submit"
              disabled={!canSubmit||isUpdateLoading}
              className={` py-2 px-4 font-bold text-white rounded-md focus:outline-none ${
                canSubmit
                  ? "bg-sky-700 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isUpdateLoading ? "Saving..." : "Update Invoice"}
            </button>
          </div>

          {isUpdateError && (
            <p className="text-red-600 text-center mt-4">
              {updateError?.data?.message || "Error updating the invoice"}
            </p>
          )}
        </form>
      </div>
        {/* Confirmation Modal */}
        <ConfirmationModal
        show={showConfirmation}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSave}
        title="Confirm Save"
        message="Are you sure you want to save?"
      />
    </>
  );
};

export default EditInvoiceForm;
