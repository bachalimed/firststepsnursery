import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Students from "../../Students";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetAttendedSchoolsQuery } from "../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import { useState, useEffect } from "react";
import { useAddNewStudentMutation } from "./studentsApiSlice";
import { ROLES } from "../../../../config/UserRoles";
import { ACTIONS } from "../../../../config/UserActions";
import useAuth from "../../../../hooks/useAuth";
import { useSelector } from "react-redux";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { selectAllAcademicYears } from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { NAME_REGEX, DATE_REGEX } from "../../../../config/REGEX";

const NewStudentForm = () => {
  const naviagte = useNavigate();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const [
    addNewStudent,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading,
      isSuccess,
      isError,
      error,
    },
  ] = useAddNewStudentMutation(); //it will not execute the mutation nownow but when called

  //prepare the permission variables
  const { userId, canEdit, canDelete, canAdd, canCreate, isParent, status2 } =
    useAuth();

  const {
    data: attendedSchoolsList,
    isLoading: schoolIsLoading,
    isSuccess: schoolIsSuccess,
    isError: schoolIsError,
    error: schoolError,
  } = useGetAttendedSchoolsQuery({ endpointName: "NewStudentForm" } || {}, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let attendedSchools;
  if (schoolIsSuccess) {
    const { entities } = attendedSchoolsList;
    attendedSchools = Object.values(entities);
  }
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);

  //initialisation of states for each input
  const [studentName, setStudentName] = useState({});
  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [studentDob, setStudentDob] = useState("");
  const [validStudentDob, setValidStudentDob] = useState("");
  const [studentSex, setStudentSex] = useState("");
  const [studentIsActive, setStudentIsActive] = useState((prev) => !prev);

  //const [validStudentGrade, setValidStudentGrade] = useState(false);
  const [studentGrade, setStudentGrade] = useState(null);
  const [academicYear, setAcademicYear] = useState(null);
  const [studentYears, setStudentYears] = useState([]);
  //const [studentJointFamily, setStudentJointFamily] = useState(true)
  const [studentGardien, setStudentGardien] = useState([]);
  const [gardienYear, setGardienYear] = useState("");
  const [gardienFirstName, setGardienFirstName] = useState("");
  const [gardienMiddleName, setgardienMiddleName] = useState("");
  const [gardienLastName, setGardienLastName] = useState("");
  const [gardienPhone, setGardienPhone] = useState("");
  const [gardienRelation, setGardienRelation] = useState("");

  const [schoolYear, setSchoolYear] = useState("");
  const [note, setNote] = useState("");
  const [attendedSchool, setAttendedSchool] = useState("");
  const [studentEducation, setStudentEducation] = useState([]);

  const [operator, setOperator] = useState(userId); //id of the user logged in already

  //use effect is used to validate the inputs against the defined REGEX above
  //the previous constrains have to be verified on the form for teh user to know

  useEffect(() => {
    setValidFirstName(NAME_REGEX.test(firstName));
  }, [firstName]);

  useEffect(() => {
    setValidLastName(NAME_REGEX.test(lastName));
  }, [lastName]);

  useEffect(() => {
    setValidStudentDob(DATE_REGEX.test(studentDob));
  }, [studentDob]);
  //ensure studentEducation has no empty array

  useEffect(() => {
    if (isSuccess) {
      //if the add of new user using the mutation is success, empty all the individual states and naviagte back to the users list
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
      setStudentYears(""); //will be true when the username is validated
      setValidCurrentEducation(false);
      //setStudentJointFamily(true)
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
      //setDate = useState()
      setOperator("");
      naviagte("/students/studentsParents/students"); //will naviagte here after saving
    }
  }, [isSuccess, naviagte]); //even if no success it will naviagte and not show any warning if failed or success

  //handlers to get the individual states from the input

  const onFirstNameChanged = (e) => setFirstName(e.target.value);
  const onMiddleNameChanged = (e) => setMiddleName(e.target.value);
  const onLastNameChanged = (e) => setLastName(e.target.value);
  const onStudentDobChanged = (e) => setStudentDob(e.target.value);
  const onStudentSexChanged = (e) => setStudentSex(e.target.value);
  const onStudentIsActiveChanged = (e) => setStudentIsActive((prev) => !prev);
  const onGardienFirstNameChanged = (e) => setGardienFirstName(e.target.value);
  const onGardienMiddleNameChanged = (e) =>
    setgardienMiddleName(e.target.value);
  const onGardienLastNameChanged = (e) => setGardienLastName(e.target.value);
  const onGardienPhoneChanged = (e) => setGardienPhone(e.target.value);
  const onGardienRelationChanged = (e) => setGardienRelation(e.target.value);
  const onSchoolYearChanged = (e) => setSchoolYear(e.target.value);
  const onAttendedSchoolChanged = (e) => setAttendedSchool(e.target.value);
  const onNoteChanged = (e) => setNote(e.target.value);
  const onStudentEducationChanged = (e) => setStudentEducation(e.target.value);

  //adds to the previous entries in arrays for gardien, schools...
  const onAcademicYearChanged = (e) => {
    const { value, checked } = e.target;
    setStudentYears((prevYears) =>
      checked
        ? [...prevYears, { academicYear: value }]
        : prevYears.filter((year) => year.academicYear !== value)
    );
  };

  // Update the grade of the selected academic year
  const onStudentGradeChanged = (e) => {
    const value = e.target.value;
    setStudentYears((prevYears) =>
      prevYears.map((year) =>
        year.academicYear === selectedAcademicYear?.title
          ? { ...year, grade: value }
          : year
      )
    );
  };

  // to deal with student gardien entries:
  // Handler to update an entry field
  const handleGardienFieldChange = (index, field, value) => {
    const updatedEntries = [...studentGardien];
    updatedEntries[index][field] = value;
    setStudentGardien(updatedEntries);
  };

  // Handler to add a new gardien entry
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

  // Handler to remove an gardien entry
  const handleRemoveGardienEntry = (index) => {
    const updatedEntries = studentGardien.filter((_, i) => i !== index);
    setStudentGardien(updatedEntries);
  };

  // to deal with student education entries:
  // Handler to update an entry field
  const handleFieldChange = (index, field, value) => {
    const updatedEntries = [...studentEducation];
    updatedEntries[index][field] = value;
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

  useEffect(() => {
    setStudentName({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
    });
  }, [firstName, middleName, lastName]);

  //check if an entry is set for educatin on the academic year, it is mandatory to avoid issued with plannings

  const [validCurrentEducation, setValidCurrentEducation] = useState(false); //to check if we have an attended school for the selectedacademicyear, will be needed for scheduling
  // Check if there is a valid entry for the given academic year

  useEffect(() => {
    setValidCurrentEducation(
      studentEducation.some(
        (year) =>
          year.schoolYear === selectedAcademicYear?.title &&
          year.attendedSchool !== ""
      )
    );
  }, [studentEducation, selectedAcademicYear?.title]);

  //to check if we can save before onsave, if every one is true, and also if we are not loading status
  const canSave =
    [
      validCurrentEducation,
      validFirstName,
      validLastName,
      studentYears,
      validStudentDob,
      studentSex,
    ].every(Boolean) && !isLoading;

  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const onSaveStudentClicked = async (e) => {
    e.preventDefault();

    if (canSave) {
      // Show the confirmation modal before saving
      setShowConfirmation(true);
    }
  };

  // This function handles the confirmed save action
  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);

    // Proceed with saving the student data
    try {
      const response = await addNewStudent({
        studentName,
        studentDob,
        studentSex,
        studentIsActive,
        studentYears,
        studentEducation,
        studentGardien,
        operator,
      });
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
      triggerBanner("Failed to add student. Please try again.", "error");

      console.error("Error saving:", error);
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    naviagte("/students/studentsParents/students/");
  };

  const content = (
    <>
      <Students />
      {/* Display status message */}
      {/* {showMessage && (
        <p
          className={`mt-4 text-center ${
            statusType === "success" ? "text-green-500" : "text-red-600"
          }`}
        >
          {statusMessage}
        </p>
      )} */}
      <form
        className="form-container"
        onSubmit={onSaveStudentClicked}
      >
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">
            New student for the academic year {selectedAcademicYear?.title}
          </h2>
        </div>

        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="firstName"
            >
              First Name{" "}
              {!validFirstName && <span className="text-red-600">*</span>}
              <input
                aria-invalid={!validFirstName}
                placeholder="[3-20 letters]"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm"
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
              className="block text-sm font-medium text-gray-700"
              htmlFor="middleName"
            >
              Middle Name
              <input
                placeholder="[3-20 letters]"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm"
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
              className="block text-sm font-medium text-gray-700"
              htmlFor="lastName"
            >
              Last Name{" "}
              {!validLastName && <span className="text-red-600">*</span>}
              <input
                aria-invalid={!validLastName}
                placeholder="[3-20 letters]"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm"
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
              className="block text-sm font-medium text-gray-700"
              htmlFor="studentDob"
            >
              Date Of Birth{" "}
              {!validStudentDob && <span className="text-red-600">*</span>}
              <input
                aria-invalid={!validStudentDob}
                placeholder="[dd/mm/yyyy]"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm"
                id="studentDob"
                name="studentDob"
                type="date"
                autoComplete="off"
                value={studentDob}
                onChange={onStudentDobChanged}
                required
              />{" "}
            </label>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            <label
              htmlFor="male"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Male
              <input
                type="checkbox"
                id="male"
                value="Male"
                checked={studentSex === "Male"}
                onChange={onStudentSexChanged}
                className="h-4 w-4 text-blue-600 focus:ring-sky-700 border-gray-300 rounded"
              />
            </label>
            <label
              htmlFor="female"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Female
              <input
                type="checkbox"
                id="female"
                value="Female"
                checked={studentSex === "Female"}
                onChange={onStudentSexChanged}
                className="ml-6 h-4 w-4 text-blue-600 focus:ring-sky-700 border-gray-300 rounded"
              />
            </label>
          </div>

          <div className="flex items-center mb-2">
            <label
              htmlFor="active"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Student Is Active
              <input
                type="checkbox"
                id="active"
                value={studentIsActive}
                checked={studentIsActive}
                onChange={onStudentIsActiveChanged}
                className="h-4 w-4 text-blue-600 focus:ring-sky-700 border-gray-300 rounded"
              />
            </label>
          </div>

          <div className="flex items-center mb-2">
            <label
              htmlFor="studentYears"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Student Year{" "}
              {!studentYears[0] && <span className="text-red-600">*</span>} :{" "}
              {selectedAcademicYear?.title}
              <input
                type="checkbox"
                id="studentYears"
                value={selectedAcademicYear?.title}
                checked={studentYears.some(
                  (year) => year.academicYear === selectedAcademicYear.title
                )}
                onChange={onAcademicYearChanged}
                className="h-4 w-4 text-blue-600 focus:ring-sky-700 border-gray-300 rounded"
                required
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
                  className="block text-sm font-medium text-gray-700"
                >
                  Grade{" "}
                  {!studentYears[0].grade && (
                    <span className="text-red-600">*</span>
                  )}
                  <select
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
                    {["0", "1", "2", "3", "4", "5", "6", "7"].map((grade) => (
                      <option key={grade} value={grade}>
                        Grade {grade}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Student Gardien</h3>
          {Array.isArray(studentGardien) &&
            studentGardien.length > 0 &&
            studentGardien.map((entry, index) => (
              <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 "
                >
                  <div className="mb-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
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
                      className="block text-sm font-medium text-gray-700"
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
                      className="block text-sm font-medium text-gray-700"
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
                      />
                    </label>
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
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
                        <option value="">Select Year</option>
                        {academicYears.map(
                          (year) =>
                            year.title !== "1000" && (
                              <option key={year.id} value={year.title}>
                                {year.title}
                              </option>
                            )
                        )}
                      </select>{" "}
                    </label>
                  </div>

                  <div className="mb-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
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
                      />
                    </label>
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
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
              </div>
            ))}
          <button
            type="button"
            aria-label="add student gardien"
            className="add-button"
            onClick={handleAddGardienEntry}
          >
            Add Student Gardien
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">
            Student Education{" "}
            {!validCurrentEducation && <span className="text-red-600">*</span>}
          </h3>
          {Array.isArray(studentEducation) &&
            studentEducation.length > 0 &&
            studentEducation.map((entry, index) => (
              <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4"
                >
                  <div className="mb-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
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
                        {academicYears.map(
                          (year) =>
                            year.title !== "1000" && (
                              <option key={year.id} value={year.title}>
                                {year.title}
                              </option>
                            )
                        )}
                      </select>{" "}
                    </label>
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
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
                          attendedSchools
                            .filter(
                              (school) => school.schoolName !== "First Steps"
                            )
                            .map((school) => (
                              <option key={school.id} value={school.id}>
                                {school.schoolName}
                              </option>
                            ))}
                      </select>{" "}
                    </label>
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
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
                    onClick={() => handleRemoveEntry(index)}
                    className="delete-button"
                  >
                    Remove Entry
                  </button>
                </div>
              </div>
            ))}
          <button type="button" className="add-button" onClick={handleAddEntry}>
            Add Student Education
          </button>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="save-button"
            title="Save"
            onClick={onSaveStudentClicked}
            disabled={!canSave || isLoading}
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
export default NewStudentForm;
