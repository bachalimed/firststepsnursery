import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux"; // Assuming you're using Redux for state management
import { useNavigate } from "react-router-dom";
import Students from "../Students";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  useGetStudentsQuery,
  useGetStudentsByYearQuery,
} from "../StudentsAndParents/Students/studentsApiSlice";
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import { useUpdateEnrolmentMutation } from "./enrolmentsApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import useAuth from "../../../hooks/useAuth";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useGetAcademicYearsQuery } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice";
import { selectAllAcademicYears } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  FEE_REGEX,
  DATE_REGEX,
  COMMENT_REGEX,
  OBJECTID_REGEX,
} from "../../../config/REGEX";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
import { CurrencySymbol } from "../../../config/Currency";

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
    enrolmentSuspension:{ 
      enrolmentSuspensionDate: enrolment?.enrolmentSuspension?.enrolmentSuspensionDate?.split("T")[0],
      suspensionOperator: enrolment?.enrolmentSuspension?.enrolmentSuspensionOperator,

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
    
     validity && Object.values(validity).every(Boolean)&&  
    !isEnrolmentLoading;

  // Submit the form

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
      await updateEnrolment(formData).unwrap();
      // navigate("/students/enrolments/enrolments");
    } catch (error) {
      console.error("Error submitting form", error);
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
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 shadow rounded-md"
      >
        <h2 className="text-xl font-bold">Edit Enrolment</h2>
        <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
          <div>
            <label
              htmlFor="student"
              className="block text-sm font-medium text-gray-700"
            >
              Student
            </label>
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled
            >
              <option key={enrolment.student._id} value={enrolment.student._id}>
                {enrolment.student?.studentName?.firstName}{" "}
                {enrolment.student.studentName?.middleName}{" "}
                {enrolment.student.studentName?.lastName}
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="enrolmentYear"
              className="block text-sm font-medium text-gray-700"
            >
              Enrolment Year
            </label>
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              disabled
            >
              <option
                key={formData.enrolmentYear}
                value={formData.enrolmentYear}
              >
                {formData.enrolmentYear}
              </option>
            </select>
          </div>

          {/* Enrolment Month Input */}
          <div>
            <label
              htmlFor="enrolmentDate"
              className="block text-sm font-medium text-gray-700"
            >
              Enrolment Month
            </label>
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              disabled
            >
              <option
                key={formData.enrolmentMonth}
                value={formData.enrolmentMonth}
              >
                {formData.enrolmentMonth}
              </option>
            </select>
          </div>
          {/* Service Section */}

          <div>
            <label
              htmlFor="service"
              className="block text-sm font-medium text-gray-700"
            >
              Service
            </label>
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              disabled
            >
              <option key={formData.service} value={formData.service}>
                {formData.servicePeriod} {formData.serviceType}
              </option>
            </select>
          </div>
        </div>

        <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
          {/* Services Section */}

          <div className="">
            <label htmlFor={formData?.service}> </label>
            <span className="ml-4">
              Authorized Fee: {formData?.serviceAuthorisedFee}{" "}
              {`${CurrencySymbol}.`} Final Fee:{" "}{!validity?.validServiceFinalFee && (
                <span className="text-red-500">*</span>
              )}
            </span>
           

            <input
              type="number"
              value={formData?.serviceFinalFee}
              onChange={(e) =>
                setFormData({ ...formData, serviceFinalFee: e.target.value })
              }
              className="ml-4 border rounded-md p-1"
              placeholder="Final Fee"
            />
          </div>

          {/* enrolment note */}
          <div>
            <label
              htmlFor="enrolmentNote"
              className="block text-sm font-medium text-gray-700"
            >
              Enrolment Note
            </label>
            <textarea
              id="enrolmentNote"
              name="enrolmentNote"
              value={formData.enrolmentNote}
              onChange={(e) =>
                setFormData({ ...formData, enrolmentNote: e.target.value })
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows="4" // Adjust the number of rows as needed
              placeholder="Enter any additional notes here..."
            />
          </div>
        </div>

        <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
          <div>
            <label
              htmlFor="enrolmentYear"
              className="block text-sm font-medium text-gray-700"
            >
              Enrolment Suspension
            </label>
            <input
            type='date'
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              
            />
              
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
        <button
            type="button"
            className="cancel-button"
            onClick={()=>navigate("/students/enrolments/enrolments")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave||isEnrolmentLoading}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              canSave
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {isEnrolmentLoading ? "Saving..." : "Save Enrolment"}
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

  return content;
};

export default EditEnrolmentForm;
