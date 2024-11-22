import React from "react";

import EmployeesSet from "../../HRSet";
import { useState, useEffect } from "react";
import { useAddNewEmployeeDocumentsListMutation } from "./employeeDocumentsListsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../../config/UserRoles";
import { ACTIONS } from "../../../../config/UserActions";
import useAuth from "../../../../hooks/useAuth";
import {
  useGetEmployeeDocumentsListsQuery,
  
} from "./employeeDocumentsListsApiSlice";
import { useSelector } from "react-redux";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetAcademicYearsQuery } from "../../AcademicsSet/AcademicYears/academicYearsApiSlice";
import { TITLE_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";

const NewEmployeeDocumentsListForm = () => {
  const Navigate = useNavigate();

  const [
    addNewEmployeeDocumentsList,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      error: addError,
    },
  ] = useAddNewEmployeeDocumentsListMutation(); //it will not execute the mutation nownow but when called

  //prepare the permission variables
  const { userId, canEdit, canDelete, canAdd, canCreate, isParent, status2 } =
    useAuth();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const {
    data: employeeDocumentsListsData,
    isLoading:isEmpDocsLoading,
    isSuccess:isEmpDocsSuccess,
    isError:isEmpDocsError,
    error:empDocsError,
  } = useGetEmployeeDocumentsListsQuery(
    {
     
      endpointName: "NewEmployeeDocumentsListForm",
    } || {},
    {
     
      refetchOnFocus: true, 
      refetchOnMountOrArgChange: true, 
    }
  );
  let filteredAcademicYearsList = [];
  if (isEmpDocsSuccess) {
    // Extract entities and convert to an array
    const { entities } = employeeDocumentsListsData;
    const employeeDocumentsListsArray = Object.values(entities);
  
    // Filter the academicYears based on documentsAcademicYear
    filteredAcademicYearsList = academicYears.filter((academicYear) =>
      !employeeDocumentsListsArray.some(
        (doc) => doc.documentsAcademicYear === academicYear.title
      )
    );
  }
  //initialisation of states for each input
  const [employeeDocumentsList, setEmployeeDocumentsList] = useState([
    { documentTitle: "Employee Photo", isRequired: false, isLegalised: false },

  ]);
  //const [documentReference, setDocumentReference] = useState('')
  const [documentTitle, setDocumentTitle] = useState("");
  const [validDocumentTitle, setValidDocumentTitle] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [isLegalised, setIsLegalised] = useState(false);
  const [documentsList, setDocumentsList] = useState([]);
  const [documentsAcademicYear, setDocumentsAcademicYear] = useState("");
  const [validDocumentsAcademicYear, setValidDocumentsAcademicYear] =
    useState("");
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
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
      //if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list

      setEmployeeDocumentsList([{ documentTitle: "Employee Photo", isRequired: false, isLegalised: false },]);
      setDocumentsAcademicYear("");
      setValidDocumentsAcademicYear(false);
      Navigate("/settings/hrSet/employeeDocumentsListsList"); //will navigate here after saving
    }
  }, [isAddSuccess, Navigate]); //even if no success it will navigate and not show any warning if failed or success

  //handlers to get the individual states from the input

  //const onDocumentReferenceChanged = e => setDocumentReference(e.target.value)
  const onDocumentTitleChanged = (e) => setDocumentTitle(e.target.value);
  const onIsRequiredChanged = (e) => setIsRequired(e.target.value);
  const onIsLegalisedChanged = (e) => setIsLegalised(e.target.value);
  const onDocumentsAcademicYearChanged = (e) =>
    setDocumentsAcademicYear(e.target.value);

  // to deal with employeeDocumentsList education entries:
  // Handler to update an entry field
  const handleFieldChange = (index, field, value) => {
    const updatedEntries = [...employeeDocumentsList];
    updatedEntries[index][field] = value;
    setEmployeeDocumentsList(updatedEntries);
  };

  const handleAddEntry = () => {
    setEmployeeDocumentsList([
      ...employeeDocumentsList,
      { documentTitle: "", isRequired: false, isLegalised: false },
    ]);
  };

  const handleRemoveEntry = (index) => {
    const updatedEntries = employeeDocumentsList.filter((_, i) => i !== index);
    setEmployeeDocumentsList(updatedEntries);
  };

  //to check if we can save before onsave, if every one is true, and also if we are not loading status
  const canSave =
    [
      validDocumentsAcademicYear,
      ...employeeDocumentsList.map((entry) => entry.documentTitle),
    ].every(Boolean) && !isAddLoading;

  const onSaveEmployeeDocumentsListClicked = async (e) => {
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
      await addNewEmployeeDocumentsList({
        documentsList: employeeDocumentsList,
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
  const handleCancel = () => {
    Navigate("/settings/hrSet/employeeDocumentsListsList");
  };

  //the error messages to be displayed in every case according to the class we put in like 'form input incomplete... which will underline and highlight the field in that cass
  const errClass = isAddError ? "errmsg" : "offscreen";
  //const validEmployeeDocumentsListClass = !validEmployeeDocumentsListName ? 'form__input--incomplete' : ''
  //const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
  //const validRolesClass = !Boolean(userRoles.length) ? 'form__input--incomplete' : ''

  const content = (
    <>
      <EmployeesSet />
      <p className={isAddError ? "errmsg" : "offscreen"}>
        {addError?.data?.message}
      </p>
      <form
        lassName="form bg-gray-100 p-6 rounded shadow-lg max-w-md mx-auto"
        onSubmit={onSaveEmployeeDocumentsListClicked}
      >
        <div className="form__title-row mb-4">
          <h2 className="text-xl font-semibold">
            New EmployeeDocumentsList Form
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
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Year</option>
            {filteredAcademicYearsList.map((year) => (
              <option key={year.id} value={year.title}>
                {year.title}
              </option>
            ))}
          </select>
        </div>
        <h1 className="text-lg font-semibold mb-4">Employee Documents</h1>
        {employeeDocumentsList.map((entry, index) => (
          <div key={index} className="mb-4 p-4 bg-white rounded shadow">
            <div className="mb-2">
              <input
                type="text"
                placeholder="Document Title"
                value={entry.documentTitle}
                onChange={(e) =>
                  handleFieldChange(index, "documentTitle", e.target.value)
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            {index >= 1 && (<button
              type="button"
              onClick={() => handleRemoveEntry(index)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>)}
          </div>
        ))}
        <button type="button" onClick={handleAddEntry}>
          Add Document
        </button>
        <div className="flex justify-end items-center space-x-4">
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            type="submit"
            onClick={onSaveEmployeeDocumentsListClicked}
            disabled={!canSave}
          >
            Save Changes
          </button>
          <button
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
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
export default NewEmployeeDocumentsListForm;
