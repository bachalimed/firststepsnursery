import { useState, useEffect } from "react";
import { useUpdateLeaveMutation } from "./leavesApiSlice";
import {
  selectEmployeeById,
  useGetEmployeeByIdQuery,
} from "../Employees/employeesApiSlice";
import { useAddNewLeaveMutation } from "./leavesApiSlice";
import { useNavigate } from "react-router-dom";
import {
  useGetEmployeesByYearQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "../Employees/employeesApiSlice";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import {
  POSITIONS,
  CONTRACT_TYPES,
  PAYMENT_PERIODS,
} from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import HR from "../HR";

import { useSelector } from "react-redux";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  NAME_REGEX,
  OBJECTID_REGEX,
  USER_REGEX,
  PHONE_REGEX,
  DATE_REGEX,
  YEAR_REGEX,
  COMMENT_REGEX,
} from "../../../config/REGEX";
import useAuth from "../../../hooks/useAuth";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
import { MONTHS } from "../../../config/Months";
const EditLeaveForm = ({ leave }) => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { isAdmin, isManager } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  // console.log(leave,'leave')

  const [
    updateLeave,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateLeaveMutation();

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Consolidated form state
  const [formData, setFormData] = useState({
    leaveYear: leave?.leaveYear,
    leaveMonth: leave?.leaveMonth,
    leaveEmployee: leave?.leaveEmployee,
    leaveIsApproved: leave?.leaveIsApproved,
    leaveIsPaidLeave: leave?.leaveIsPaidLeave,
    leaveIsSickLeave: leave?.leaveIsSickLeave,
    leaveIsPartDay: leave?.leaveIsPartDay,
    leaveStartDate: leave?.leaveStartDate?.split("T")[0],
    leaveEndDate: leave?.leaveEndDate?.split("T")[0],
    leaveStartTime: leave?.leaveIsPartDay
      ? new Date(leave.leaveStartDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    leaveEndTime: leave?.leaveIsPartDay
      ? new Date(leave.leaveEndDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",

    leaveOperator: userId,
  });
  const [validity, setValidity] = useState({
    validLeaveYear: false,
    validLeaveMonth: false,
    validLeaveEmployee: false,
    validLeaveStartDate: false,
    validLeaveEndDate: false,
    validLeaveComment: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validLeaveYear: YEAR_REGEX.test(formData.leaveYear),
      validLeaveMonth: NAME_REGEX.test(formData.leaveMonth),
      validLeaveEmployee: OBJECTID_REGEX.test(formData.leaveEmployee),
      validLeaveStartDate: DATE_REGEX.test(formData.leaveStartDate),
      validLeaveStartTime:
        formData?.leaveIsPartDay === true
          ? formData.leaveStartTime !== ""
          : true,
      validLeaveEndDate: DATE_REGEX.test(formData.leaveEndDate),
      validLeaveEndTime:
        formData?.leaveIsPartDay === true ? formData.leaveEndTime !== "" : true,
      validLeaveComment: COMMENT_REGEX.test(formData.leaveComment),
    }));
  }, [formData]);
  useEffect(() => {
    if (isUpdateSuccess) {
      setFormData({
        leaveYear: "",
        leaveMonth: "",
        leaveEmployee: "",
        leaveIsApproved: "",
        leaveIsPaidLeave: "",
        leaveIsSickLeave: "",
        leaveIsPartDay: "",
        leaveStartDate: "",
        leaveEndDate: "",
        leaveStartTime: "",
        leaveEndTime: "",
        leaveComment: "",
        leaveOperator: "",
      });
      navigate("/hr/leaves/leavesList/");
    }
  }, [isUpdateSuccess, navigate]);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const canSave =
    Object.values(validity).every(Boolean) &&
    // ((formData.leaveYears[0].academicYear)!=='') &&

    !isUpdateLoading;

  const onSaveLeaveClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async () => {
    setShowConfirmation(false);
    try {
      const leaveStartDateTime = formData.leaveIsPartDay
        ? `${formData.leaveStartDate}T${formData.leaveStartTime}`
        : formData.leaveStartDate;
      const leaveEndDateTime = formData.leaveIsPartDay
        ? `${formData.leaveEndDate}T${formData.leaveEndTime}`
        : formData.leaveEndDate;

      await updateLeave({
        ...formData,
        leaveStartDate: leaveStartDateTime,
        leaveEndDate: leaveEndDateTime,
      });
    } catch (err) {
      console.error("Failed to save the leave:", err);
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  console.log(formData, "formdata");
  const content = (
    <>
      <HR />

      <form onSubmit={onSaveLeaveClicked} className="form-container">
        <h2  className="formTitle ">
          Update {formData?.leaveMonth} Leave for{" "}
          {leave?.leaveEmployeeName?.userFirstName}{" "}
          {leave?.leaveEmployeeName?.userMiddleName}{" "}
          {leave?.leaveEmployeeName?.userLastName}{" "}
        </h2>

        {/* Leave Is Approved */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Leave is Approved ?
          </label>
          <input
            type="checkbox"
            name="leaveIsApproved"
            checked={formData.leaveIsApproved}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>

        {/* Leave Is Paid Leave */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Leave is Paid ?
          </label>
          <input
            type="checkbox"
            name="leaveIsPaidLeave"
            checked={formData.leaveIsPaidLeave}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>

        {/* Leave Is Sick Leave */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Leave is Sick Leave ?
          </label>
          <input
            type="checkbox"
            name="leaveIsSickLeave"
            checked={formData.leaveIsSickLeave}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>

        {/* Leave Start Date */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Start Date{" "}
            {!validity.validLeaveStartDate && (
              <span className="text-red-600">*</span>
            )}
          </label>
          <input
            type="date"
            name="leaveStartDate"
            value={formData.leaveStartDate}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Leave End Date */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            End Date{" "}
            {!validity.validLeaveEndDate && (
              <span className="text-red-600">*</span>
            )}
          </label>
          <input
            type="date"
            name="leaveEndDate"
            value={formData.leaveEndDate}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Leave Is Part Day */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Leave is Part Day ?
          </label>
          <input
            type="checkbox"
            name="leaveIsPartDay"
            checked={formData.leaveIsPartDay}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>

        {formData.leaveIsPartDay && (
          <>
            <div>
              <label htmlFor=""  className="formInputLabel">
                Start Time
              </label>
              <input
                type="time"
                name="leaveStartTime"
                value={formData.leaveStartTime}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor=""  className="formInputLabel">
                End Time
              </label>
              <input
                type="time"
                name="leaveEndTime"
                value={formData.leaveEndTime}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </>
        )}

        {/* Leave Comment */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Comment
          </label>
          <textarea
            name="leaveComment"
            value={formData.leaveComment}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/hr/leaves/leavesList/")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave || isUpdateLoading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              canSave
                ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                : "bg-gray-400 cursor-not-allowed"
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            Save
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

export default EditLeaveForm;
