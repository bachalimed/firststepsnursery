import { useState, useEffect } from "react";
import { useAddNewSectionMutation } from "./sectionsApiSlice";
import { useNavigate } from "react-router-dom";
import Academics from "../Academics";
import useAuth from "../../../hooks/useAuth";
import { useSelector } from "react-redux";
import { useGetClassroomsQuery } from "../../AppSettings/AcademicsSet/Classrooms/classroomsApiSlice";
import { useGetEmployeesByYearQuery } from "../../HR/Employees/employeesApiSlice";
import { useGetStudentsByYearQuery } from "../../Students/StudentsAndParents/Students/studentsApiSlice";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { OBJECTID_REGEX, DATE_REGEX, NAME_REGEX } from "../../../config/REGEX";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
const NewSectionForm = () => {
  useEffect(()=>{document.title="New Section"})

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
      setFormData({});
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
      if ( response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      }
      else if (response?.data?.message ) {
        // Success response
        triggerBanner(response?.data?.message, "success");
      } else if (response?.error?.data?.message) {
        // Error response
        triggerBanner(response?.error?.data?.message, "error");
      } else if (isAddSectionError) {
        // In case of unexpected response format
        triggerBanner(addSectionError?.data?.message, "error");
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

  //console.log(formData, "formData");

  let content;
  if (isStudentLoading || isEmployeesLoading || isClassroomsLoading) {
    content = (
      <>
        <Academics />
        <LoadingStateIcon />
      </>
    );
  }
  if (isStudentSuccess && isEmployeesSuccess && isClassroomsSuccess) {
    content = (
      <>
        <Academics />

        <form onSubmit={onSaveSectionClicked} className="form-container">
          <h2 className="formTitle ">
            New Section: {`${formData.sectionLabel}`}
          </h2>
          <div className="formSectionContainer">
            <h3 className="formSectionTitle">Section Details</h3>
            <div className="formSection">
              <div className="formLineDiv">
                {/* Section Label */}

                <label htmlFor="sectionLabel" className="formInputLabel">
                  Section Label{" "}
                  {!validity.validSectionLabel && (
                    <span className="text-red-600">*</span>
                  )}
                  <input
                    aria-label="section label"
                    aria-invalid={!validity.validSectionLabel}
                    type="text"
                    id="sectionLabel"
                    name="sectionLabel"
                    value={formData.sectionLabel}
                    onChange={handleInputChange}
                    // className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="[3-25 letters]"
                    required
                    className={`formInputText`}
                  />
                </label>
                {/* Section From */}

                <label htmlFor="sectionFrom" className="formInputLabel">
                  Section From{" "}
                  {!validity.validSectionFrom && (
                    <span className="text-red-600">*</span>
                  )}
                  <input
                    aria-label="section from"
                    aria-invalid={!validity.validSectionFrom}
                    placeholder="[dd/mm/yyyy]"
                    type="date"
                    id="sectionFrom"
                    name="sectionFrom"
                    value={formData.sectionFrom}
                    onChange={handleInputChange}
                    className={`formInputText`}
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
              <div className="formLineDiv">
                <label htmlFor="sectionAnimator" className="formInputLabel">
                  Animator{" "}
                  {!validity.validSectionAnimator && (
                    <span className="text-red-600">*</span>
                  )}
                  <select
                    aria-invalid={!validity.validSectionAnimator}
                    aria-label="section animator"
                    id="sectionAnimator"
                    name="sectionAnimator"
                    value={formData.sectionAnimator}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sectionAnimator: e.target.value,
                      }))
                    }
                    className={`formInputText`}
                  >
                    <option>Select Animator</option>
                    {activeEmployeesList.map((animator) => (
                      <option
                        key={animator.employeeId}
                        value={animator.employeeId}
                      >
                        {animator?.userFullName.userFirstName}{" "}
                        {animator?.userFullName.userMiddleName}{" "}
                        {animator.userFullName.userLastName}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Classroom Selection */}

                <label htmlFor="sectionLocation" className="formInputLabel">
                  Classroom{" "}
                  {!validity.validSectionLocation && (
                    <span className="text-red-600">*</span>
                  )}
                  <select
                    aria-invalid={!validity.validSectionLocation}
                    aria-label="section location"
                    id="sectionLocation"
                    name="sectionLocation"
                    value={formData.sectionLocation}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sectionLocation: e.target.value,
                      }))
                    }
                    className={`formInputText`}
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
              {/* Section Color */}

              <label htmlFor="sectionColor" className="formInputLabel">
                Section Color{" "}
                {!validity.validSectionColor && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="section color"
                  type="color"
                  id="sectionColor"
                  name="sectionColor"
                  value={formData.sectionColor}
                  onChange={handleInputChange}
                  className="block w-full rounded-md"
                  required
                />
              </label>
            </div>
          </div>

          {/* Students Selection */}
          <h3 className="formSectionTitle">Section Details</h3>
          <div className="formSection">
            <label htmlFor="students" className="formInputLabel">
              Select Students
              <select
                aria-label="section students"
                id="students"
                name="students"
                size="8"
                multiple
                onChange={handleStudentSelection}
                className={`formInputText`}
              >
                {unselectedStudents.map((student) => {
                  const grade =
                    student.studentYears.find(
                      (year) =>
                        year.academicYear === selectedAcademicYear?.title
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
          <h3 className="formSectionTitle">
            {" "}
            Section {formData.sectionLabel} students:{" "}
            {formData?.students?.length}
          </h3>
          <div className="formSection">
            <ul className="selected-students-list formLineDiv">
              {formData.students.map((studentId) => {
                const student = studentsList.find((s) => s.id === studentId);
                const grade =
                  student?.studentYears.find(
                    (year) => year.academicYear === selectedAcademicYear?.title
                  )?.grade || "N/A";

                return (
                
                    <li
                      id={studentId}
                      name={studentId}
                      key={studentId}
                      onClick={() => handleRemoveStudent(studentId)}
                      className="flex flex-col gap-2  hover:bg-gray-50 rounded-md items-center w-full"
                    >
                      <div className="flex flex-row w-full">
                        <span className="flex-1 rounded-md border border-sky-700 px-3 py-1 text-sky-700 hover:bg-sky-700 hover:text-white transition-colors duration-200">
                          {student?.studentName.firstName}{" "}
                          {student?.studentName.middleName}{" "}
                          {student?.studentName.lastName} - Grade: {grade}
                        </span>
                      </div>
                    </li>
                 
                );
              })}
            </ul>{" "}
          </div>

          {/* Submit Button */}
          <div className="cancelSavebuttonsDiv">
            <button
              aria-label="cancel new section"
              type="button"
              onClick={() =>
                navigate("/academics/sections/nurserySectionsList/")
              }
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              aria-label="submit form"
              disabled={!canSave || isAddSectionLoading}
              className={`save-button`}
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
  }
  return content;
};

export default NewSectionForm;
