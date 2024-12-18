import { useState, useEffect } from "react";
import { useUpdateLeaveMutation } from "./leavesApiSlice";
import { useNavigate } from "react-router-dom";
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
import { useOutletContext } from "react-router-dom";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";

const EditLeaveForm = ({ leave }) => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { isAdmin, isManager } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  console.log(leave, "leave");

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
    id: leave?._id,
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
    leaveComment: leave?.leaveComment,
    leaveOperator: userId,
  });

  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const [validity, setValidity] = useState({
    validLeaveYear: false,
    validLeaveMonth: false,
    validLeaveEmployee: false,
    validLeaveStartDate: false,
    validLeaveEndDate: false,
    validLeaveComment: false,
    validLeavePartDay: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => {
      const isPartDay = formData?.leaveIsPartDay;

      // Ensure start date is before end date
      const isStartDateBeforeEndDate =
        new Date(formData.leaveStartDate) <= new Date(formData.leaveEndDate);

      // Ensure start and end dates are the same if part-day
      const isSameDateForPartDay = isPartDay
        ? formData.leaveStartDate === formData.leaveEndDate
        : true;

      // Ensure start time is before end time if part-day
      const isStartTimeBeforeEndTime = isPartDay
        ? formData.leaveStartTime < formData.leaveEndTime
        : true;

      return {
        ...prev,
        validLeaveYear: YEAR_REGEX.test(formData.leaveYear),
        validLeaveMonth: NAME_REGEX.test(formData.leaveMonth),
        validLeaveEmployee: OBJECTID_REGEX.test(formData.leaveEmployee),
        validLeaveStartDate:
          DATE_REGEX.test(formData.leaveStartDate) && isStartDateBeforeEndDate,
        validLeaveStartTime: isPartDay
          ? formData.leaveStartTime !== "" && isStartTimeBeforeEndTime
          : true,
        validLeaveEndDate:
          DATE_REGEX.test(formData.leaveEndDate) && isStartDateBeforeEndDate,
        validLeaveEndTime: isPartDay
          ? formData.leaveEndTime !== "" && isStartTimeBeforeEndTime
          : true,
        validLeaveComment: COMMENT_REGEX.test(formData.leaveComment),
        validLeavePartDay: isSameDateForPartDay,
        validDateOrder: isStartDateBeforeEndDate,
        validPartDayDate: isSameDateForPartDay,
        validPartDayTime: isStartTimeBeforeEndTime,
      };
    });
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

    const leaveStartDateTime = formData.leaveIsPartDay
      ? `${formData.leaveStartDate}T${formData.leaveStartTime}`
      : formData.leaveStartDate;
    const leaveEndDateTime = formData.leaveIsPartDay
      ? `${formData.leaveEndDate}T${formData.leaveEndTime}`
      : formData.leaveEndDate;

    try {
      const response = await updateLeave({
        ...formData,
        leaveStartDate: leaveStartDateTime,
        leaveEndDate: leaveEndDateTime,
      });
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
      triggerBanner("Failed to create leave. Please try again.", "error");

      console.error("Error creating leave:", error);
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  console.log(formData, "formdata");
  console.log(validity, "validity");
  const content = (
    <>
      <HR />

      <form onSubmit={onSaveLeaveClicked} className="form-container">
        <h2 className="formTitle ">
          Update {formData?.leaveMonth} leave for{" "}
          {leave?.leaveEmployeeName?.userFirstName}{" "}
          {leave?.leaveEmployeeName?.userMiddleName}{" "}
          {leave?.leaveEmployeeName?.userLastName}{" "}
        </h2>
        <div className="formSectionContainer">
          <h3 className="formSectionTitle">Leave details</h3>
          <div className="formSection">
            <div className="formLineDiv">
              {/* Leave Is Approved */}

              <label className="formInputLabel">
                Approved leave?
                <div className="formCheckboxItemsDiv">
                  <label
                    htmlFor="leaveIsApproved"
                    className="formCheckboxChoice"
                  >
                    <input
                      type="checkbox"
                      id="leaveIsApproved"
                      name="leaveIsApproved"
                      checked={formData.leaveIsApproved}
                      onChange={handleInputChange}
                      className="formCheckbox"
                    />
                    Leave is approved
                  </label>
                </div>
              </label>

              {/* Leave Is Paid Leave */}
              <label className="formInputLabel">
                Paid leave?
                <div className="formCheckboxItemsDiv">
                  <label
                    htmlFor="leaveIsPaidLeave"
                    className="formCheckboxChoice"
                  >
                    <input
                      type="checkbox"
                      id="leaveIsPaidLeave"
                      name="leaveIsPaidLeave"
                      checked={formData.leaveIsPaidLeave}
                      onChange={handleInputChange}
                      className="formCheckbox"
                    />
                    Leave is paid
                  </label>
                </div>
              </label>

              {/* Leave Is Sick Leave */}
              <label className="formInputLabel">
                Sick leave?
                <div className="formCheckboxItemsDiv">
                  <label
                    htmlFor="leaveIsSickLeave"
                    className="formCheckboxChoice"
                  >
                    <input
                      type="checkbox"
                      id="leaveIsSickLeave"
                      name="leaveIsSickLeave"
                      checked={formData.leaveIsSickLeave}
                      onChange={handleInputChange}
                      className="formCheckbox"
                    />
                    Leave is sick leave
                  </label>
                </div>
              </label>
              {/* Leave Is Part Day */}
              <label className="formInputLabel">
                Part Day leave?{" "}
                {!validity.validLeavePartDay && (
                  <span className="text-red-600">*</span>
                )}
                <div className="formCheckboxItemsDiv">
                  <label
                    htmlFor="leaveIsPartDay"
                    className="formCheckboxChoice"
                  >
                    <input
                      type="checkbox"
                      id="leaveIsPartDay"
                      name="leaveIsPartDay"
                      checked={formData.leaveIsPartDay}
                      onChange={handleInputChange}
                      className="formCheckbox"
                    />
                    Leave is part day
                  </label>
                </div>
              </label>

              {/* Leave Start Date */}
              <label htmlFor="leaveStartDate" className="formInputLabel">
                leave start date{" "}
                {!validity.validLeaveStartDate && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  type="date"
                  id="leaveStartDate"
                  name="leaveStartDate"
                  value={formData.leaveStartDate}
                  onChange={handleInputChange}
                  className={`formInputText`}
                />{" "}
                {!validity.validLeavePartDay && (
                  <span className="text-red-600">Should be same day</span>
                )}
                {!validity.validDateOrder && (
                  <span className="text-red-600"> Should be earlier date</span>
                )}
              </label>

              {/* Leave End Date */}

              <label htmlFor="leaveEndDate" className="formInputLabel">
                Leave end date{" "}
                {!validity.validLeaveEndDate && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  type="date"
                  id="leaveEndDate"
                  name="leaveEndDate"
                  value={formData.leaveEndDate}
                  onChange={handleInputChange}
                  className={`formInputText`}
                />{" "}
                {!validity.validLeavePartDay && (
                  <span className="text-red-600">should be same day</span>
                )}
                {!validity.validDateOrder && (
                  <span className="text-red-600"> Should be later date</span>
                )}
              </label>
              {formData.leaveIsPartDay && (
                <>
                  <label htmlFor="leaveStartTime" className="formInputLabel">
                    Leave start time
                    {!validity.validLeaveStartTime && (
                      <span className="text-red-600">*</span>
                    )}
                    <input
                      type="time"
                      id="leaveStartTime"
                      name="leaveStartTime"
                      value={formData.leaveStartTime}
                      onChange={handleInputChange}
                      className={`formInputText`}
                      required
                    />{" "}
                    {!validity.validPartDayTime && (
                      <span className="text-red-600">
                        {" "}
                        Should be later time
                      </span>
                    )}
                  </label>
                  <label htmlFor="leaveEndTime" className="formInputLabel">
                    leave end time
                    {!validity.validLeaveEndTime && (
                      <span className="text-red-600">*</span>
                    )}
                    <input
                      type="time"
                      id="leaveEndTime"
                      name="leaveEndTime"
                      value={formData.leaveEndTime}
                      onChange={handleInputChange}
                      className={`formInputText`}
                      required
                    />
                    {!validity.validPartDayTime && (
                      <span className="text-red-600">
                        {" "}
                        Should be earlier time
                      </span>
                    )}
                  </label>
                </>
              )}
            </div>
            {/* Leave Comment */}

            <label htmlFor="" className="formInputLabel">
              Comment{" "}
              {!validity.validLeaveComment && (
                <span className="text-red-600">*</span>
              )}
              <textarea
                aria-label="leaveComment"
                name="leaveComment"
                value={formData.leaveComment}
                onChange={handleInputChange}
                className={`formInputText`}
                placeholder="[0-150 characters"
              />{" "}
            </label>
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            aria-label="cancel leave"
            type="button"
            onClick={() => navigate("/hr/leaves/leavesList/")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            aria-label="submit leave"
            type="submit"
            disabled={!canSave || isUpdateLoading}
            className="save-button"
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
