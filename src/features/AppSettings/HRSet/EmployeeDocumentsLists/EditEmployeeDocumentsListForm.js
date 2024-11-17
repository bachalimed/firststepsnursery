import React from "react";
import EmployeesSet from "../../HRSet";
import { useState, useEffect } from "react";
import { useGetAcademicYearsQuery } from "../../AcademicsSet/AcademicYears/academicYearsApiSlice";
import { useUpdateEmployeeDocumentsListMutation } from "./employeeDocumentsListsApiSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../../../config/UserRoles";
import { ACTIONS } from "../../../../config/UserActions";
import { selectAllAcademicYears } from "../../AcademicsSet/AcademicYears/academicYearsApiSlice";
import useAuth from "../../../../hooks/useAuth";

import { useSelector } from "react-redux";
import { Puff } from "react-loading-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TITLE_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";


const EditEmployeeDocumentsListForm = ({ listToEdit }) => {
  //console.log(listToEdit.documentsAcademicYear,'lllllyear')
  const Navigate = useNavigate();
  const id = listToEdit.id;
  console.log(id, "ddddd");
  const [documentsAcademicYear, setDocumentsAcademicYear] = useState(
    listToEdit.documentsAcademicYear
  );
  const [employeeDocumentsList, setEmployeeDocumentsList] = useState(
    listToEdit.documentsList || []
  );
  const [documentTitle, setDocumentTitle] = useState("");
  const [validDocumentTitle, setValidDocumentTitle] = useState(false);
//confirmation Modal states
const [showConfirmation, setShowConfirmation] = useState(false);

  const { userId, canEdit, canDelete, canAdd, canCreate, isParent, status2 } =
    useAuth();

  const [
    updateEmployeeDocumentsList,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading,
      isSuccess,
      isError,
      error,
    },
  ] = useUpdateEmployeeDocumentsListMutation(); //it will not execute the mutation nownow but when called

  useEffect(() => {
    setValidDocumentTitle(TITLE_REGEX.test(documentTitle));
  }, [documentTitle]);

  useEffect(() => {
    if (isSuccess) {
      setEmployeeDocumentsList([]);
      setDocumentsAcademicYear("");
      Navigate("/settings/employeesSet/employeeDocumentsListsList"); //will navigate here after saving
    }
  }, [isSuccess, Navigate]); //even if no success it will navigate and not show any warning if failed or success

  const handleFieldChange = (index, field, value) => {
    setEmployeeDocumentsList((prevState) =>
      prevState.map((doc, i) =>
        i === index ? { ...doc, [field]: value } : doc
      )
    );
  };

  const handleAddEntry = () => {
    setEmployeeDocumentsList([
      ...employeeDocumentsList,
      { documentTitle: "", isRequired: false, isLegalised: false },
    ]);
  };

  const handleRemoveEntry = (index) => {
    setEmployeeDocumentsList(
      employeeDocumentsList.filter((_, i) => i !== index)
    );
  };

  //to check if we can save before onsave, if every one is true, and also if we are not loading status
  const canSave =
    [
      documentsAcademicYear,
      ...employeeDocumentsList.map((entry) => entry.documentTitle),
    ].every(Boolean) && !isLoading;

  const onSaveEmployeeDocumentsListClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);

      await updateEmployeeDocumentsList({
        id: listToEdit.id,
        documentsList: employeeDocumentsList,
        documentsAcademicYear,
      });
      if (isError) {
        console.error("Error saving:", error);
      }
    }

// Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  const handleCancel = () => {
    Navigate("/settings/employeesSet/employeeDocumentsListsList/");
  };

  // const [isRequired, setIsRequired] = useState(false)
  // const [isLegalised, setIsLegalised] = useState(false)
  // const [documentsList, setDocumentsList] = useState([])
  // //use effect is used to validate the inputs against the defined REGEX above
  // //the previous constrains have to be verified on the form for teh user to know
  // //handlers to get the individual states from the input

  // //const onDocumentReferenceChanged = e => setDocumentReference(e.target.value)
  // const onDocumentTitleChanged = e => setDocumentTitle(e.target.value)
  // const onIsRequiredChanged = e => setIsRequired(e.target.value)
  // const onIsLegalisedChanged = e => setIsLegalised(e.target.value)

  //the error messages to be displayed in every case according to the class we put in like 'form input incomplete... which will underline and highlight the field in that cass
  const errClass = isError ? "errmsg" : "offscreen";
  //const validEmployeeDocumentsListClass = !validEmployeeDocumentsListName ? 'form__input--incomplete' : ''
  //const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
  //const validRolesClass = !Boolean(userRoles.length) ? 'form__input--incomplete' : ''

  const content = (
    <>
      <EmployeesSet />
      <p className={errClass}>{error?.data?.message}</p>
      <form className="form" onSubmit={onSaveEmployeeDocumentsListClicked}>
        <div className="form__title-row">
          <h2>Editing Employee Documents List for {documentsAcademicYear}</h2>
        </div>
        <h1>Employee Documents</h1>
        {employeeDocumentsList.map((entry, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Document Title"
              value={entry.documentTitle}
              onChange={(e) =>
                handleFieldChange(index, "documentTitle", e.target.value)
              }
            />
            <label>
              <input
                type="checkbox"
                checked={entry.isRequired}
                onChange={(e) =>
                  handleFieldChange(index, "isRequired", e.target.checked)
                }
              />
              Is Required?
            </label>
            <label>
              <input
                type="checkbox"
                checked={entry.isLegalised}
                onChange={(e) =>
                  handleFieldChange(index, "isLegalised", e.target.checked)
                }
              />
              Is Legalised?
            </label>
            <button type="button" onClick={() => handleRemoveEntry(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddEntry}>
          Add Document
        </button>
        <div className="flex justify-end items-center space-x-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            type="submit"
            title="Save"
            onClick={onSaveEmployeeDocumentsListClicked}
            disabled={!canSave}
          >
            Save Changes
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
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
        message="Are you sure you want to save this student?"
      />
    </>
  );

  return content;
};
export default EditEmployeeDocumentsListForm;
