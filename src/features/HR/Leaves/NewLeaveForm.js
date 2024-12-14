import { useState, useEffect } from "react";
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
import useAuth from "../../../hooks/useAuth";
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
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
import { MONTHS } from "../../../config/Months";

const NewLeaveForm = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  //console.log(selectedAcademicYear.title, "selectedAcademicYear");
  const [
    addNewLeave,
    {
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      error: addError,
    },
  ] = useAddNewLeaveMutation();
  const {
    data: employees, //the data is renamed employees
    isLoading: isEmployeesLoading,
    isSuccess: isEmployeesSuccess,
    isError: isEmployeesError,
    error: employeesError,
  } = useGetEmployeesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewLeaveForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Consolidated form state
  const [formData, setFormData] = useState({
    leaveYear: selectedAcademicYear?.title,
    leaveMonth: "",
    leaveEmployee: "",
    leaveIsApproved: false,
    leaveIsPaidLeave: false,
    leaveIsSickLeave: false,
    leaveIsPartDay: false,
    leaveStartDate: "",
    leaveEndDate: "",
    leaveStartTime: "",
    leaveEndTime: "",
    leaveComment: "",
    leaveOperator: userId,
    leaveCreator: userId,
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
    if (isAddSuccess) {
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
        leaveCreator: "",
      });
      navigate("/hr/leaves/leavesList/");
    }
  }, [isAddSuccess, navigate]);

  const employeesList = isEmployeesSuccess
    ? Object.values(employees.entities)
    : [];

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

    !isAddLoading;

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

      await addNewLeave({
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

      <form onSubmit={onSaveLeaveClicked} className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Add New Leave: </h2>
        <div>
          <label
            htmlFor="leaveMonth"
            className="block text-sm font-medium text-gray-700"
          >
            Leave Month{" "}
            {!validity.validLeaveMonth && (
              <span className="text-red-600">*</span>
            )}
          </label>
          <select
            id="leaveMonth"
            name="leaveMonth"
            value={formData.leaveMonth}
            onChange={(e) =>
              setFormData({ ...formData, leaveMonth: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Month</option>
            {MONTHS.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="leaveEmployee"
            className="block text-sm font-medium text-gray-700"
          >
            Leave Employee{" "}
            {!validity.validLeaveEmployee && (
              <span className="text-red-600">*</span>
            )}
          </label>
          <select
            id="leaveEmployee"
            name="leaveEmployee"
            value={formData.leaveEmployee}
            onChange={(e) =>
              setFormData({ ...formData, leaveEmployee: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Employee</option>
            {employeesList?.map((employee) => (
              <option key={employee?.employeeId} value={employee?.employeeId}>
                {employee?.userFullName?.userFirstName}{" "}
                {employee?.userFullName?.userMiddleName}{" "}
                {employee?.userFullName?.userLastName}
              </option>
            ))}
          </select>
        </div>

        {/* Leave Is Approved */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
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
            disabled={!canSave || isAddLoading}
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

export default NewLeaveForm;
