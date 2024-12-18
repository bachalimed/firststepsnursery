import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux"; // Assuming you're using Redux for state management
import { useNavigate } from "react-router-dom";
import Students from "../Students";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";

import { useUpdateEnrolmentMutation } from "./enrolmentsApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import useAuth from "../../../hooks/useAuth";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";

import { selectAllAcademicYears } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  FEE_REGEX,
  DATE_REGEX,
  COMMENT_REGEX,
  OBJECTID_REGEX,
} from "../../../config/REGEX";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
import { CurrencySymbol } from "../../../config/Currency";
import { useOutletContext } from "react-router-dom";

const EditEnrolmentForm = ({ enrolment }) => {
  console.log(enrolment, "enrolment");
  // initialising states
  const { isAdmin, userId } = useAuth();
  const navigate = useNavigate();
  const [
    updateEnrolment,
    {
      isLoading: isEnrolmentLoading,
      isSuccess: isEnrolmentSuccess,
      isError: isEnrolmentError,
      error: enrolmentError,
    },
  ] = useUpdateEnrolmentMutation();
  //academic years states
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  // Local state for form data
  const [formData, setFormData] = useState({
    enrolmentId: enrolment?.id,
    student: enrolment?.student._id,
    enrolmentYear: enrolment?.enrolmentYear,
    enrolmentMonth: enrolment?.enrolmentMonth,
    service: enrolment?.service,
    serviceType: enrolment?.serviceType,
    servicePeriod: enrolment?.servicePeriod,
    servicePeriod: enrolment?.servicePeriod,
    serviceAuthorisedFee: enrolment?.serviceAuthorisedFee,
    serviceFinalFee: enrolment?.serviceFinalFee,
    enrolmentNote: enrolment?.enrolmentNote,
    enrolmentSuspension: {
      enrolmentSuspensionDate:
        enrolment?.enrolmentSuspension?.enrolmentSuspensionDate?.split("T")[0],
      suspensionOperator:
        enrolment?.enrolmentSuspension?.enrolmentSuspensionOperator,
    },
    enrolmentInvoice: enrolment?.enrolmentInvoice,
    enrolmentOperator: userId, // Set to the operator id
  });
  ////////////////if enrolment is invoiced disable editing
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [enrolmentValidity, setEnrolmentValidity] = useState([]);

  const [validity, setValidity] = useState({
    validServiceFinalFee: false,
    validEnrolmentNote: false,
  });

  useEffect(() => {
    setValidity({
      validEnrolmentNote: COMMENT_REGEX.test(formData?.enrolmentNote),
      validServiceFinalFee: FEE_REGEX.test(formData?.serviceFinalFee),
    });
  }, [formData]);

  useEffect(() => {
    if (isEnrolmentSuccess) {
      //if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
      setFormData({
        enrolmentId: "",
        student: "",
        enrolmentYear: "",
        enrolmentMonth: "",

        service: "",
        serviceType: "",
        servicePeriod: "",
        servicePeriod: "",
        serviceAuthorisedFee: "",
        serviceFinalFee: "",
        enrolmentNote: "",
        enrolmentSuspension: "",
        enrolmentInvoice: "",
        enrolmentOperator: "", // Set to the operator id
      });
      navigate("/students/enrolments/enrolments"); //will navigate here after saving
    }
  }, [isEnrolmentSuccess, navigate]); //even if no success it will navigate and not show any warning if failed or success

  // For checking whether the form is valid
  const canSave =
    validity && Object.values(validity).every(Boolean) && !isEnrolmentLoading;

  // Submit the form

  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);
    try {
      const response = await updateEnrolment(formData).unwrap();
      // navigate("/students/enrolments/enrolments");
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
      triggerBanner("Failed to update enrolment. Please try again.", "error");

      console.error("Error updating enrolment:", error);
    }
  };
  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  console.log(formData, "formData");
  const content = (
    <>
      <Students />
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="formTitle">Edit Enrolment</h2>
        <div className="formSectionContainer">
          <h3 className="formSectionTitle"> Enrolment Details</h3>
          <div className="formSection">
            <div className="formLineDiv">
              <label htmlFor="student" className="formInputLabel">
                Student
                <select
                  id="student"
                  name="student"
                  value={formData.student}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      student: e.target.value, // update formData with input value
                    }))
                  }
                  className={`formInputText`}
                  required
                  disabled
                >
                  <option
                    key={enrolment.student._id}
                    value={enrolment.student._id}
                  >
                    {enrolment.student?.studentName?.firstName}{" "}
                    {enrolment.student.studentName?.middleName}{" "}
                    {enrolment.student.studentName?.lastName}
                  </option>
                </select>
              </label>

              <label htmlFor="enrolmentYear" className="formInputLabel">
                Enrolment Year
                <select
                  id="enrolmentYear"
                  name="enrolmentYear"
                  value={formData.enrolmentYear}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      enrolmentYear: e.target.value, // update formData with input value
                    }))
                  }
                  className={`formInputText`}
                  disabled
                >
                  <option
                    key={formData.enrolmentYear}
                    value={formData.enrolmentYear}
                  >
                    {formData.enrolmentYear}
                  </option>
                </select>
              </label>
            </div>
            <div className="formLineDiv">
              {/* Enrolment Month Input */}

              <label htmlFor="enrolmentMonth" className="formInputLabel">
                Enrolment Month
                <select
                  id="enrolmentMonth"
                  name="enrolmentMonth"
                  value={formData.enrolmentMonth}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      enrolmentMonth: e.target.value, // update formData with input value
                    }))
                  }
                  className={`formInputText`}
                  disabled
                >
                  <option
                    key={formData.enrolmentMonth}
                    value={formData.enrolmentMonth}
                  >
                    {formData.enrolmentMonth}
                  </option>
                </select>
              </label>

              {/* Service Section */}

              <label htmlFor="service" className="formInputLabel">
                Service
                <select
                  id="service"
                  name="Service"
                  value={formData.service}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      service: e.target.value, // update formData with input value
                    }))
                  }
                  className={`formInputText`}
                  disabled
                >
                  <option key={formData.service} value={formData.service}>
                    {formData.servicePeriod} {formData.serviceType}
                  </option>
                </select>
              </label>
            </div>

           
          </div>

          <h3 className="formSectionTitle"> Service details</h3>
          <div className="formSection">
            {/* Services Section */}

            <div>
              
              <label
                htmlFor={formData?.service}
                className=" flex items-center justify-between w-full gap-4"
              >
                <span className="ml-2 flex-1">
                  Authorized Fee: {formData?.serviceAuthorisedFee}{" "}
                  {`${CurrencySymbol}.`} Final Fee:{" "}
                  {!validity?.validServiceFinalFee && (
                    <span className="text-red-600">*</span>
                  )}
                </span>

                <input
                id={formData?.service}
                  type="number"
                  value={formData?.serviceFinalFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      serviceFinalFee: e.target.value,
                    })
                  }
                  className="ml-2 border rounded-md p-1 w-auto"
                  placeholder="Final Fee"
                />
              </label>
              {/* enrolment note */}

              <label htmlFor="enrolmentNote" className="formInputLabel">
                Enrolment Note
                <textarea
                  id="enrolmentNote"
                  name="enrolmentNote"
                  value={formData.enrolmentNote}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      enrolmentNote: e.target.value,
                    })
                  }
                  className={`formInputText`}
                  rows="2" // Adjust the number of rows as needed
                  placeholder="[1-150 characters]"
                />
              </label>
              <label htmlFor="suspensionEffectiveDate" className="formInputLabel">
              Enrolment Suspension
              <input
                type="date"
                id="suspensionEffectiveDate"
                name="suspensionEffectiveDate"
                value={formData.enrolmentSuspension.enrolmentSuspensionDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    enrolmentSuspension: {
                      enrolmentSuspensionOperator: userId,
                      enrolmentSuspensionDate: e.target.value,
                    },
                  })
                }
                className={`formInputText`}
              />
            </label>
            </div>
            {/* Submit Button */}
            <div className="cancelSavebuttonsDiv">
              <button
                aria-label="cancel enrolment"
                type="button"
                className="cancel-button"
                onClick={() => navigate("/students/enrolments/enrolments")}
              >
                Cancel
              </button>
              <button
                aria-label="save enrolment"
                type="submit"
                disabled={!canSave || isEnrolmentLoading}
                className="save-button"
              >
                save
              </button>
            </div>
          </div>
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

  return content;
};

export default EditEnrolmentForm;
