import React from "react";
import Students from "../../Students";
import { useState, useEffect } from "react";
import { useUpdateStudentMutation } from "./studentsApiSlice";
import { useGetAttendedSchoolsQuery } from "../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import { useNavigate, useOutletContext } from "react-router-dom";

import { ROLES } from "../../../../config/UserRoles";
import { ACTIONS } from "../../../../config/UserActions";
import useAuth from "../../../../hooks/useAuth";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useSelector } from "react-redux";
import { selectAllAcademicYears } from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";

import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { NAME_REGEX, DATE_REGEX } from "../../../../config/REGEX";

const EditStudentForm = ({ student }) => {
  //initialising state variables and hooks
  const navigate = useNavigate();

  const [id, setId] = useState(student.id);
  const { userId, canEdit, canDelete, canAdd, canCreate, isParent, status2 } =
    useAuth();

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  //initialising the function
  const [
    updateStudent,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateStudentMutation(); //it will not execute the mutation nownow but when called

  const {
    data: attendedSchoolsList,
    isLoading: schoolIsLoading,
    isSuccess: schoolIsSuccess,
    isError: schoolIsError,
    error: schoolError,
  } = useGetAttendedSchoolsQuery({ endpointName: "EditStudentForm" } || {}, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let attendedSchools;
  if (schoolIsSuccess) {
    const { entities } = attendedSchoolsList;
    attendedSchools = Object.values(entities);
    //console.log(attendedSchools)
  }

  //initialisation of states for each input
  const [studentName, setStudentName] = useState(student.studentName);
  const [firstName, setFirstName] = useState(student.studentName.firstName);
  const [validFirstName, setValidFirstName] = useState(false);
  const [middleName, setMiddleName] = useState(student.studentName.middleName);
  const [lastName, setLastName] = useState(student.studentName.lastName);
  const [validLastName, setValidLastName] = useState(false);
  const [studentDob, setStudentDob] = useState(
    student.studentDob.split("T")[0]
  );
  const [validStudentDob, setValidStudentDob] = useState(false);
  const [studentSex, setStudentSex] = useState(student.studentSex);
  const [studentIsActive, setStudentIsActive] = useState(
    student.studentIsActive
  );
  const [studentYears, setStudentYears] = useState(student.studentYears);
  // const [studentJointFamily, setStudentJointFamily] = useState(student.studentJointFamily)
  const [validStudentGrade, setValidStudentGrade] = useState(false);
  const [studentGardien, setStudentGardien] = useState(student.studentGardien); //an object
  const [gardienFirstName, setGardienFirstName] = useState(
    student.studentGardien.gardienFirstName
  );
  const [gardienMiddleName, setgardienMiddleName] = useState(
    student.studentGardien.gardienMiddleName
  );
  const [gardienLastName, setGardienLastName] = useState(
    student.studentGardien.gardienLastName
  );
  const [gardienPhone, setGardienPhone] = useState(
    student.studentGardien.gardienPhone
  );
  const [gardienRelation, setGardienRelation] = useState(
    student.studentGardien.gardienRelation
  );

  const [studentEducation, setStudentEducation] = useState(
    student.studentEducation
  );
  const [schoolYear, setSchoolYear] = useState(student.schoolYear);
  const [attendedSchool, setAttendedSchool] = useState(student.attendedSchool);
  const [note, setNote] = useState(student.note);

  const [operator, setOperator] = useState(userId); //id of the user logged in already

  //use effect is used to validate the inputs against the defined REGEX above
  //the previous constrains have to be verified on the form for teh user to know
  useEffect(() => {
    setValidStudentGrade(
      studentYears.some(
        (year) =>
          year.academicYear === selectedAcademicYear.title &&
          ["0", "1", "2", "3", "4", "5", "6"].includes(year.grade) // Convert to number for comparison
      )
    );
  }, [studentYears, selectedAcademicYear.title]);
  console.log(studentYears);
  useEffect(() => {
    setValidFirstName(NAME_REGEX.test(firstName));
  }, [firstName]);

  useEffect(() => {
    setValidLastName(NAME_REGEX.test(lastName));
  }, [lastName]);

  useEffect(() => {
    setValidStudentDob(DATE_REGEX.test(studentDob));
  }, [studentDob]);

  useEffect(() => {
    if (isUpdateSuccess) {
      //if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
      console.log("updated!!!!!!");
      setId(student.id);
      setFirstName("");
      setValidFirstName(false);
      setMiddleName("");
      setLastName("");
      setValidLastName(false);
      setStudentName({ firstName: "", middleName: "", lastName: "" });
      setStudentDob("");
      setValidStudentDob("");
      setStudentSex("");
      setStudentIsActive(false);
      setStudentYears([]); //will be true when the username is validated
      setValidStudentGrade(false);
      // setStudentJointFamily('')
      setGardienFirstName("");
      setgardienMiddleName("");
      setGardienLastName("");
      setGardienPhone("");
      setGardienRelation("");
      setStudentGardien({});
      setSchoolYear("");
      setAttendedSchool("");
      setNote("");
      setStudentEducation([]);
      setOperator("");
      navigate("/students/studentsParents/students/"); //will navigate here after saving
    }
  }, [isUpdateSuccess, navigate]); //even if no success it will navigate and not show any warning if failed or success

  //handlers to get the individual states from the input

  const onFirstNameChanged = (e) => setFirstName(e.target.value);
  const onMiddleNameChanged = (e) => setMiddleName(e.target.value);
  const onLastNameChanged = (e) => setLastName(e.target.value);
  const onStudentDobChanged = (e) => setStudentDob(e.target.value);
  const onStudentSexChanged = (e) => setStudentSex(e.target.value);
  const onStudentIsActiveChanged = (e) => setStudentIsActive((prev) => !prev);
  //const onStudentJointFamilyChanged = e => setStudentJointFamily(prev=>!prev)
  const onGardienFirstNameChanged = (e) => setGardienFirstName(e.target.value);
  const onGardienMiddleNameChanged = (e) =>
    setgardienMiddleName(e.target.value);
  const onGardienLastNameChanged = (e) => setGardienLastName(e.target.value);
  const onGardienPhoneChanged = (e) => setGardienPhone(e.target.value);
  const onGardienRelationChanged = (e) => setGardienRelation(e.target.value);
  const onSchoolYearChanged = (e) => setSchoolYear(e.target.value);
  const onAttendedSchoolChanged = (e) => setAttendedSchool(e.target.value);
  const onNoteChanged = (e) => setNote(e.target.value);

  useEffect(() => {
    setStudentName({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
    });
  }, [firstName, middleName, lastName]);

  // Handler to update an entry field
  const handleGardienFieldChange = (index, field, value) => {
    // Create a deep copy of the studentGardien array
    const updatedEntries = studentGardien.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );

    // Update the state with the new array
    setStudentGardien(updatedEntries);
  };

  // Handler to add a new education entry
  const handleAddGardienEntry = () => {
    setStudentGardien([
      ...studentGardien,
      {
        gardienFirstName: "",
        gardienMiddleName: "",
        gardienLastName: "",
        gardienPhone: "",
        gardienRelation: "",
        gardienYear: "",
      },
    ]);
  };

  // Handler to remove an education entry
  const handleRemoveGardienEntry = (index) => {
    const updatedEntries = studentGardien.filter((_, i) => i !== index);
    setStudentGardien(updatedEntries);
  };

  // to deal with student education entries:
  // Handler to update an entry field
  const handleFieldChange = (index, field, value) => {
    const updatedEntries = studentEducation.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    setStudentEducation(updatedEntries);
  };

  // Handler to add a new education entry
  const handleAddEntry = () => {
    setStudentEducation([
      ...studentEducation,
      { schoolYear: "", attendedSchool: "", note: "" },
    ]);
  };

  // Handler to remove an education entry
  const handleRemoveEntry = (index) => {
    const updatedEntries = studentEducation.filter((_, i) => i !== index);
    setStudentEducation(updatedEntries);
  };

  const onStudentGradeChanged = (e) => {
    const selectedGrade = e.target.value;

    setStudentYears((prevYears) =>
      prevYears.map(
        (year) =>
          year.academicYear === selectedAcademicYear?.title
            ? { ...year, grade: selectedGrade } // Update the grade for the selected academic year
            : year // Keep other years unchanged
      )
    );
  };

  const validCurrentEducation = () => {
    // Check if there is a valid entry for the given academic year
    return studentEducation.some(
      (entry) =>
        entry.schoolYear === selectedAcademicYear.title && entry.attendedSchool
    );
  };
  //to check if we can save before onsave, if every one is true, and also if we are not loading status
  const canSave =
    [
      validCurrentEducation(),
      validFirstName,
      validLastName,
      validStudentDob,
      studentSex,
    ].every(Boolean) && !isUpdateLoading;

  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const onUpdateStudentClicked = async (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);
    //generate the objects before saving
    const toSave = {
      id,
      studentName,
      studentDob,
      studentSex,
      studentIsActive,
      studentYears,
      studentEducation,
      studentGardien,
      operator,
    };
    try {
      const response = await updateStudent({
        id,
        studentName,
        studentDob,
        studentSex,
        studentIsActive,
        studentYears,
        studentEducation,
        studentGardien,
        operator,
      }); //we call the add new user mutation and set the arguments to be saved
      //added this to confirm save
      console.log(response, "response");
      if (response.data && response.data.message) {
        // Success response
        triggerBanner(response.data.message, "success");
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
      triggerBanner("Failed to update student. Please try again.", "error");

      console.error("Error saving:", error);
    }
  };
  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  const handleCancel = () => {
    navigate("/students/studentsParents/students/");
  };

  let content;

  content = schoolIsSuccess && (
    <>
      <Students />

      <form className="form-container" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2 className="text-2xl font-semibold">
            Editing {firstName} {middleName} {lastName} Profile
          </h2>
        </div>

        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label
              className="block text-sm font-medium text-gray-800"
              htmlFor="firstName"
            >
              First Name{" "}
              {!validFirstName && <span className="text-red-600 ">*</span>}
              <input
                aria-invalid={!validFirstName}
                placeholder="[3-20 letters]"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-800 sm:text-sm"
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="off"
                value={firstName}
                onChange={onFirstNameChanged}
                required
              />{" "}
            </label>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-800"
              htmlFor="middleName"
            >
              Middle Name
              <input
                placeholder="[3-20 letters]"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-800 sm:text-sm"
                id="middleName"
                name="middleName"
                type="text"
                autoComplete="off"
                value={middleName}
                onChange={onMiddleNameChanged}
              />{" "}
            </label>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-800"
              htmlFor="lastName"
            >
              Last Name{" "}
              {!validLastName && <span className="text-red-600">*</span>}
              <input
                aria-invalid={!validLastName}
                placeholder="[3-20 letters]"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-800 sm:text-sm"
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="off"
                value={lastName}
                onChange={onLastNameChanged}
                required
              />
            </label>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-800"
              htmlFor="studentDob"
            >
              Date Of Birth{" "}
              {!validStudentDob && <span className="text-red-600">*</span>}
              <span className="text-gray-500 text-xs"></span>
              <input
                aria-invalid={!validStudentDob}
                placeholder="[dd/mm/yyyy]"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-800 sm:text-sm"
                id="studentDob"
                name="studentDob"
                type="date"
                autoComplete="off"
                value={studentDob}
                onChange={onStudentDobChanged}
                required
              />
            </label>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
          <label
              htmlFor="male"
              className="ml-2 text-sm font-medium text-gray-800"
            >
              Male
            <input
              type="checkbox"
              id="male"
              value="Male"
              checked={studentSex === "Male"}
              onChange={onStudentSexChanged}
              className="h-4 w-4 text-blue-600 focus:ring-sky-800 border-gray-300 rounded"
            />
            
            </label>
            <label
              htmlFor="female"
              className="ml-2 text-sm font-medium text-gray-800"
            >
              Female
            <input
              type="checkbox"
              id="female"
              value="Female"
              checked={studentSex === "Female"}
              onChange={onStudentSexChanged}
              className="ml-6 h-4 w-4 text-blue-600 focus:ring-sky-800 border-gray-300 rounded"
            />
            
            </label>
          </div>

          <div className="flex items-center mb-2">
            <label
              htmlFor="active"
              className="ml-2 text-sm font-medium text-gray-800"
            >
              Student Is Active
              <input
                type="checkbox"
                id="active"
                value={studentIsActive}
                checked={studentIsActive}
                onChange={onStudentIsActiveChanged}
                className="h-4 w-4 text-blue-600 focus:ring-sky-800 border-gray-300 rounded"
              />
            </label>
          </div>
          <div className="flex items-center mb-2">
            {studentYears.some(
              (year) => year.academicYear === selectedAcademicYear?.title
            ) && (
              <div className="mb-6">
                <label
                  htmlFor="studentGrade"
                  className="block text-sm font-medium text-gray-800"
                >
                  Grade{" "}
                  {!validStudentGrade && (
                    <span className="text-red-600">*</span>
                  )}
                  <select
                    aria-invalid={!validStudentGrade}
                    id="studentGrade"
                    value={
                      studentYears.find(
                        (year) =>
                          year.academicYear === selectedAcademicYear?.title
                      )?.grade || ""
                    }
                    onChange={onStudentGradeChanged}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Grade</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((grade) => (
                      <option key={grade} value={grade}>
                        Grade {grade}
                      </option>
                    ))}
                  </select>{" "}
                </label>
              </div>
            )}
          </div>

          {/* <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="jointFAmily"
                  value={studentJointFamily}
                  checked={studentJointFamily}
                  onChange={onStudentJointFamilyChanged}
                  className="h-4 w-4 text-blue-600 focus:ring-sky-700 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">Student Joint Family</label>
              </div> */}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Student Gardien</h3>
          {Array.isArray(studentGardien) &&
            studentGardien.length > 0 &&
            studentGardien.map((entry, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4"
              >
                <div className="mb-2">
                  <label
                    className="block text-sm font-medium text-gray-800"
                    htmlFor={`gardienFirstName-${index}`}
                  >
                    First Name:
                    <input
                      id={`gardienFirstName-${index}`}
                      type="text"
                      value={entry.gardienFirstName}
                      onChange={(e) =>
                        handleGardienFieldChange(
                          index,
                          "gardienFirstName",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm"
                    />
                  </label>
                </div>
                <div className="mb-2">
                  <label
                    className="block text-sm font-medium text-gray-800"
                    htmlFor={`gardienMiddleName-${index}`}
                  >
                    Middle Name:
                    <input
                      id={`gardienMiddleName-${index}`}
                      type="text"
                      value={entry.gardienMiddleName}
                      onChange={(e) =>
                        handleGardienFieldChange(
                          index,
                          "gardienMiddleName",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm"
                    />{" "}
                  </label>
                </div>
                <div className="mb-2">
                  <label
                    className="block text-sm font-medium text-gray-800"
                    htmlFor={`gardienLastName-${index}`}
                  >
                    Last Name:
                    <input
                      id={`gardienLastName-${index}`}
                      type="text"
                      value={entry.gardienLastName}
                      onChange={(e) =>
                        handleGardienFieldChange(
                          index,
                          "gardienLastName",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm"
                    />{" "}
                  </label>
                </div>
                <div className="mb-2">
                  <label
                     className="formInputLabel"
                    htmlFor={`gardienYear-${index}`}
                  >
                    gardienYear:
                    <select
                      id={`gardienYear-${index}`}
                      value={entry.gardienYear}
                      onChange={(e) =>
                        handleGardienFieldChange(
                          index,
                          "gardienYear",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm"
                    >
                      {academicYears.map((year, i) => (
                        <option key={year.id} value={year.title}>
                          {year.title}
                        </option>
                      ))}
                    </select>{" "}
                  </label>
                </div>

                <div className="mb-2">
                  <label
                     className="formInputLabel"
                    htmlFor={`gardienRelation-${index}`}
                  >
                    Relation To Student :
                    <input
                      id={`gardienRelation-${index}`}
                      type="text"
                      value={entry.gardienRelation}
                      onChange={(e) =>
                        handleGardienFieldChange(
                          index,
                          "gardienRelation",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm"
                    />{" "}
                  </label>
                </div>
                <div className="mb-2">
                  <label
                     className="formInputLabel"
                    htmlFor={`gardienPhone-${index}`}
                  >
                    Phone Number:
                    <input
                      id={`gardienPhone-${index}`}
                      type="text"
                      value={entry.gardienPhone}
                      onChange={(e) =>
                        handleGardienFieldChange(
                          index,
                          "gardienPhone",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm"
                    />{" "}
                  </label>
                </div>

                <button
                  type="button"
                  aria-label="delete student gardien"
                  onClick={() => handleRemoveGardienEntry(index)}
                  className="delete-button"
                >
                  Remove Entry
                </button>
              </div>
            ))}
          <button
            type="add-button"
            aria-label="add student gardien"
            className="add-button"
            onClick={handleAddGardienEntry}
          >
            Add Student Gardien
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Student Education</h3>
          {Array.isArray(studentEducation) &&
            studentEducation.length > 0 &&
            studentEducation.map((entry, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4"
              >
                <div className="mb-2">
                  <label
                     className="formInputLabel"
                    htmlFor={`schoolYear-${index}`}
                  >
                    School Year:
                    <select
                      id={`schoolYear-${index}`}
                      value={entry.schoolYear}
                      onChange={(e) =>
                        handleFieldChange(index, "schoolYear", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm"
                    >
                      <option value="">Select Year</option>
                      {academicYears.map((year, i) => (
                        <option key={year.id} value={year.title}>
                          {year.title}
                        </option>
                      ))}
                    </select>{" "}
                  </label>
                </div>
                <div className="mb-2">
                  <label
                     className="formInputLabel"
                    htmlFor={`attendedSchool-${index}`}
                  >
                    Attended School:
                    <select
                      id={`attendedSchool-${index}`}
                      value={entry.attendedSchool}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "attendedSchool",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm"
                    >
                      <option value="">Select School</option>
                      {schoolIsSuccess &&
                        attendedSchools.map((school) => (
                          <option key={school.id} value={school.id}>
                            {school.schoolName}
                          </option>
                        ))}
                    </select>{" "}
                  </label>
                </div>
                <div className="mb-2">
                  <label
                     className="formInputLabel"
                    htmlFor={`note-${index}`}
                  >
                    Note:
                    <input
                      id={`note-${index}`}
                      type="text"
                      value={entry.note}
                      onChange={(e) =>
                        handleFieldChange(index, "note", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  aria-label="remove student education"
                  onClick={() => handleRemoveEntry(index)}
                  className="delete-button"
                >
                  Remove Entry
                </button>
              </div>
            ))}
          <button
            type="button"
            className="add-button"
            onClick={handleAddEntry}
            aria-label="add student education"
          >
            Add Student Education
          </button>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            aria-label="cancel editing"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="save-button"
            aria-label="save changes"
            title="Save"
            onClick={onUpdateStudentClicked}
            disabled={!canSave || isUpdateLoading}
          >
            Save Changes
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

export default EditStudentForm;
