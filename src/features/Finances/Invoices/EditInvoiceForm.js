import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateInvoiceMutation } from "./invoicesApiSlice"; // Redux API action
import { useOutletContext } from "react-router-dom";
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
} from "../../../config/REGEX";
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
        formData?.invoiceAuthorisedAmount
      ),
      validInvoiceDiscountAmount:
        formData?.invoiceDiscountAmount === "" ||
        formData?.invoiceDiscountAmount === 0 ||
        formData?.invoiceDiscountAmount === "0" ||
        NUMBER_REGEX.test(formData?.invoiceDiscountAmount),

      validInvoiceDiscountType:
        formData?.invoiceDiscountAmount === "" ||
        formData?.invoiceDiscountAmount === "0" ||
        formData?.invoiceDiscountAmount === 0
          ? formData?.invoiceDiscountType === ""
          : formData?.invoiceDiscountType !== "",
      // no type saved without an actual amount
      validInvoiceDiscountNote: COMMENT_REGEX.test(
        formData?.invoiceDiscountNote
      ),
    }));
  }, [formData]);
  console.log(validity);

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
  const { triggerBanner } = useOutletContext(); // Access banner trigger
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
  console.log(validity, "validity");
  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);
    try {
      const response = await updateInvoice(formData).unwrap();
      console.log(response, "response");
      if ((response.data && response.data.message) || response?.message) {
        // Success response
        triggerBanner(response?.data?.message || response?.message, "success");
      } else if (
        response?.error &&
        response?.error?.data &&
        response?.error?.data?.message
      ) {
        // Error response
        triggerBanner(response.error.data.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner("Failed to update classroom. Please try again.", "error");

      console.error("Error saving:", error);
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

      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="formTitle ">
          Edit Invoice for{" "}
          {invoice?.enrolments[0]?.student?.studentName?.firstName}{" "}
          {invoice?.enrolments[0]?.student?.studentName?.middleName}{" "}
          {invoice?.enrolments[0]?.student?.studentName?.lastName}{" "}
        </h2>
        <div className="formSectionContainer">
          <h3 className="formSectionTitle">
            {formData.invoiceMonth}-{formData.invoiceYear}{" "}
          </h3>
          <h3 className="formSectionTitle">
            {invoice?.enrolments[0]?.servicePeriod}{" "}
            {invoice?.enrolments[0]?.serviceType}{" "}
          </h3>
          <h3 className="formSectionTitle">Discount Details</h3>
          <div className="formSection">
            <div className="formLineDiv">
              <label
                htmlFor="authorisedAmount"
                aria-label="authorised amount"
                className="block text-gray-700"
              >
                Authorised Amount:
                <input
                  id="authorisedAmount"
                  name="authorisedAmount"
                  type="text"
                  value={formData.invoiceAuthorisedAmount}
                  disabled
                  className="formInputText"
                />
              </label>

              <label
                htmlFor="invoiceAmount"
                className="block text-gray-700  mb-4"
              >
                Invoice Amount :
                <input
                  id="invoiceAmount"
                  name="invoiceAmount"
                  type="text"
                  value={formData.invoiceAmount}
                  disabled
                  className="formInputText"
                />
              </label>
            </div>
            <div className="formLineDiv">
              <label htmlFor="invoiceDiscountAmount" className="formInputLabel">
                Discount Amount
                {!validity.validInvoiceDiscountAmount && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-invalid={!validity.validInvoiceDiscountAmount}
                  type="number"
                  id="invoiceDiscountAmount"
                  name="invoiceDiscountAmount"
                  value={formData.invoiceDiscountAmount}
                  onChange={handleChange}
                  placeholder="[$$$.$$$]"
                  className="formInputText"
                />{" "}
              </label>
              {/* {formData.invoiceDiscountAmount !== "0" && ( */}
              <label htmlFor="invoiceDiscountType" className="formInputLabel">
                Discount Type{" "}
                {!validity.validInvoiceDiscountType && (
                  <span className="text-red-600">*</span>
                )}
                <select
                  aria-label="classroom capacity"
                  placeholder="[1-2 digits]"
                  id="invoiceDiscountType"
                  name="invoiceDiscountType"
                  value={formData.invoiceDiscountType}
                  onChange={handleChange}
                  className="formInputText"
                >
                  <option value="">No discount</option>
                  {DiscountTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>{" "}
              </label>
              {/* )} */}
            </div>

            {(formData.invoiceDiscountAmount !== "")  && (
              <label htmlFor="invoiceDiscountNote" className="formInputLabel">
                Discount Note
                <textarea
                  type="text"
                  id="invoiceDiscountNote"
                  name="invoiceDiscountNote"
                  value={formData.invoiceDiscountNote}
                  onChange={handleChange}
                  placeholder="[1-150 characters]"
                  className="formInputText"
                  required={formData.invoiceDiscountAmount}
                ></textarea>
              </label>
            )}
          </div>
        </div>
        <h3 className="formSectionTitle">Invoice Dates</h3>
        <div className="formSection">
          <label htmlFor="invoiceDueDate" className="formInputLabel">
            Due Date{" "}
            {!validity.validInvoiceDueDate && (
              <span className="text-red-600">*</span>
            )}
            <input
              type="date"
              id="invoiceDueDate"
              name="invoiceDueDate"
              value={formData.invoiceDueDate}
              onChange={handleChange}
              className="formInputText"
            />{" "}
          </label>

          <label htmlFor="invoiceIsFullyPaid" className="formInputLabel">
            <input
              type="checkbox"
              id="invoiceIsFullyPaid"
              name="invoiceIsFullyPaid"
              checked={formData.invoiceIsFullyPaid}
              onChange={handleCheckboxChange}
              className="formCheckbox"
              disabled={!isManager}
            />
            Is Fully Paid
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            aria-label="cancel edit invoice"
            className="cancel-button"
            onClick={() => navigate("/finances/invoices/invoicesList/")}
          >
            Cancel
          </button>
          <button
            aria-label="sumbit invoice"
            type="submit"
            disabled={!canSubmit || isUpdateLoading}
            className="save-button"
          >
            save
          </button>
        </div>

        {isUpdateError && (
          <p className="text-red-600 text-center mt-4">
            {updateError?.data?.message || "Error updating the invoice"}
          </p>
        )}
      </form>

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
