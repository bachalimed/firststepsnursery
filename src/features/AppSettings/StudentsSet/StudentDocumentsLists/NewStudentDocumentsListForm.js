import React, { useState, useEffect } from "react";

import StudentsSet from "../../StudentsSet";
import { useAddNewStudentDocumentsListMutation } from "./studentDocumentsListsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../../config/UserRoles";
import { ACTIONS } from "../../../../config/UserActions";
import useAuth from "../../../../hooks/useAuth";
import {
  useGetStudentDocumentsListsQuery,
  useDeleteStudentDocumentsListMutation,
} from "./studentDocumentsListsApiSlice";
import { useSelector } from "react-redux";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AcademicsSet/AcademicYears/academicYearsSlice";
import { TITLE_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";

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
    { documentTitle: "Student Photo", isRequired: false, isLegalised: false },
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
    setValidDocumentTitle(TITLE_REGEX.test(documentTitle));
  }, [documentTitle]);

  useEffect(() => {
    setValidDocumentsAcademicYear(TITLE_REGEX.test(documentsAcademicYear));
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
      triggerBanner("Failed to create student document. Please try again.", "error");

      console.error("Error creating student document:", error);
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };

  const content = (
    <>
      <StudentsSet />

      <form
        className="form-container"
        onSubmit={onSaveStudentDocumentsListClicked}
      >
        <div className="form__title-row mb-4">
          <h2 className="text-xl font-semibold">
            New Student Documents List Form
          </h2>
        </div>
        <div className="mb-4">
          <label htmlFor=""
            htmlFor="documentsAcademicYear"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Year
            <select
              aria-label="document year"
              value={documentsAcademicYear}
              onChange={onDocumentsAcademicYearChanged}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-700 focus:border-sky-700 sm:text-sm"
            >
              <option value="">Select Year</option>
              {filteredAcademicYearsList.map((year) => (
                <option key={year.id} value={year.title}>
                  {year.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <h1 className="text-lg font-semibold mb-4">Student Documents</h1>
        {studentDocumentsList.map((entry, index) => (
          <div key={index} className="mb-4 p-4 bg-white rounded shadow">
            <div className="mb-2">
              <label htmlFor="" className="text-sm text-gray-700">
                <input
                  aria-label="Document Title"
                  placeholder="[3-20] Characters"
                  type="text"
                  value={entry.documentTitle}
                  onChange={(e) =>
                    handleFieldChange(index, "documentTitle", e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-700 focus:border-sky-700 sm:text-sm"
                  disabled={index < 3} // Disable input for the first three elements
                />
              </label>
            </div>
            <div className="flex items-center mb-2">
              <label htmlFor="" className="text-sm text-gray-700">
                <input
                  aria-label="id required"
                  type="checkbox"
                  checked={entry.isRequired}
                  onChange={(e) =>
                    handleFieldChange(index, "isRequired", e.target.checked)
                  }
                  className="mr-2"
                />
                Is Required?
              </label>
            </div>
            <div className="flex items-center mb-2">
              <label htmlFor="" className="text-sm text-gray-700">
                <input
                  aria-label="is legalised"
                  type="checkbox"
                  checked={entry.isLegalised}
                  onChange={(e) =>
                    handleFieldChange(index, "isLegalised", e.target.checked)
                  }
                  className="mr-2"
                />
                Is Legalised?
              </label>
            </div>
            {index >= 3 && (
              <button
                aria-label="remove document"
                type="button"
                onClick={() => handleRemoveEntry(index)}
                className="delete-button"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <div className="flex justify-between mt-6">
          <button
            aria-label="add document"
            type="button"
            onClick={handleAddEntry}
            className="add-button"
          >
            Add Document
          </button>
        </div>
        <div className="flex justify-end gap-4">
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

  return content;
};

export default NewStudentDocumentsListForm;
