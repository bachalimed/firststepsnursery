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
import {
  OBJECTID_REGEX,
  DATE_REGEX,
  NAME_REGEX,
} from "../../../config/REGEX"
//constrains on inputs when creating new user

const NewSectionForm = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  //console.log(selectedAcademicYear.title, "selectedAcademicYear");
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
    isLoading: isEmployeesLoading, //monitor several situations is loading...
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
      //this param will be passed in req.params to select only employees for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );
  const {
    data: classrooms, //the data is renamed sessions
    isLoading: isClassroomsLoading, //monitor several situations is loading...
    isSuccess: isClassroomsSuccess,
    isError: isClassroomsError,
    error: classroomsError,
  } = useGetClassroomsQuery(
    {
      endpointName: "NewSectionForm",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );
  const {
    data: students, //the data is renamed students
    isLoading: isStudentLoading, //monitor several situations is loading...
    isSuccess: isStudentSuccess,
    isError: isStudentError,
    error: studentError,
  } = useGetStudentsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewSectionForm",
    } || {},
    {
      //this param will be passed in req.params to select only students for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      // pollingInterval: 60000, //will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );
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

  const onSaveSectionClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        await addNewSection(formData);
      } catch (err) {
        console.error("Failed to save the section:", err);
      }
    }
  };
  const handleCancel = () => {
    navigate("/academics/sections/sections/");
  };
  console.log(formData, "formData");
  const content = (
    <>
      <Academics />

      <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Add New Section: {`${formData.sectionLabel}`}
        </h2>
        {isAddSectionError && (
          <p className="text-red-500">
            Error: {addSectionError?.data?.message}
          </p>
        )}
        <form onSubmit={onSaveSectionClicked} className="space-y-6">
          {/* Section Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Section Label{" "}
              {!validity.validSectionLabel && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="text"
              name="sectionLabel"
              value={formData.sectionLabel}
              onChange={handleInputChange}
              // className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter Section Label"
              required
              className={`mt-1 block w-full border ${
                validity.validSectionLabel
                  ? "border-gray-300"
                  : "border-red-500"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
          </div>
          {/* Section Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Section Color{" "}
              {!validity.validSectionColor && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="color"
              name="sectionColor"
              value={formData.sectionColor}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md"
              required
            />
          </div>

          {/* Section Type */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Section Type{" "}
              {!validity.validSectionType && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <select
              name="sectionType"
              value={formData.sectionType}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validSectionType ? "border-gray-300" : "border-red-500"
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
            <label className="block text-sm font-medium text-gray-700">
              Animator{" "}
              {!validity.validSectionAnimator && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <select
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
                  : "border-red-500"
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
          </div>
          {/* Classroom Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Classroom{" "}
              {!validity.validSectionLocation && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <select
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
                  : "border-red-500"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            >
              <option>Select Classroom</option>
              {classroomsList.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.classroomNumber}-{classroom.classroomLabel}
                </option>
              ))}
            </select>
          </div>

          {/* Section From */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Section From{" "}
              {!validity.validSectionFrom && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="date"
              name="sectionFrom"
              value={formData.sectionFrom}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validSectionFrom ? "border-gray-300" : "border-red-500"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              required
            />
          </div>

          {/* Students Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Students
            </label>
            <select
              name="students"
              size="8"
              multiple
              onChange={handleStudentSelection}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            >
              {unselectedStudents.map((student) => {
                const grade =
                  student.studentYears.find(
                    (year) => year.academicYear === selectedAcademicYear.title
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
          </div>

          {/* Selected Students */}
          <div className="selected-students mt-4">
            <label className="block text-lg font-medium  text-gray-700">
              {formData.sectionLabel} section Students:{" "}
              {formData?.students.length}
            </label>
            <ul className="selected-students-list">
              {formData.students.map((studentId) => {
                const student = studentsList.find((s) => s.id === studentId);
                const grade =
                  student?.studentYears.find(
                    (year) => year.academicYear === selectedAcademicYear.title
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
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() =>
                navigate("/academics/sections/nurserySectionsList/")
              }
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave}
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
      </section>
    </>
  );
  return content;
};

export default NewSectionForm;
