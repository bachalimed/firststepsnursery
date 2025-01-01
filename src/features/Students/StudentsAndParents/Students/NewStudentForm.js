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
import useAuth from "../../../../hooks/useAuth";
import { useSelector } from "react-redux";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { selectAllAcademicYears } from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  NAME_REGEX,
  DATE_REGEX,
  COMMENT_REGEX,
  YEAR_REGEX,
  OBJECTID_REGEX,
  PHONE_REGEX,
} from "../../../../config/REGEX";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";

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
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      error: addError,
    },
  ] = useAddNewStudentMutation(); //it will not execute the mutation nownow but when called

  //prepare the permission variables
  const { userId, } =
    useAuth();

  const {
    data: attendedSchoolsList,
    isLoading: isSchoolLoading,
    isSuccess: isSchoolSuccess,
    // isError: isSchoolIsError,
    // error: schoolError,
  } = useGetAttendedSchoolsQuery({ endpointName: "NewStudentForm" } || {}, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let attendedSchools;
  if (isSchoolSuccess) {
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
  const [validMiddleName, setValidMiddleName] = useState(false);
  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [studentDob, setStudentDob] = useState("");
  const [validStudentDob, setValidStudentDob] = useState("");
  const [studentSex, setStudentSex] = useState("");
  const [studentIsActive, setStudentIsActive] = useState((prev) => !prev);

  //const [validStudentGrade, setValidStudentGrade] = useState(false);
  //const [studentGrade, setStudentGrade] = useState(null);
  // const [academicYear, setAcademicYear] = useState(null);
  const [studentYears, setStudentYears] = useState([]);
  //const [studentJointFamily, setStudentJointFamily] = useState(true)
  const [studentGardien, setStudentGardien] = useState([]);
  // const [gardienYear, setGardienYear] = useState("");
  const [gardienFirstName, setGardienFirstName] = useState("");
  const [gardienMiddleName, setgardienMiddleName] = useState("");
  const [gardienLastName, setGardienLastName] = useState("");
  const [gardienPhone, setGardienPhone] = useState("");
  const [gardienRelation, setGardienRelation] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [note, setNote] = useState("");
  const [attendedSchool, setAttendedSchool] = useState("");
  const [studentEducation, setStudentEducation] = useState([]);
  const [validStudentEducation, setValidStudentEducation] = useState(false);
  const [validStudentGardien, setValidStudentGardien] = useState(false);
  const [operator, setOperator] = useState(userId); //id of the user logged in already

  //use effect is used to validate the inputs against the defined REGEX above
  //the previous constrains have to be verified on the form for teh user to know

  useEffect(() => {
    setValidFirstName(NAME_REGEX.test(firstName));
  }, [firstName]);
  useEffect(() => {
    setValidMiddleName(middleName === "" || NAME_REGEX.test(middleName));
  }, [middleName]);

  useEffect(() => {
    setValidLastName(NAME_REGEX.test(lastName));
  }, [lastName]);

  useEffect(() => {
    setValidStudentDob(DATE_REGEX.test(studentDob));
  }, [studentDob]);
  //ensure studentgardien has no empty array

  useEffect(() => {
    if (isAddSuccess) {
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
      setValidStudentGardien(false);
      setValidStudentEducation(false);
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
  }, [isAddSuccess, naviagte]); //even if no success it will naviagte and not show any warning if failed or success

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
          OBJECTID_REGEX.test(year?.attendedSchool)
      )
    );
    setValidStudentEducation(
      studentEducation.every(
        (year) =>
          year.schoolYear !== "" &&
          year.attendedSchool !== "" &&
          YEAR_REGEX.test(year?.schoolYear) &&
          OBJECTID_REGEX.test(year?.attendedSchool) &&
          COMMENT_REGEX.test(year?.note)
      )
    );
  }, [studentEducation, selectedAcademicYear?.title]);
  useEffect(() => {
    setValidStudentGardien(
      studentGardien.every(
        (gardien) =>
          gardien?.gardienYear !== "" &&
          NAME_REGEX.test(gardien?.gardienFirstName) &&
          (gardien?.gardienMiddleName === "" ||
            NAME_REGEX.test(gardien?.gardienMiddleName)) &&
          NAME_REGEX.test(gardien?.gardienLastName) &&
          NAME_REGEX.test(gardien?.gardienRelation) &&
          PHONE_REGEX.test(gardien?.gardienPhone)
      )
    );
  }, [studentGardien]);

  //to check if we can save before onsave, if every one is true, and also if we are not loading status
  const canSave =
    [
      validStudentGardien,
      validStudentEducation,
      validCurrentEducation,
      validFirstName,
      validMiddleName,
      validLastName,
      studentYears,
      validStudentDob,
      studentSex,
    ].every(Boolean) &&studentYears[0]?.grade && !isAddLoading;

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
      } else if (isAddError) {
        // In case of unexpected response format
        triggerBanner(addError?.data?.message, "error");
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

  const handleCancel = () => {
    naviagte("/students/studentsParents/students/");
  };
  let content;
  if (isSchoolLoading) {
    content = (
      <>
        {" "}
        <Students />
        <LoadingStateIcon />
      </>
    );
  }
  if (isSchoolSuccess) {
    content = (
      <>
        <Students />

        <form className="form-container" onSubmit={onSaveStudentClicked}>
          <h2 className="formTitle">
            New student: {firstName} {middleName} {lastName}
          </h2>
          <div className="formSectionContainer">
            <h3 className="formSectionTitle">Personal Information</h3>
            <div className="formSection">
              <div className="formLineDiv">
                <label className="formInputLabel" htmlFor="firstName">
                  First Name{" "}
                  {!validFirstName && <span className="text-red-600 ">*</span>}
                  <input
                    aria-invalid={!validFirstName}
                    placeholder="[3-25 letters]"
                    className={`formInputText`}
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="off"
                    value={firstName}
                    onChange={onFirstNameChanged}
                    required
                  />{" "}
                </label>

                <label className="formInputLabel" htmlFor="middleName">
                  Middle Name{" "}
                  {!validMiddleName && middleName !== "" && (
                    <span className="text-red-600 ">[3-25] letters</span>
                  )}
                  <input
                    placeholder="[3-25 letters]"
                    className={`formInputText`}
                    id="middleName"
                    name="middleName"
                    type="text"
                    autoComplete="off"
                    value={middleName}
                    onChange={onMiddleNameChanged}
                  />{" "}
                </label>
              </div>
              <div className="formLineDiv">
                <label className="formInputLabel" htmlFor="lastName">
                  Last Name{" "}
                  {!validLastName && <span className="text-red-600">*</span>}
                  <input
                    aria-invalid={!validLastName}
                    placeholder="[3-25 letters]"
                    className={`formInputText`}
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="off"
                    value={lastName}
                    onChange={onLastNameChanged}
                    required
                  />
                </label>

                <label className="formInputLabel" htmlFor="studentDob">
                  Date Of Birth{" "}
                  {!validStudentDob && <span className="text-red-600">*</span>}
                  <input
                    aria-invalid={!validStudentDob}
                    placeholder="[dd/mm/yyyy]"
                    className={`formInputText`}
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

              <label className="formInputLabel">
                Student Sex
                <div className="formCheckboxItemsDiv">
                  <label htmlFor="male" className="formCheckboxChoice">
                    <input
                      type="checkbox"
                      id="male"
                      value="Male"
                      checked={studentSex === "Male"}
                      onChange={onStudentSexChanged}
                      className="formCheckbox"
                    />
                    Male
                  </label>
                  <label htmlFor="female" className="formCheckboxChoice">
                    <input
                      type="checkbox"
                      id="female"
                      value="Female"
                      checked={studentSex === "Female"}
                      onChange={onStudentSexChanged}
                      className="formCheckbox"
                    />{" "}
                    Female
                  </label>
                </div>
              </label>
            </div>

            <h3 className="formSectionTitle">Student situation</h3>
            <div className="formSection">
              <div className="formLineDiv">
                <label htmlFor="studentYears" className="formInputLabel">
                  <input
                    type="checkbox"
                    id="studentYears"
                    value={selectedAcademicYear?.title}
                    checked={studentYears.some(
                      (year) =>
                        year.academicYear === selectedAcademicYear?.title
                    )}
                    onChange={onAcademicYearChanged}
                    className={`formCheckbox`}
                    required
                  />
                  Student Year{" "}
                  {!studentYears[0] && <span className="text-red-600">*</span>}{" "}
                  : {selectedAcademicYear?.title}
                </label>
                {studentYears.some(
                  (year) => year.academicYear === selectedAcademicYear?.title
                ) && (
                  <label htmlFor="studentGrade" className="formInputLabel">
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
                      className="formInputText"
                    >
                      <option value="">Select Grade</option>
                      {["0", "1", "2", "3", "4", "5", "6", "7"].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>

              <div className="formLineDiv">
                <label htmlFor="active" className="formInputLabel">
                  <input
                    type="checkbox"
                    id="active"
                    value={studentIsActive}
                    checked={studentIsActive}
                    onChange={onStudentIsActiveChanged}
                    className={`formCheckbox`}
                  />
                  Student Is Active
                </label>
              </div>
            </div>

            <h3 className="formSectionTitle">Student Gardien</h3>
            {!validStudentGardien && (
              <span className="text-red-600 ">
                Ensure fileds are properly filled
              </span>
            )}
            <div className="formSection">
              {Array.isArray(studentGardien) &&
                studentGardien.length > 0 &&
                studentGardien.map((entry, index) => (
                  <div key={index} className="formSection">
                    <div className="formLineDiv">
                      <label
                        className="formInputLabel"
                        htmlFor={`gardienFirstName-${index}`}
                      >
                        First Name:
                        <input
                          id={`gardienFirstName-${index}`}
                          type="text"
                          placeholder="[3-25 letters]"
                          value={entry.gardienFirstName}
                          onChange={(e) =>
                            handleGardienFieldChange(
                              index,
                              "gardienFirstName",
                              e.target.value
                            )
                          }
                          className={`formInputText`}
                        />
                      </label>

                      <label
                        className="formInputLabel"
                        htmlFor={`gardienMiddleName-${index}`}
                      >
                        Middle Name:
                        <input
                          id={`gardienMiddleName-${index}`}
                          type="text"
                          placeholder="[3-25 letters]"
                          value={entry.gardienMiddleName}
                          onChange={(e) =>
                            handleGardienFieldChange(
                              index,
                              "gardienMiddleName",
                              e.target.value
                            )
                          }
                          className={`formInputText`}
                        />{" "}
                      </label>
                    </div>

                    <div className="formLineDiv">
                      <label
                        className="formInputLabel"
                        htmlFor={`gardienLastName-${index}`}
                      >
                        Last Name:
                        <input
                          id={`gardienLastName-${index}`}
                          type="text"
                          placeholder="[3-25 letters]"
                          value={entry.gardienLastName}
                          onChange={(e) =>
                            handleGardienFieldChange(
                              index,
                              "gardienLastName",
                              e.target.value
                            )
                          }
                          className={`formInputText`}
                        />
                      </label>

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
                          className={`formInputText`}
                        >
                          <option value="">Select Year</option>
                          {academicYears.map(
                            (year) =>
                              year.title === selectedAcademicYear?.title && (
                                <option key={year.id} value={year.title}>
                                  {year.title}
                                </option>
                              )
                          )}
                        </select>{" "}
                      </label>
                    </div>

                    <div className="formLineDiv">
                      <label
                        className="formInputLabel"
                        htmlFor={`gardienRelation-${index}`}
                      >
                        Relation :
                        <input
                          id={`gardienRelation-${index}`}
                          type="text"
                          placeholder="[3-25 letters]"
                          value={entry.gardienRelation}
                          onChange={(e) =>
                            handleGardienFieldChange(
                              index,
                              "gardienRelation",
                              e.target.value
                            )
                          }
                          className={`formInputText`}
                        />
                      </label>

                      <label
                        className="formInputLabel"
                        htmlFor={`gardienPhone-${index}`}
                      >
                        Phone Number:
                        <input
                          id={`gardienPhone-${index}`}
                          type="text"
                          placeholder="[6-15 digits]"
                          value={entry.gardienPhone}
                          onChange={(e) =>
                            handleGardienFieldChange(
                              index,
                              "gardienPhone",
                              e.target.value
                            )
                          }
                          className={`formInputText`}
                        />{" "}
                      </label>
                    </div>

                    <button
                      type="button"
                      aria-label="delete student gardien"
                      onClick={() => handleRemoveGardienEntry(index)}
                      className="delete-button w-full"
                    >
                      Remove Entry
                    </button>
                  </div>
                ))}

              <button
                type="button"
                aria-label="add student gardien"
                className="add-button w-full"
                onClick={handleAddGardienEntry}
              >
                Add Gardien
              </button>
            </div>

            <h3 className="formSectionTitle">
              Student Education{" "}
              {!validCurrentEducation && (
                <span className="text-red-600">*</span>
              )}
            </h3>
            {(!validCurrentEducation || !validStudentEducation) && (
              <span className="text-red-600 ">
                Ensure fileds are properly filled
              </span>
            )}

            <div className="formSection">
              {Array.isArray(studentEducation) &&
                studentEducation.length > 0 &&
                studentEducation.map((entry, index) => (
                  <div key={index} className="formSection">
                    <div className="formLineDiv">
                      <label
                        className="formInputLabel"
                        htmlFor={`schoolYear-${index}`}
                      >
                        School Year:
                        <select
                          id={`schoolYear-${index}`}
                          value={entry.schoolYear}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "schoolYear",
                              e.target.value
                            )
                          }
                          className={`formInputText`}
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
                          className={`formInputText`}
                        >
                          <option value="">Select School</option>
                          {isSchoolSuccess &&
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

                    <label className="formInputLabel" htmlFor={`note-${index}`}>
                      Note:
                      <textarea
                        id={`note-${index}`}
                        type="textArea"
                        placeholder="[max 150 characters]"
                        value={entry.note}
                        onChange={(e) =>
                          handleFieldChange(index, "note", e.target.value)
                        }
                        className={`formInputText text-wrap`}
                      ></textarea>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemoveEntry(index)}
                      className="delete-button w-full"
                    >
                      Remove Entry
                    </button>
                  </div>
                ))}
              <button
                type="button"
                className="add-button w-full"
                onClick={handleAddEntry}
                aria-label="add student education"
              >
                Add Education
              </button>
            </div>
          </div>

          <div className="cancelSavebuttonsDiv">
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
              aria-label="submit student"
              onClick={onSaveStudentClicked}
              disabled={!canSave || isAddLoading}
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
          message="Create new student?"
        />
      </>
    );
  }

  return content;
};
export default NewStudentForm;
