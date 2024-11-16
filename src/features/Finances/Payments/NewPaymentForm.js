import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddNewPaymentMutation,
  useGetPaymentsQuery,
} from "./paymentsApiSlice"; // Redux API action

import Finances from "../Finances";
import useAuth from "../../../hooks/useAuth";
import { useGetAttendedSchoolsQuery } from "../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import { useGetEnrolmentsByYearQuery } from "../../Students/Enrolments/enrolmentsApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  NAME_REGEX,
  DATE_REGEX,
  OBJECTID_REGEX,
  NUMBER_REGEX,
} from "../../../config/REGEX";
import { MONTHS } from "../../../config/Months";

const NewPaymentForm = () => {
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  
  //function to return curent month for month selection
  const getCurrentMonth = () => {
    const currentMonthIndex = new Date().getMonth(); // Get current month (0-11)
    return MONTHS[currentMonthIndex]; // Return the month name with the first letter capitalized
  };

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const {
    data: enrolment, //the data is renamed enrolment
    isLoading: isEnrolmentLoading, //monitor several situations is loading...
    isSuccess: isEnrolmentSuccess,
    isError: isEnrolmentError,
    error: enrolmentError,
  } = useGetEnrolmentsByYearQuery(
    {
      selectedMonth: selectedMonth,
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewPaymentForm",
    } || {},
    {
      //this param will be passed in req.params to select only enrolment for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  const [formData, setFormData] = useState({
    paymentYear: selectedAcademicYear?.title || "",
    paymentMonth: getCurrentMonth(),
    paymentEnrolments: [
      {
        paymentDueDate: "",
        paymentAmount: "",
        paymentDiscountAmount: "",
        paymentStudent: "",
      },
    ],
    paymentIssueDate: "",
    paymentCreator: userId,
    paymentOperator: userId,
  });

  //let schoolsList = isSchoolSuccess ? Object.values(schools.entities) : [];

  let enrolmentList = [];

  if (isEnrolmentSuccess) {
    const { entities } = enrolment;
    enrolmentList = Object.values(entities);
  }

  const [validity, setValidity] = useState({
    validPaymentYear: false,
    validPaymentMonth: false,
    //validPaymentEnrolments: false,
    validAssignedFrom: false,
    validAssignedTo: false,
    validPaymentDueDate: "",
    validPaymentIssueDate: "",
    validPaymentAmount: "",
    validPaymentDiscountAmount: "",
    validPaymentCreator: userId,
    validPaymentOperator: userId,
  });

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

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validPaymentYear: DATE_REGEX.test(formData?.paymentYear),
      validPaymentMonth: NAME_REGEX.test(formData?.paymentMonth),
      // validPaymentEnrolments: formData?.paymentEnrolments?.length > 0,
      //validPaymentDueDate: DATE_REGEX.test(formData?.paymentDueDate),
      validPaymentIssueDate: DATE_REGEX.test(formData?.paymentIssueDate),
      // validPaymentAmount: NUMBER_REGEX.test(formData?.paymentAmount),
      // validPaymentDiscountAmount: NUMBER_REGEX.test(formData?.paymentDiscountAmount ),
      validPaymentCreator: OBJECTID_REGEX.test(formData?.paymentCreator),
      validPaymentOperator: OBJECTID_REGEX.test(formData?.paymentOperator),
    }));
  }, [formData]);

  // Clear form and errors on success
  useEffect(() => {
    if (isAddSuccess) {
      setFormData({
        paymentYear: "",
        paymentMonth: "",
        paymentEnrolments: [],
        paymentIssueDate: "",
        paymentIsFullyPaid: false,
        paymentCreator: "",
        paymentOperator: "",
      });

      navigate("/finances/payments/paymentsList");
    }
  }, [isAddSuccess, navigate]);

  // Check if all fields are valid and enable the submit button
  const canSubmit = Object.values(validity).every(Boolean) && !isAddLoading;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are valid
    if (!canSubmit) {
      //setError("Please fill in all fields correctly.");
      return;
    }

    try {
      const newPayments = await addNewPayment(formData).unwrap();
    } catch (err) {
      //setError("Failed to add the attended school.");
    }
  };

  // Handler for changing input values
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler for changing enrolment fields
  const handleEnrolmentChange = (index, event) => {
    const { name, value } = event.target;
    const updatedEnrolments = formData.paymentEnrolments.map((enrolment, idx) =>
      idx === index ? { ...enrolment, [name]: value } : enrolment
    );
    setFormData({ ...formData, paymentEnrolments: updatedEnrolments });
  };

  // Add new enrolment field set
  const handleAddEnrolment = () => {
    setFormData({
      ...formData,
      paymentEnrolments: [
        ...formData.paymentEnrolments,
        {
          paymentDueDate: "",
          paymentAmount: "",
          paymentDiscountAmount: "",
          paymentStudent: "",
        },
      ],
    });
  };

  // Remove enrolment field set
  const handleRemoveEnrolment = (index) => {
    const updatedEnrolments = formData.paymentEnrolments.filter(
      (_, idx) => idx !== index
    );
    setFormData({ ...formData, paymentEnrolments: updatedEnrolments });
  };

  console.log(formData, "formdata");

  return (
    <>
      <Finances />
      <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Payments</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Payment Year{" "}
              {!validity.validPaymentYear && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="text"
              name="paymentYear"
              value={formData.paymentYear}
              readOnly
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
          <select
            value={formData.paymentMonth}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* Default option is the current month */}
            <option value={getCurrentMonth()}>{getCurrentMonth()}</option>

            {/* Render the rest of the months, excluding the current month */}
            {MONTHS.map(
              (month, index) =>
                month !== getCurrentMonth() && (
                  <option key={index} value={month}>
                    {month}
                  </option>
                )
            )}
          </select>
          </div>

          <div className="mb-4">
            <label>Payment Issue Date:</label>
            <input
              type="date"
              name="paymentIssueDate"
              value={formData.paymentIssueDate}
              onChange={handleInputChange}
            />
          </div>

          {formData.paymentEnrolments.map((enrolment, index) => (
            <div key={index} className="enrolment-section">
              <h3>Payment Enrolment {index + 1}</h3>

              <div>
                <label>Payment Due Date:</label>
                <input
                  type="date"
                  name="paymentDueDate"
                  value={enrolment.paymentDueDate}
                  onChange={(event) => handleEnrolmentChange(index, event)}
                />
              </div>

              <div>
                <label>Payment Amount:</label>
                <input
                  type="number"
                  name="paymentAmount"
                  value={enrolment.paymentAmount}
                  onChange={(event) => handleEnrolmentChange(index, event)}
                />
              </div>

              <div>
                <label>Payment Discount Amount:</label>
                <input
                  type="number"
                  name="paymentDiscountAmount"
                  value={enrolment.paymentDiscountAmount}
                  onChange={(event) => handleEnrolmentChange(index, event)}
                />
              </div>

              <div>
                <label>Payment Student:</label>
                <input
                  type="text"
                  name="paymentStudent"
                  value={enrolment.paymentStudent}
                  onChange={(event) => handleEnrolmentChange(index, event)}
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveEnrolment(index)}
              >
                Remove Enrolment
              </button>
            </div>
          ))}

          <button type="button" onClick={handleAddEnrolment}>
            Add Enrolment
          </button>

          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewPaymentForm;
