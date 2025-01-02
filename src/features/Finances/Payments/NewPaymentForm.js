import { useState, useEffect } from "react";
import { useNavigate ,useOutletContext} from "react-router-dom";
import {  useSelector } from "react-redux";
import { useAddNewPaymentMutation } from "./paymentsApiSlice"; // Redux API action
import { CurrencySymbol } from "../../../config/Currency";
import Finances from "../Finances";
import useAuth from "../../../hooks/useAuth";
import { useGetEnrolmentsByYearQuery } from "../../Students/Enrolments/enrolmentsApiSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  NAME_REGEX,
  SHORTCOMMENT_REGEX,
  DATE_REGEX,
  YEAR_REGEX,
  OBJECTID_REGEX,
  NUMBER_REGEX,
  COMMENT_REGEX,
} from "../../../config/REGEX";

import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";

const NewPaymentForm = () => {
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  // const academicYears = useSelector(selectAllAcademicYears);
  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const PaymentTypes = ["Cash", "Cheque", "Bank Transfer", "Online Payment"];

  const {
    data: studentsEnrolments, //the enrolments are retirved and transformed as students with arrays of enrolments
    isLoading: isEnrolmentsLoading,
    isSuccess: isEnrolmentsSuccess,
    // isError: isEnrolmentsError,
    // error: enrolmentsError,
  } = useGetEnrolmentsByYearQuery(
    {
      criteria: "UnpaidInvoices",
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewPaymentForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    paymentYear: selectedAcademicYear?.title,
    paymentAmount: "",
    paymentStudent: "",
    paymentInvoices: [], // can pay once for many invoices
    paymentNote: "",
    paymentType: "",
    paymentReference: "",
    paymentDate: "",
    paymentRecordDate: "",
    paymentCreator: userId,
    paymentOperator: userId,
  });

  //let schoolsList = isSchoolSuccess ? Object.values(schools.entities) : [];

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [validity, setValidity] = useState({
    validPaymentYear: false,
    validPaymentAmount: false,
    validPaymentStudent: false,
    validPaymentInvoices: false, // can pay once for many invoices
    validPaymentNote: false,
    validPaymentType: false,
    validPaymentReference: false,
    validPaymentDate: false,
  });
  // console.log(validity);
  const navigate = useNavigate();

  // Redux mutation for adding the attended school
  const [
    addNewPayment,
    {
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      error: addError,
    },
  ] = useAddNewPaymentMutation();

  let studentsEnrolmentsList = [];

  if (isEnrolmentsSuccess) {
    const { entities } = studentsEnrolments;
    studentsEnrolmentsList = Object.values(entities);
    // console.log(studentsEnrolmentsList, "studentsEnrolmentsList");
  }

  useEffect(() => {
    const isAmountValid = NUMBER_REGEX.test(formData.paymentAmount);
    const isAmountWithinLimit =
      parseFloat(formData.paymentAmount) === totalInvoiceAmount;
    setValidity((prev) => ({
      ...prev,
      validPaymentYear: YEAR_REGEX.test(formData.paymentYear),
      validPaymentAmount: isAmountValid && isAmountWithinLimit,
      validPaymentStudent: OBJECTID_REGEX.test(formData.paymentStudent),
      validPaymentInvoices: formData?.paymentInvoices?.length > 0,
      validPaymentNote: COMMENT_REGEX.test(formData?.paymentNote),
      validPaymentType: NAME_REGEX.test(formData?.paymentType),
      validPaymentReference:
        formData?.paymentReference === "" ||
        SHORTCOMMENT_REGEX.test(formData?.paymentReference),
      validPaymentDate: DATE_REGEX.test(formData?.paymentDate),
    }));
    // console.log(validity);
  }, [formData, totalInvoiceAmount]);

  // Clear form and errors on success
  useEffect(() => {
    if (isAddSuccess) {
      setFormData({
        paymentYear: selectedAcademicYear?.title || "",
        paymentAmount: "",
        paymentStudent: "",
        paymentInvoices: [],
        paymentNote: "",
        paymentType: "",
        paymentReference: "",
        paymentDate: "",
        paymentRecordDate: new Date().toISOString().split("T")[0],
        paymentCreator: userId,
        paymentOperator: userId,
      });
      setSelectedStudent(null);
      setSelectedInvoices([]);
      setTotalInvoiceAmount(0);

      navigate("/finances/payments/paymentsList");
    }
  }, [isAddSuccess, navigate]);

  // Check if all fields are valid and enable the submit button
  const canSubmit = Object.values(validity).every(Boolean) && !isAddLoading;
  // console.log(validity);
  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSubmit) {
      setShowConfirmation(true);
    }
  };

  // This function handles the confirmed save action
  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);
    try {
      const response = await addNewPayment(formData).unwrap();
      if (response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      } else if (response?.data?.message) {
        // Success response
        triggerBanner(response?.data?.message, "success");
      } else if (response?.error?.data?.message) {
        // Error response
        triggerBanner(response?.error?.data?.message, "error");
      } else if (isAddError) {
        // In case of unexpected response format
        triggerBanner(addError?.data?.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner(error?.data?.message, "error");
    }
  };
  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  const handleStudentChange = (e) => {
    const selectedStudentId = e.target.value;
    const student = studentsEnrolmentsList.find(
      (s) => s.id === selectedStudentId
    );
    setSelectedStudent(student);
    setFormData({
      ...formData,
      paymentStudent: selectedStudentId,
      paymentInvoices: [],
    });
    setSelectedInvoices([]);
    setTotalInvoiceAmount(0);
  };

  const handleInvoiceClick = (invoice) => {
    // Check if the invoice is already selected
    if (
      selectedInvoices.some(
        (selectedInvoice) => selectedInvoice._id === invoice._id
      )
    ) {
      // Remove the invoice from the selected list and update total
      const newSelectedInvoices = selectedInvoices.filter(
        (selectedInvoice) => selectedInvoice._id !== invoice._id
      );
      const newTotal = selectedInvoices.reduce((total, selectedInvoice) => {
        if (selectedInvoice._id !== invoice._id) {
          return total + parseFloat(selectedInvoice.invoiceAmount);
        }
        return total;
      }, 0);

      setSelectedInvoices(newSelectedInvoices);
      setFormData({
        ...formData,
        paymentInvoices: formData.paymentInvoices.filter(
          (id) => id !== invoice._id
        ),
      });
      setTotalInvoiceAmount(newTotal);
    } else {
      // Add the invoice to the selected list and update total
      const newSelectedInvoices = [...selectedInvoices, invoice];
      const newTotal =
        selectedInvoices.reduce(
          (total, selectedInvoice) =>
            total + parseFloat(selectedInvoice.invoiceAmount),
          0
        ) + parseFloat(invoice.invoiceAmount);

      setSelectedInvoices(newSelectedInvoices);
      setFormData({
        ...formData,
        paymentInvoices: [...formData.paymentInvoices, invoice._id],
      });
      setTotalInvoiceAmount(newTotal);
    }
  };



  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // console.log(formData, "formdata");

  let content;
  if (isEnrolmentsLoading) {
    content = (
      <>
        <Finances />
        <LoadingStateIcon />
      </>
    );
  }
  if (isEnrolmentsSuccess) {
    content = (
      <>
        <Finances />

        <form onSubmit={handleSubmit} className="form-container">
          <h2 className="formTitle ">
            Add Payment {selectedAcademicYear?.title}
          </h2>
          {/* Student Selection */}
          <div className="formSectionContainer">
            <h3 className="formSectionTitle">Invoices</h3>
            <div className="formSection">
              <label htmlFor="selectedStudent" className="formInputLabel">
                Select Student{" "}
                {!validity.validPaymentStudent && (
                  <span className="text-red-600">*</span>
                )}
                <select
                  aria-invalid={!validity.validPaymentStudent}
                  required
                  id="selectedStudent"
                  value={selectedStudent?.id || ""}
                  onChange={handleStudentChange}
                  className={`formInputText`}
                >
                  <option value="">Select a Student</option>
                  {studentsEnrolmentsList.map((student) => (
                    <option key={student?.id} value={student?.id}>
                      {`${student?.studentName?.firstName} ${student?.studentName?.middleName} ${student?.studentName?.lastName}`}
                    </option>
                  ))}
                </select>
              </label>

              {/* Invoices List */}
              {selectedStudent && (
                <h3 className="formSectionTitle">Select Invoices</h3>
              )}
              {selectedStudent && (
                <div className="formInputLabel">
                  Invoices{" "}
                  {!validity.validPaymentInvoices && (
                    <span className="text-red-600">*</span>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 mt-1 max-h-80 overflow-y-auto">
                    {selectedStudent.enrolments.map((enrolment) => {
                      const isSelected = selectedInvoices.some(
                        (selectedInvoice) =>
                          selectedInvoice._id === enrolment.invoice._id
                      );
                      return (
                        <button
                          aria-label="paymentInvoice"
                          key={enrolment.invoice._id}
                          type="button"
                          onClick={() => handleInvoiceClick(enrolment.invoice)}
                          className={`px-3 py-2 text-left rounded-md ${
                            isSelected
                              ? "bg-sky-700 text-white hover:bg-sky-600"
                              : "bg-gray-200 text-gray-700 hover:bg-sky-600 hover:text-white"
                          }`}
                        >
                          <div className="font-semibold">
                            {`${
                              enrolment?.servicePeriod.charAt(0).toUpperCase() +
                              enrolment?.servicePeriod.slice(1)
                            } ${enrolment?.serviceType} for ${
                              enrolment?.invoice?.invoiceMonth
                            }`}
                          </div>
                          <div className="text-sm">
                            {`Amount: ${enrolment?.invoice?.invoiceAmount} ${CurrencySymbol} / ${enrolment?.invoice?.invoiceAuthorisedAmount} ${CurrencySymbol}`}
                          </div>
                          {enrolment?.invoice?.invoiceDiscountAmount !==
                            "0" && (
                            <div className="text-sm text-green-600">
                              {`with ${enrolment?.invoice?.invoiceDiscountAmount} ${CurrencySymbol} discount`}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* {selectedStudent && (
            <ul className="border rounded-md p-2 max-h-80 overflow-y-auto">
              {selectedStudent.enrolments.map((enrolment) => (
                <li
                  key={enrolment.invoice._id}
                  className={`cursor-pointer hover:bg-gray-100 p-2 border-b ${
                    selectedInvoices.some(
                      (selectedInvoice) =>
                        selectedInvoice._id === enrolment.invoice._id
                    )
                      ? "bg-blue-200" // Apply blue background if selected
                      : ""
                  }`}
                  onClick={() => handleInvoiceClick(enrolment.invoice)}
                >
                  {`${
                    enrolment?.servicePeriod.charAt(0).toUpperCase() +
                    enrolment?.servicePeriod.slice(1)
                  } ${enrolment?.serviceType} for ${
                    enrolment?.invoice?.invoiceMonth
                  }`}
                  <br />
                  {`Amount: ${enrolment?.invoice?.invoiceAmount} ${CurrencySymbol} / ${enrolment?.invoice?.invoiceAuthorisedAmount} ${CurrencySymbol}`}
                  <br />
                  {enrolment?.invoice?.invoiceDiscountAmount !== "0"
                        ? with ${enrolment?.invoice?.invoiceDiscountAmount} ${CurrencySymbol} discount
                        : ""}
                </li>
              ))}
            </ul>
          )} */}
          {/* Selected Invoices Summary */}
          {/* {selectedInvoices.length > 0 && (
            <div className="mb-4">
              <h3 className="formSectionTitle">
                Selected Invoices
              </h3>
              <ul className="border rounded-md p-2 max-h-80 overflow-y-auto">
                {selectedInvoices.map((invoice) => (
                  <li
                    key={invoice._id}
                    className="cursor-pointer hover:bg-red-100 p-2 border-b"
                    onClick={() => handleRemoveInvoice(invoice)}
                  >
                    {`${invoice.invoiceMonth}: ${
                      invoice.invoiceAmount
                    }${" "}${CurrencySymbol}`}
                  </li>
                ))}
              </ul>
              <div className="mt-2 font-bold">
                Selected Invoices Total: {totalInvoiceAmount} {CurrencySymbol}
              </div>
            </div>
          )} */}
          <h3 className="formSectionTitle">Payment Details</h3>
          <div className="formSection">
            <div className="formLineDiv">
              {/* Payment Amount */}
              <label htmlFor="paymentAmount" className="formInputLabel">
                Payment Amount{" "}
                {!validity.validPaymentAmount && (
                  <span className="text-red-600">*</span>
                )}{" "}
                ({CurrencySymbol})
                <input
                  aria-invalid={!validity.validPaymentAmount}
                  type="number"
                  id="paymentAmount"
                  placeholder="[$$$.$$]"
                  name="paymentAmount"
                  value={formData.paymentAmount}
                  onChange={handleInputChange}
                  className={`formInputText ${
                    validity.validPaymentAmount
                      ? "focus:ring-sky-700"
                      : "focus:ring-red-600"
                  }`}
                  required
                />
                {!validity.validPaymentAmount && (
                  <p className="text-red-600 text-sm">
                    Amount must be a valid number and equal to the total invoice
                    amount.
                  </p>
                )}
              </label>

              {/* Payment Date */}

              <label htmlFor="paymentDate" className="formInputLabel">
                Payment Date{" "}
                {!validity.validPaymentDate && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-invalid={!validity.validPaymentDate}
                  type="date"
                  id="paymentDate"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
                  required
                />{" "}
              </label>
            </div>

            {/* Payment Type */}
            <div className="formLineDiv">
              <label htmlFor="paymentType" className="formInputLabel">
                Payment Type{" "}
                {!validity.validPaymentType && (
                  <span className="text-red-600">*</span>
                )}
                <select
                  id="paymentType"
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                  className="formInputText"
                  required
                >
                  <option value="" disabled>
                    Select Payment Type
                  </option>
                  {PaymentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>{" "}
              </label>

              {/* Payment Type Reference */}

              <label htmlFor="paymentReference" className="formInputLabel">
                Payment Reference{" "}
                {!validity.validPaymentReference && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  type="text"
                  id="paymentReference"
                  name="paymentReference"
                  placeholder="[3-30 letters]"
                  value={formData.paymentReference}
                  onChange={handleInputChange}
                  className="formInputText"
                />{" "}
              </label>
            </div>

            {/* Payment Note */}

            <label htmlFor="paymentNote" className="formInputLabel">
              Payment Note
              {!validity.validPaymentNote && (
                <span className="text-red-600">*</span>
              )}
              <textarea
                id="paymentNote"
                name="paymentNote"
                placeholder="[1-150 letters]"
                value={formData.paymentNote}
                onChange={handleInputChange}
                className={`formInputText`}
                rows="2"
              ></textarea>{" "}
            </label>
          </div>

          {/* Submit Button */}
          <div className="cancelSavebuttonsDiv">
            <button
              aria-label="cancel payment"
              type="button"
              className="cancel-button"
              onClick={() => navigate("/finances/payments/paymentsList/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              aria-label="submit form"
              className="save-button"
              disabled={!canSubmit || isAddLoading}
            >
              save
              {/* {isAddLoading ? "Submitting..." : "Submit Payment"} */}
            </button>
          </div>
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
  }
  return content;
};

export default NewPaymentForm;
