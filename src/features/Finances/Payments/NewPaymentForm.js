import { useState, useEffect } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdAddBox } from "react-icons/md";
import { MdOutlineAddBox } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAddNewPaymentMutation } from "./paymentsApiSlice"; // Redux API action
import { CurrencySymbol } from "../../../config/Currency";
import Finances from "../Finances";
import useAuth from "../../../hooks/useAuth";
import { useGetEnrolmentsByYearQuery } from "../../Students/Enrolments/enrolmentsApiSlice";

import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  NAME_REGEX,
  DATE_REGEX,
  YEAR_REGEX,
  OBJECTID_REGEX,
  NUMBER_REGEX,
  COMMENT_REGEX,
} from "../../../config/REGEX";
import { MONTHS } from "../../../config/Months";

const NewPaymentForm = ({ invoice }) => {
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const PaymentTypes = ["Cash", "Cheque", "Bank Transfer", "Online Payment"];

  const {
    data: studentsEnrolments, //the enrolments are retirved and transformed as students with arrays of enrolments
    isLoading: isEnrolmentsLoading, //monitor several situations is loading...
    isSuccess: isEnrolmentsSuccess,
    isError: isEnrolmentsError,
    error: enrolmentsError,
  } = useGetEnrolmentsByYearQuery(
    {
      criteria: "UnpaidInvoices",
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewPaymentForm",
    } || {},
    {
      //this param will be passed in req.params to select only payment for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  const [formData, setFormData] = useState({
    paymentYear: selectedAcademicYear?.title || "",
    paymentAmount: "",
    paymentStudent: "",
    paymentInvoices: [], // can pay once for many invoices
    paymentNote: "",
    paymentType: "",
    paymentTypeReference: "",
    paymentDate: "",
    paymentRecordDate: "",
    paymentCreator: userId,
    paymentOperator: userId,
  });

  //let schoolsList = isSchoolSuccess ? Object.values(schools.entities) : [];

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  // State to track the selected invoice
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [validity, setValidity] = useState({
    validPaymentAmount: false,
    validPaymentStudent: false,
    validPaymentInvoices: false, // can pay once for many invoices
    validPaymentNote: false,
    validPaymentType: false,
    validPaymentTypeReference: false,
    validPaymentDate: false,
  });
  console.log(validity);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux mutation for adding the attended school
  const [
    addNewPayment,
    {
      isLoading: isAddLoading,
      isError: isAddError,
      error: addError,
      isSuccess: isAddSuccess,
    },
  ] = useAddNewPaymentMutation();

  let studentsEnrolmentsList = [];

  if (isEnrolmentsSuccess) {
    const { entities } = studentsEnrolments;
    studentsEnrolmentsList = Object.values(entities);
    console.log(studentsEnrolmentsList, "studentsEnrolmentsList");
  }

  useEffect(() => {
    const isAmountValid = NUMBER_REGEX.test(formData.paymentAmount);
    const isAmountWithinLimit =
      parseFloat(formData.paymentAmount) <= totalInvoiceAmount;
    setValidity((prev) => ({
      ...prev,
      validPaymentAmount: isAmountValid && isAmountWithinLimit,
      validPaymentStudent:OBJECTID_REGEX.test(formData.paymentStudent),
      validPaymentInvoices: formData?.paymentInvoices?.length > 0,
      validPaymentNote: COMMENT_REGEX.test(formData?.paymentNote),
      validPaymentType: NAME_REGEX.test(formData?.paymentType),
      validPaymentTypeReference: NAME_REGEX.test(
        formData?.paymentTypeReference
      ),
      validPaymentDate: DATE_REGEX.test(formData?.paymentDate),
    }));
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
        paymentTypeReference: "",
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

  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      await addNewPayment(formData).unwrap();
    } catch (err) {
      console.error("Failed to add the payment.", err);
    }
  };

  const handleStudentChange = (e) => {
    const selectedStudentId = e.target.value;
    const student = studentsEnrolmentsList.find(
      (s) => s.id === selectedStudentId
    );
    setSelectedStudent(student);
    setFormData({ ...formData, paymentInvoices: [] });
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

  const handleRemoveInvoice = (invoice) => {
    const updatedInvoices = formData.paymentInvoices.filter(
      (id) => id !== invoice._id
    );
    const updatedSelectedInvoices = selectedInvoices.filter(
      (i) => i._id !== invoice._id
    );

    const newTotal = updatedSelectedInvoices.reduce(
      (total, selectedInvoice) =>
        total + parseFloat(selectedInvoice.invoiceAmount),
      0
    );

    setFormData({ ...formData, paymentInvoices: updatedInvoices });
    setSelectedInvoices(updatedSelectedInvoices);
    setTotalInvoiceAmount(newTotal);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  console.log(formData, "formdata");

  return (
    <>
      <Finances />
      <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Payments</h2>

        <form onSubmit={handleSubmit}>
          {/* Student Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Select Student{" "}
                {!validity.validPrimaryPhone && (
                  <span className="text-red-500">*</span>
                )}
            </label>
            <select
              value={selectedStudent?.id || ""}
              onChange={handleStudentChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Student</option>
              {studentsEnrolmentsList.map((student) => (
                <option key={student?.id} value={student?.id}>
                  {`${student?.studentName?.firstName} ${student?.studentName?.middleName} ${student?.studentName?.lastName}`}
                </option>
              ))}
            </select>
          </div>

          {/* Invoices List */}
          {selectedStudent && (
            <div className="mb-4">
              <h3 className="text-gray-700 font-bold mb-2">Select Invoices</h3>
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
                      ? `with ${enrolment?.invoice?.invoiceDiscountAmount} ${CurrencySymbol} discount`
                      : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Selected Invoices Summary */}
          {selectedInvoices.length > 0 && (
            <div className="mb-4">
              <h3 className="text-gray-700 font-bold mb-2">
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
          )}

          {/* Payment Date */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Payment Date
            </label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Payment Amount */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Payment Amount (€)
            </label>
            <input
              type="number"
              name="paymentAmount"
              value={formData.paymentAmount}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                validity.validPaymentAmount
                  ? "focus:ring-blue-500"
                  : "focus:ring-red-500"
              }`}
              required
            />
            {!validity.validPaymentAmount && (
              <p className="text-red-500 text-sm">
                Amount must be a valid number and not exceed the total invoice
                amount.
              </p>
            )}
          </div>

          {/* Payment Type */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Payment Type
            </label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </select>
          </div>

          {/* Payment Type Reference */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Payment Reference
            </label>
            <input
              type="text"
              name="paymentTypeReference"
              value={formData.paymentTypeReference}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                validity.validPaymentTypeReference
                  ? "focus:ring-blue-500"
                  : "focus:ring-red-500"
              }`}
              required
            />
          </div>

          {/* Payment Note */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Payment Note
            </label>
            <textarea
              name="paymentNote"
              value={formData.paymentNote}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                validity.validPaymentNote
                  ? "focus:ring-blue-500"
                  : "focus:ring-red-500"
              }`}
              rows="3"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded ${
              canSubmit ? "hover:bg-blue-600" : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!canSubmit}
          >
            {isAddLoading ? "Submitting..." : "Submit Payment"}
          </button>
        </form>
      </div>
    </>
  );
};

export default NewPaymentForm;
