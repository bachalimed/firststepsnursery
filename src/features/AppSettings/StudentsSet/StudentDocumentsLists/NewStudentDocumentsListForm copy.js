import React from "react";

import StudentsSet from "../../StudentsSet";
import { useState, useEffect } from "react";
import { useAddNewStudentDocumentsListMutation } from "./studentDocumentsListsApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
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

  const [
    addNewStudentDocumentsList,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      error: addError,
    },
  ] = useAddNewStudentDocumentsListMutation(); //it will not execute the mutation nownow but when called

  //prepare the permission variables
  const { userId, canEdit, canDelete, canAdd, canCreate, isParent, status2 } =
    useAuth();
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  //initialisation of states for each input
  const [studentDocumentsList, setStudentDocumentsList] = useState([]);
  //const [documentReference, setDocumentReference] = useState('')
  const [documentTitle, setDocumentTitle] = useState("");
  const [validDocumentTitle, setValidDocumentTitle] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [isLegalised, setIsLegalised] = useState(false);
  const [documentsList, setDocumentsList] = useState([]);
  const [documentsAcademicYear, setDocumentsAcademicYear] = useState("");
  const [validDocumentsAcademicYear, setValidDocumentsAcademicYear] =
    useState("");

  //use effect is used to validate the inputs against the defined REGEX above
  //the previous constrains have to be verified on the form for teh user to know

  useEffect(() => {
    setValidDocumentTitle(TITLE_REGEX.test(documentTitle));
  }, [documentTitle]);
  useEffect(() => {
    setValidDocumentsAcademicYear(TITLE_REGEX.test(documentsAcademicYear));
  }, [documentsAcademicYear]);

  useEffect(() => {
    if (isAddSuccess) {
      //if the add of new user using the mutation is success, empty all the individual states and  back to the users list

      setStudentDocumentsList([]);
      setDocumentsAcademicYear("");
      setValidDocumentsAcademicYear(false);
      ("/settings/studentsSet/studentDocumentsListsList"); //will  here after saving
    }
  }, [isAddSuccess]); //even if no success it will  and not show any warning if failed or success

  //handlers to get the individual states from the input

  //const onDocumentReferenceChanged = e => setDocumentReference(e.target.value)
  const onDocumentTitleChanged = (e) => setDocumentTitle(e.target.value);
  const onIsRequiredChanged = (e) => setIsRequired(e.target.value);
  const onIsLegalisedChanged = (e) => setIsLegalised(e.target.value);
  const onDocumentsAcademicYearChanged = (e) =>
    setDocumentsAcademicYear(e.target.value);

  // to deal with studentDocumentsList education entries:
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

  //to check if we can save before onsave, if every one is true, and also if we are not loading status
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

  const content = (
    <>
      <StudentsSet />

      <form
        className="form-container"
        onSubmit={onSaveStudentDocumentsListClicked}
      >
        <div className="form__title-row mb-4">
          <h2 className="text-xl font-semibold">
            New StudentDocumentsList Form
          </h2>
        </div>
        <div className="mb-4">
          <label htmlFor=""
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
            {academicYears.map((year) => (
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

              <label htmlFor="" className="text-sm text-gray-700">Is Required?</label>
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
              <label htmlFor="" className="text-sm text-gray-700">Is Legalised?</label>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveEntry(index)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddEntry}>
          Add Document
        </button>
        <div className="cancelSavebuttonsDiv">
          <button
            className="cancel-button"
            onClick={() =>
              navigate("/settings/studentsSet/studentDocumentsListsList")
            }
          >
            Cancel
          </button>
          <button
            className="mb-4 px-4 py-2 bg-sky-700 text-white rounded hover:bg-blue-600"
            type="submit"
            onClick={onSaveStudentDocumentsListClicked}
            disabled={!canSave || isAddLoading}
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
export default NewStudentDocumentsListForm;
