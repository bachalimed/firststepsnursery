import React from "react";
import Students from "../../Students";
import { useState, useEffect } from "react";
import { useUpdateStudentMutation } from "./studentsApiSlice";
import { useGetAttendedSchoolsQuery } from "../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useSelector } from "react-redux";
import { selectAllAcademicYears } from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { NAME_REGEX, DATE_REGEX,COMMENT_REGEX ,YEAR_REGEX, OBJECTID_REGEX, PHONE_REGEX} from "../../../../config/REGEX";

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
  const [validMiddleName, setValidMiddleName] = useState(false);
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
    student.studentEducation.map((edu) => ({
      attendedSchool: edu.attendedSchool?._id,
      note: edu.note,
      schoolYear: edu.schoolYear,
    }))
  );
  const [schoolYear, setSchoolYear] = useState(student.schoolYear);
  const [attendedSchool, setAttendedSchool] = useState(student.attendedSchool);
  const [note, setNote] = useState(student.note);
const [validStudentGardien, setValidStudentGardien] = useState(false);
  const [operator, setOperator] = useState(userId); //id of the user logged in already
  const [validStudentEducation, setValidStudentEducation] = useState(false);
  const [validCurrentEducation, setValidCurrentEducation] = useState(false);
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
  //console.log(studentYears);
  useEffect(() => {
    setValidFirstName(NAME_REGEX.test(firstName));
  }, [firstName]);

  useEffect(() => {
      setValidMiddleName(middleName==="" || NAME_REGEX.test(middleName));
    }, [middleName]);

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
      setValidMiddleName(false);
      setLastName("");
      setValidLastName(false);
      setStudentName({ firstName: "", middleName: "", lastName: "" });
      setStudentDob("");
      setValidStudentDob("");
      setStudentSex("");
      setStudentIsActive(false);
      setStudentYears([]); //will be true when the username is validated
      setValidStudentGrade(false);
      setValidStudentGardien(false)
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
      setValidStudentEducation(false)
      setValidCurrentEducation(false)
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
console.log(studentGardien, 'stduetgardien')
console.log(studentEducation, 'stdueteducation')
  useEffect(() => {
      setValidStudentGardien(
        studentGardien.every(
          (gardien) =>
            gardien?.gardienYear !== "" &&
            NAME_REGEX.test(gardien?.gardienFirstName) &&
            (gardien?.gardienMiddleName ==="" ||NAME_REGEX.test(gardien?.gardienMiddleName) )&&
            NAME_REGEX.test(gardien?.gardienLastName) &&
            NAME_REGEX.test(gardien?.gardienRelation) &&
            PHONE_REGEX.test(gardien?.gardienPhone) 
        )
      );
    }, [studentGardien]);
  useEffect(() => {
    setValidCurrentEducation(
          studentEducation.some(
          (education) =>
            education.schoolYear === selectedAcademicYear.title && 
          OBJECTID_REGEX.test(education?.attendedSchool)//retrived populated data
        ))
        setValidStudentEducation(studentEducation.every((education) =>
          YEAR_REGEX.test(education?.schoolYear) &&
        OBJECTID_REGEX.test(education?.attendedSchool) &&
        COMMENT_REGEX.test(education?.note)
        ))
     
      
    }, [studentEducation]);

  //to check if we can save before onsave, if every one is true, and also if we are not loading status
  const canSave =
    [validStudentEducation,
      validStudentGardien,
      validCurrentEducation,
      validFirstName,
      validMiddleName,
      validLastName,
      validStudentDob,
      studentSex,
    ].every(Boolean) && !isUpdateLoading;
console.log(validStudentEducation,
  validStudentGardien,
  validCurrentEducation,
  validFirstName,
  validMiddleName,
  validLastName,
  validStudentDob,
  studentSex,canSave, validCurrentEducation,validStudentGardien)
  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const onUpdateStudentClicked = async (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };
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
  console.log(toSave,'toSave')
  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);
    //generate the objects before saving
    
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
        <h2 className="formTitle">
          Editing {firstName} {middleName} {lastName} Profile
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
                  placeholder="[3-20 letters]"
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
                Middle Name{" "}{!validMiddleName &&middleName!=="" && <span className="text-red-600 ">[3-20] letters</span>}
                <input
                  placeholder="[3-20 letters]"
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
                  placeholder="[3-20 letters]"
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
        </div>

        <div className="formSectionContainer">
          <h3 className="formSectionTitle">Student situation</h3>
          <div className="formSection">
            <div className="formLineDiv">
              {studentYears.some(
                (year) => year.academicYear === selectedAcademicYear?.title
              ) && (
                <label htmlFor="studentGrade" className="formInputLabel">
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
                    className="formInputText"
                  >
                    <option value="">Select Grade</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((grade) => (
                      <option key={grade} value={grade}>
                        Grade {grade}
                      </option>
                    ))}
                  </select>{" "}
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
                />{" "}
                Student Is Active
              </label>
            </div>
          </div>
        </div>

        <div className="formSectionContainer">
          <h3 className="formSectionTitle">Student Gardien</h3>
          {!validStudentGardien  && <span className="text-red-600 ">Ensure fileds are properly filled</span>}
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
                        placeholder="[3-20 letters]"
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
                        placeholder="[3-20 letters]"
                        value={entry.gardienLastName}
                        onChange={(e) =>
                          handleGardienFieldChange(
                            index,
                            "gardienLastName",
                            e.target.value
                          )
                        }
                        className={`formInputText`}
                      />{" "}
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
                      ><option value="">Select Year</option>
                        {academicYears.map((year, i) => (
                          <option key={year?.title} value={year?.title}>
                            {year?.title}
                          </option>
                        ))}
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
                        value={entry.gardienRelation}
                        onChange={(e) =>
                          handleGardienFieldChange(
                            index,
                            "gardienRelation",
                            e.target.value
                          )
                        }
                        className={`formInputText`}
                      />{" "}
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
              type="add-button"
              aria-label="add student gardien"
              className="add-button w-full"
              onClick={handleAddGardienEntry}
            >
              Add Student Gardien
            </button>
          </div>
        </div>

        <div className="formSectionContainer">
          <h3 className="formSectionTitle">Student Education{" "}
          {(!validCurrentEducation  || !validStudentEducation) && <span className="text-red-600">*</span>}</h3>

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
                          handleFieldChange(index, "schoolYear", e.target.value)
                        }
                        className={`formInputText`}
                      >
                        <option value="">Select Year</option>
                        {academicYears.map((year, i) => (
                           year.title !== "1000" && (<option key={year.title} value={year.title}>
                            {year.title}
                          </option>)
                        ))}
                      </select>{" "}
                    </label>

                    <label
                      className="formInputLabel"
                      htmlFor={`attendedSchool-${index}`}
                    >
                      Attended School:
                      <select
                        id={`attendedSchool-${index}`}
                        value={entry?.attendedSchool}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "attendedSchool",
                            e.target.value
                          )
                        }
                        className={`formInputText`}
                      >
                        
                        {schoolIsSuccess &&
                          attendedSchools.map((school) => (
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
                      type="text"
                      value={entry.note}
                      placeholder="[max 150 characters]"
                      onChange={(e) =>
                        handleFieldChange(index, "note", e.target.value)
                      }
                      className={`formInputText text-wrap`}
                    >
                      {" "}
                    </textarea>
                  </label>

                  <button
                    type="button"
                    aria-label="remove student education"
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
