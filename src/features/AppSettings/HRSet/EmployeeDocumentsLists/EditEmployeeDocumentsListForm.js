import React from "react";
import HRSet from "../../HRSet";
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
      isLoading:isDocumentsLoading,
      isSuccess:isDocumentsSuccess,
      isError:isDocumentsError,
      error:documentsError,
    },
  ] = useUpdateEmployeeDocumentsListMutation(); //it will not execute the mutation nownow but when called

  useEffect(() => {
    setValidDocumentTitle(TITLE_REGEX.test(documentTitle));
  }, [documentTitle]);

  useEffect(() => {
    if (isDocumentsSuccess) {
      setEmployeeDocumentsList([]);
      setDocumentsAcademicYear("");
      Navigate("/settings/HRSet/EmployeeDocumentsListsList/"); //will navigate here after saving
    }
  }, [isDocumentsSuccess, Navigate]); //even if no success it will navigate and not show any warning if failed or success


  
   // Ensure that the first three documents cannot be removed
   const isRemovable = (index) => index >= 1;

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
    if (isRemovable(index)) {
      setEmployeeDocumentsList(
        employeeDocumentsList.filter((_, i) => i !== index)
      );
    }
  };

  //to check if we can save before onsave, if every one is true, and also if we are not loading status
  const canSave =
    [
      documentsAcademicYear,
      ...employeeDocumentsList.map((entry) => entry.documentTitle),
    ].every(Boolean) && !isDocumentsLoading;

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
      if (isDocumentsError) {
        console.error("Error saving:", documentsError);
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
  const errClass = isDocumentsError ? "error-bar" : "offscreen";

  const content = (
    <>
      <HRSet />
     
      <form className="form-container" onSubmit={onSaveEmployeeDocumentsListClicked}>
        <div className="form__title-row">
          <h2>Edit Employee Documents List for {documentsAcademicYear}</h2>
        </div>
        <h1>Employee Documents</h1>
        {employeeDocumentsList.map((entry, index) => (
          <div key={index}>
            <input
             aria-label="document title"
             
             placeholder="[3-20 characters]"
              type="text"
             
              value={entry.documentTitle}
              onChange={(e) =>
                handleFieldChange(index, "documentTitle", e.target.value)
              }
              disabled={index < 1} // Disable editing for the first three elements if needed
            />
            <label>
              <input
                aria-label="is required"
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
               aria-label="is legalised"
                type="checkbox"
                checked={entry.isLegalised}
                onChange={(e) =>
                  handleFieldChange(index, "isLegalised", e.target.checked)
                }
              />
              Is Legalised?
            </label>
            {isRemovable(index) && (  <button  className="delete-button" aria-label="remove document" type="button" onClick={() => handleRemoveEntry(index)}>
              Remove
            </button>)}
          </div>
        ))}
        <button aria-label="add document" className="add-button" type="button" onClick={handleAddEntry}>
          Add Document
        </button>
        <div className="flex justify-end gap-4">
         
          <button
          aria-label="cancel new document list"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
          aria-label="submit edit document list"
           className="save-button"
            type="submit"
            title="Save"
            onClick={onSaveEmployeeDocumentsListClicked}
            disabled={!canSave||isDocumentsLoading}
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
        message="Are you sure you want to save Changes?"
      />
    </>
  );

  return content;
};
export default EditEmployeeDocumentsListForm;
