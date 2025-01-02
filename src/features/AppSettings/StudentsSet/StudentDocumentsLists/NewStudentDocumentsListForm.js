import React, { useState, useEffect } from "react";
import StudentsSet from "../../StudentsSet";
import { useAddNewStudentDocumentsListMutation } from "./studentDocumentsListsApiSlice";
import { useNavigate } from "react-router-dom";

import useAuth from "../../../../hooks/useAuth";
import { useGetStudentDocumentsListsQuery } from "./studentDocumentsListsApiSlice";
import { useSelector } from "react-redux";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AcademicsSet/AcademicYears/academicYearsSlice";
import { NAME_REGEX, YEAR_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
const NewStudentDocumentsListForm = () => {
  const navigate = useNavigate();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const {
    data: studentDocumentsListsData,
    isLoading: isDocsListLoading,
    isSuccess: isDocsListSucess,
    isError: isDocsListError,
    error: docsListError,
  } = useGetStudentDocumentsListsQuery(
    {
      endpointName: "NewStudentDocumentsListForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const [
    addNewStudentDocumentsList,
    {
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      error: addError,
    },
  ] = useAddNewStudentDocumentsListMutation();

  // Prepare the permission variables
  const { userId, canEdit, canDelete, canAdd, canCreate, isParent, status2 } =
    useAuth();
  let filteredAcademicYearsList = [];
  if (isDocsListSucess) {
    // Extract entities and convert to an array
    const { entities } = studentDocumentsListsData;
    const studentDocumentsListsArray = Object.values(entities);

    // Filter the academicYears based on documentsAcademicYear
    filteredAcademicYearsList = academicYears.filter(
      (academicYear) =>
        !studentDocumentsListsArray.some(
          (doc) => doc.documentsAcademicYear === academicYear.title
        )
    );
  }


  // Confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Initialization of states for each input
  const [studentDocumentsList, setStudentDocumentsList] = useState([
    { documentTitle: "Student Photo", isRequired: true, isLegalised: false },
    { documentTitle: "Father Photo", isRequired: false, isLegalised: false },
    { documentTitle: "Mother Photo", isRequired: false, isLegalised: false },
  ]);
  const [documentTitle, setDocumentTitle] = useState("");
  const [validDocumentTitle, setValidDocumentTitle] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [isLegalised, setIsLegalised] = useState(false);
  const [documentsList, setDocumentsList] = useState([]);
  const [documentsAcademicYear, setDocumentsAcademicYear] = useState("");
  const [validDocumentsAcademicYear, setValidDocumentsAcademicYear] =
    useState("");

  // Validation effects
  useEffect(() => {
    const allValid = studentDocumentsList.every((entry) =>
      NAME_REGEX.test(entry.documentTitle)
    );
    setValidDocumentTitle(allValid);
  }, [studentDocumentsList]);

  useEffect(() => {
    setValidDocumentsAcademicYear(YEAR_REGEX.test(documentsAcademicYear));
  }, [documentsAcademicYear]);

  useEffect(() => {
    if (isAddSuccess) {
      // Clear form and navigate back on successful save
      setStudentDocumentsList([
        {
          documentTitle: "Student Photo",
          isRequired: false,
          isLegalised: false,
        },
        {
          documentTitle: "Father Photo",
          isRequired: false,
          isLegalised: false,
        },
        {
          documentTitle: "Mother Photo",
          isRequired: false,
          isLegalised: false,
        },
      ]);
      setDocumentsAcademicYear("");
      setValidDocumentsAcademicYear(false);
      navigate("/settings/studentsSet/studentDocumentsListsList");
    }
  }, [isAddSuccess, navigate]);
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  // Handlers to get the individual states from the input
  const onDocumentTitleChanged = (e) => setDocumentTitle(e.target.value);
  const onIsRequiredChanged = (e) => setIsRequired(e.target.value);
  const onIsLegalisedChanged = (e) => setIsLegalised(e.target.value);
  const onDocumentsAcademicYearChanged = (e) =>
    setDocumentsAcademicYear(e.target.value);

  // To deal with studentDocumentsList entries:
  // Handler to update an entry field
  const handleFieldChange = (index, field, value) => {
    const updatedEntries = [...studentDocumentsList];
    updatedEntries[index][field] = value;
    setStudentDocumentsList(updatedEntries);
  };
  const handleActionChange = (index, action) => {
    setStudentDocumentsList((prevList) =>
      prevList.map((entry, i) =>
        i === index ? { ...entry, [action]: !entry[action] } : entry
      )
    );
  };

  const handleAddEntry = () => {
    setStudentDocumentsList([
      ...studentDocumentsList,
      { documentTitle: "", isRequired: false, isLegalised: false },
    ]);
  };

  const handleRemoveEntry = (index) => {
    const updatedEntries = studentDocumentsList.filter((_, i) => i !== index);
    setStudentDocumentsList(updatedEntries);
  };

  // Check if we can save before calling onSave
  const canSave =
    [
      validDocumentsAcademicYear,
      ...studentDocumentsList.map((entry) => entry.documentTitle),
    ].every(Boolean) && !isAddLoading;

  const onSaveStudentDocumentsListClicked = async (e) => {
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

    try {
      const response = await addNewStudentDocumentsList({
        documentsList: studentDocumentsList,
        documentsAcademicYear,
      });
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
  // console.log(studentDocumentsList, "studentDocumentsList");

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  let content;
  if (isDocsListLoading) {
    content = (
      <>
        {" "}
        <StudentsSet />
        <LoadingStateIcon />
      </>
    );
  }
  if (isDocsListSucess) {
    content = (
      <>
        <StudentsSet />

        <form
          className="form-container"
          onSubmit={onSaveStudentDocumentsListClicked}
        >
          <h2 className="formTitle">New Student Documents List Form</h2>

          <div className="formSectionContainer">
            <h3 className="formSectionTitle">Year selection</h3>
            <div className="formSection">
              <label htmlFor="documentsAcademicYear" className="formInputLabel">
                List year{" "}
                {!validDocumentsAcademicYear && (
                  <span className="text-red-600 ">*</span>
                )}
                <select
                  aria-invalid={!validDocumentsAcademicYear}
                  aria-label="document year"
                  id="documentsAcademicYear"
                  name="documentsAcademicYear"
                  value={documentsAcademicYear}
                  onChange={onDocumentsAcademicYearChanged}
                  className={`formInputText`}
                >
                  <option value="">Select Year</option>
                  {filteredAcademicYearsList
                  .filter((year) => year.title !== "1000")
                  .map((year) => (
                    <option key={year.id} value={year.title}>
                      {year.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <h3 className="formSectionTitle">Student Documents</h3>
          <div className="formSection">
            {studentDocumentsList.map((entry, index) => (
              <div key={index} className="formSection">
                <div className="formLineDiv">
                  <label
                    htmlFor={`${entry.documentTitle}-${index}`}
                    className="formInputLabel"
                  >
                    Document Title:{" "}
                    {!validDocumentTitle && (
                      <span className="text-red-600 ">*</span>
                    )}
                    <input
                      aria-invalid={!validDocumentTitle}
                      aria-label="Document Title"
                      placeholder="[3-25] Characters"
                      type="text"
                      id={`${entry.documentTitle}-${index}`}
                      name={`${entry.documentTitle}-${index}`}
                      value={entry.documentTitle}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "documentTitle",
                          e.target.value
                        )
                      }
                      className={`formInputText`}
                      disabled={index < 3} // Disable input for the first three elements to avoid changing title because we need exact syntax of titile
                    />
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-2 mb-2 mt-1 max-h-80 overflow-y-auto">
                    <button
                      aria-label="is required"
                      type="button"
                      onClick={() => handleActionChange(index, "isRequired")}
                      className={`px-3 py-2 text-left rounded-md ${
                        entry.isRequired
                          ? "bg-green-600 text-white hover:bg-green-500"
                          : "bg-gray-100 text-gray-700 hover:bg-sky-600 hover:text-white"
                      }`}
                    >
                      <div className="font-semibold">
                        {entry.isRequired ? "Required" : "Not Required"}
                      </div>
                    </button>
                    <button
                      aria-label="is legalised"
                      type="button"
                      onClick={() => handleActionChange(index, "isLegalised")}
                      className={`px-3 py-2 text-left rounded-md ${
                        entry.isLegalised
                          ? "bg-green-600 text-white hover:bg-green-500"
                          : "bg-gray-100 text-gray-700 hover:bg-sky-600 hover:text-white"
                      }`}
                    >
                      <div className="font-semibold">
                        {entry.isLegalised ? "Legalised" : "Not Legalised"}
                      </div>
                    </button>
                  </div>
                </div>
                {index >= 3 && (
                  <button
                    aria-label="remove document"
                    type="button"
                    onClick={() => handleRemoveEntry(index)}
                    className="delete-button w-full"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              aria-label="add document"
              type="button"
              onClick={handleAddEntry}
              className="add-button w-full"
            >
              Add Document
            </button>
          </div>
          <div className="cancelSavebuttonsDiv">
            <button
              aria-label="cancel new list"
              className="cancel-button"
              onClick={() =>
                navigate("/settings/studentsSet/studentDocumentsListsList")
              }
            >
              Cancel
            </button>
            <button
              aria-label="submit new list"
              type="submit"
              disabled={!canSave || isAddLoading}
              className="save-button"
            >
              Save
            </button>
          </div>
        </form>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <ConfirmationModal
            show={showConfirmation}
            onClose={handleCloseModal}
            onConfirm={handleConfirmSave}
            title="Confirm Save"
            message="Are you sure you want to save?"
          />
        )}
      </>
    );
  }

  return content;
};

export default NewStudentDocumentsListForm;
