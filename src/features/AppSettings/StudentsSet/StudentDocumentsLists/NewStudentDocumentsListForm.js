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

const NewStudentDocumentsListForm = () => {
  const navigate = useNavigate();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const {
    data: studentDocumentsListsData,
    isLoading:isDocsListLoading,
    isSuccess:isDocsListSucess,
    isError:isDocsListError,
    error:docsListError,
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
  filteredAcademicYearsList = academicYears.filter((academicYear) =>
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
        { documentTitle: "Student Photo", isRequired: false, isLegalised: false },
        { documentTitle: "Father Photo", isRequired: false, isLegalised: false },
        { documentTitle: "Mother Photo", isRequired: false, isLegalised: false },
      ]);
      setDocumentsAcademicYear("");
      setValidDocumentsAcademicYear(false);
      navigate("/settings/studentsSet/studentDocumentsListsList");
    }
  }, [isAddSuccess, navigate]);

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
      await addNewStudentDocumentsList({
        documentsList: studentDocumentsList,
        documentsAcademicYear,
      });
      if (isAddError) {
        console.log("Error saving:", addError);
      }
    } catch (addError) {
      console.error("Error saving student:", addError);
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };

 

  const errClass = isAddError ? "errmsg" : "offscreen";

  const content = (
    <>
      <StudentsSet />
      <p className={isAddError ? "errmsg" : "offscreen"}>
        {addError?.data?.message}
      </p>
      <form
        className="form bg-gray-100 p-6 rounded shadow-lg max-w-md mx-auto"
        onSubmit={onSaveStudentDocumentsListClicked}
      >
        <div className="form__title-row mb-4">
          <h2 className="text-xl font-semibold">
            New StudentDocumentsList Form
          </h2>
        </div>
        <div className="mb-4">
          <label
            htmlFor="documentsAcademicYear"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Year
          </label>
          <select
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
        </div>
        <h1 className="text-lg font-semibold mb-4">Student Documents</h1>
        {studentDocumentsList.map((entry, index) => (
          <div key={index} className="mb-4 p-4 bg-white rounded shadow">
            <div className="mb-2">
              <input
                type="text"
                placeholder="Document Title"
                value={entry.documentTitle}
                onChange={(e) =>
                  handleFieldChange(index, "documentTitle", e.target.value)
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-700 focus:border-sky-700 sm:text-sm"
                disabled={index < 3} // Disable input for the first three elements
              />
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={entry.isRequired}
                onChange={(e) =>
                  handleFieldChange(index, "isRequired", e.target.checked)
                }
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Is Required?</label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={entry.isLegalised}
                onChange={(e) =>
                  handleFieldChange(index, "isLegalised", e.target.checked)
                }
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Is Legalised?</label>
            </div>
            {index >= 3 && (
              <button
                type="button"
                onClick={() => handleRemoveEntry(index)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleAddEntry}
            className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-blue-600"
          >
            Add Document
          </button>
          </div>
          <div className="flex justify-end gap-4">
        <button
            className="cancel-button"
            onClick={() => navigate("/settings/studentsSet/studentDocumentsListsList")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave||isAddLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
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
