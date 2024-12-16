import { useState, useEffect } from "react";
import { useAddNewSectionMutation } from "./sectionsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import Academics from "../Academics";
import useAuth from "../../../hooks/useAuth";
import { useSelector } from "react-redux";
import { useGetClassroomsQuery } from "../../AppSettings/AcademicsSet/Classrooms/classroomsApiSlice";
import {
  useGetEmployeesByYearQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "../../HR/Employees/employeesApiSlice";
import {
  useGetStudentsQuery,
  useUpdateStudentMutation,
  useGetStudentsByYearQuery,
  useDeleteStudentMutation,
} from "../../Students/StudentsAndParents/Students/studentsApiSlice";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { OBJECTID_REGEX, DATE_REGEX, NAME_REGEX } from "../../../config/REGEX";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";

const NewSectionForm = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  //console.log(selectedAcademicYear?.title, "selectedAcademicYear");
  const [
    addNewSection,
    {
      isLoading: isAddSectionLoading,
      isSuccess: isAddSectionSuccess,
      isError: isAddSectionError,
      error: addSectionError,
    },
  ] = useAddNewSectionMutation();
  const {
    data: employees, //the data is renamed employees
    isLoading: isEmployeesLoading,
    isSuccess: isEmployeesSuccess,
    isError: isEmployeesError,
    error: employeesError,
  } = useGetEmployeesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "Animators",
      endpointName: "NewSectionForm",
    } || {},
    {
      //pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const {
    data: classrooms, //the data is renamed sessions
    isLoading: isClassroomsLoading,
    isSuccess: isClassroomsSuccess,
    isError: isClassroomsError,
    error: classroomsError,
  } = useGetClassroomsQuery(
    {
      endpointName: "NewSectionForm",
    } || {},
    {
      //pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const {
    data: students, //the data is renamed students
    isLoading: isStudentLoading,
    isSuccess: isStudentSuccess,
    isError: isStudentError,
    error: studentError,
  } = useGetStudentsByYearQuery(
    {
      criteria: "activeStudents",
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewSectionForm",
    } || {},
    {
      // pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Consolidated form state
  const [formData, setFormData] = useState({
    sectionLabel: "",
    sectionYear: selectedAcademicYear?.title || "",
    students: [],
    sectionColor: "#5978ee",
    sectionType: "Nursery",
    sectionFrom: "",
    //sectionTo: "",
    sectionAnimator: "",
    sectionLocation: "",
    operator: userId,
    creator: userId,
  });
  let classroomsList = isClassroomsSuccess
    ? Object.values(classrooms.entities)
    : [];
  let studentsList = isStudentSuccess ? Object.values(students.entities) : [];
  // let employeesList = isEmployeesSuccess
  //   ? Object.values(employees.entities)
  //   : [];

  let employeesList = [];
  let activeEmployeesList = [];

  if (isEmployeesSuccess) {
    const { entities } = employees;
    employeesList = Object.values(entities);
    activeEmployeesList = employeesList.filter(
      (employee) => employee.employeeData.employeeIsActive === true
    );
  }

  const [validity, setValidity] = useState({
    validSectionLabel: false,
    validSectionYear: false,
    validStudents: false,
    validSectionColor: false,
    validSectionType: false,
    validSectionAnimator: false,

    validSectionFrom: false,
    validSectionLocation: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validSectionLabel: NAME_REGEX.test(formData.sectionLabel),
      validSectionYear: formData.sectionYear !== "",
      validSectionType: NAME_REGEX.test(formData.sectionType),
      validStudents: formData.students.length > 0,
      validSectionColor: formData.sectionColor !== "",
      validSectionAnimator: OBJECTID_REGEX.test(formData.sectionAnimator),
      validSectionFrom: DATE_REGEX.test(formData.sectionFrom),
      validSectionLocation: OBJECTID_REGEX.test(formData.sectionLocation),
    }));
  }, [formData]);

  useEffect(() => {
    if (isAddSectionSuccess) {
      setFormData({
        sectionLabel: "",
        sectionYear: "",
        students: [],
        sectionColor: "",
        sectionAnimator: "",
        sectionType: "",
        sectionFrom: "",
        //sectionTo: "",
        sectionLocation: "",
        operator: "",
        creator: "",
      });
      navigate("/academics/sections/nurserySectionsList");
    }
  }, [isAddSectionSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentSelection = (e) => {
    const selectedStudentIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    // Add selected students to formData.students array without duplicates
    setFormData((prev) => ({
      ...prev,
      students: [...new Set([...prev.students, ...selectedStudentIds])],
    }));
  };

  const handleRemoveStudent = (studentId) => {
    // Remove student by id
    setFormData((prev) => ({
      ...prev,
      students: prev.students.filter((id) => id !== studentId),
    }));
  };

  const unselectedStudents = studentsList.filter(
    (student) => !formData.students.includes(student.id)
  );
  const canSave =
    Object.values(validity).every(Boolean) && !isAddSectionLoading;

  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const onSaveSectionClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      setShowConfirmation(true);
    }
  };
  // This function handles the confirmed save action
  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);
    try {
      const response = await addNewSection(formData);
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
      triggerBanner("Failed to add section. Please try again.", "error");

      console.error("Error saving section:", error);
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };

  console.log(formData, "formData");
  const content = (
    <>
      <Academics />

      <form onSubmit={onSaveSectionClicked} className="form-container">
        <h2 className="formTitle ">
          Add New Section: {`${formData.sectionLabel}`}
        </h2>
        {/* Section Label */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Section Label{" "}
            {!validity.validSectionLabel && (
              <span className="text-red-600">*</span>
            )}
            <input
              aria-label="section label"
              aria-invalid={!validity.validSectionLabel}
              type="text"
              name="sectionLabel"
              value={formData.sectionLabel}
              onChange={handleInputChange}
              // className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="[3-20 letters]"
              required
              className={`mt-1 block w-full border ${
                validity.validSectionLabel
                  ? "border-gray-300"
                  : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
          </label>
        </div>
        {/* Section Color */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Section Color{" "}
            {!validity.validSectionColor && (
              <span className="text-red-600">*</span>
            )}
            <input
              aria-label="section color"
              type="color"
              name="sectionColor"
              value={formData.sectionColor}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md"
              required
            />
          </label>
        </div>

        {/* Section Type */}
        {/* <div>
            <label htmlFor=""  className="formInputLabel">
              Section Type{" "}
              {!validity.validSectionType && (
                <span className="text-red-600">*</span>
              )}
            </label>
            <select
              name="sectionType"
              value={formData.sectionType}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validSectionType ? "border-gray-300" : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              required
            >
              <option value="">Select Section Type</option>
              {["Nursery", "Collection", "Drop", "School"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div> */}
        {/* Animator Selection */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Animator{" "}
            {!validity.validSectionAnimator && (
              <span className="text-red-600">*</span>
            )}
            <select
              aria-invalid={!validity.validSectionAnimator}
              aria-label="section animator"
              name="sectionAnimator"
              value={formData.sectionAnimator}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sectionAnimator: e.target.value,
                }))
              }
              className={`mt-1 block w-full border ${
                validity.validSectionAnimator
                  ? "border-gray-300"
                  : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            >
              <option>Select Animator</option>
              {activeEmployeesList.map((animator) => (
                <option key={animator.employeeId} value={animator.employeeId}>
                  {animator?.userFullName.userFirstName}{" "}
                  {animator?.userFullName.userMiddleName}{" "}
                  {animator.userFullName.userLastName}
                </option>
              ))}
            </select>
          </label>
        </div>
        {/* Classroom Selection */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Classroom{" "}
            {!validity.validSectionLocation && (
              <span className="text-red-600">*</span>
            )}
            <select
              aria-invalid={!validity.validSectionLocation}
              aria-label="section location"
              name="sectionLocation"
              value={formData.sectionLocation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sectionLocation: e.target.value,
                }))
              }
              className={`mt-1 block w-full border ${
                validity.validSectionLocation
                  ? "border-gray-300"
                  : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            >
              <option>Select Classroom</option>
              {classroomsList.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.classroomNumber}-{classroom.classroomLabel}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Section From */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Section From{" "}
            {!validity.validSectionFrom && (
              <span className="text-red-600">*</span>
            )}
            <input
              aria-label="section from"
              aria-invalid={!validity.validSectionFrom}
              placeholder="[dd/mm/yyyy]"
              type="date"
              name="sectionFrom"
              value={formData.sectionFrom}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validSectionFrom ? "border-gray-300" : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              required
            />
          </label>
        </div>

        {/* Students Selection */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Select Students
            <select
              aria-label="section students"
              name="students"
              size="8"
              multiple
              onChange={handleStudentSelection}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            >
              {unselectedStudents.map((student) => {
                const grade =
                  student.studentYears.find(
                    (year) => year.academicYear === selectedAcademicYear?.title
                  )?.grade || "N/A";
                return (
                  <option key={student.id} value={student.id}>
                    Grade: {grade} - {student.studentName.firstName}{" "}
                    {student.studentName.middleName}{" "}
                    {student.studentName.lastName}
                  </option>
                );
              })}
            </select>
          </label>
        </div>

        {/* Selected Students */}
        <div className="selected-students mt-4">
          <label htmlFor="" formInputLabel>
            {formData.sectionLabel} section Students:{" "}
            {formData?.students.length}
            <ul className="selected-students-list">
              {formData.students.map((studentId) => {
                const student = studentsList.find((s) => s.id === studentId);
                const grade =
                  student?.studentYears.find(
                    (year) => year.academicYear === selectedAcademicYear?.title
                  )?.grade || "N/A";

                return (
                  <li
                    key={studentId}
                    onClick={() => handleRemoveStudent(studentId)}
                    className="cursor-pointer text-blue-600 hover:underline"
                  >
                    {student?.studentName.firstName}{" "}
                    {student?.studentName.middleName}{" "}
                    {student?.studentName.lastName} - Grade: {grade}
                  </li>
                );
              })}
            </ul>{" "}
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            aria-label="cancel new section"
            type="button"
            onClick={() => navigate("/academics/sections/nurserySectionsList/")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            aria-label="submit form"
            disabled={!canSave || isAddSectionLoading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              canSave ? "save-button" : "bg-gray-400 cursor-not-allowed"
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

export default NewSectionForm;
