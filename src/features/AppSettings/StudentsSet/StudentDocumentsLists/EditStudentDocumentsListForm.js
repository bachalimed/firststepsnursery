import React from "react";
import StudentsSet from "../../StudentsSet";
import { useState, useEffect } from "react";
import { useGetAcademicYearsQuery } from "../../AcademicsSet/AcademicYears/academicYearsApiSlice";
import { useUpdateStudentDocumentsListMutation } from "./studentDocumentsListsApiSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../../../config/UserRoles";
import { ACTIONS } from "../../../../config/UserActions";
import { selectAllAcademicYears } from "../../AcademicsSet/AcademicYears/academicYearsApiSlice";
import useAuth from "../../../../hooks/useAuth";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useSelector } from "react-redux";
import { Puff } from "react-loading-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//constrains on inputs when creating new user

const TITLE_REGEX = /^[A-z/ 0-9]{8,20}$/;

const EditStudentDocumentsListForm = ({ listToEdit }) => {
  //console.log(listToEdit.documentsAcademicYear,'lllllyear')
  const Navigate = useNavigate();
  const {_id} = listToEdit;
 

  
  const [documentsAcademicYear, setDocumentsAcademicYear] = useState(
    listToEdit.documentsAcademicYear
  );
  const [studentDocumentsList, setStudentDocumentsList] = useState(
    listToEdit.documentsList || []
  );
  const [documentTitle, setDocumentTitle] = useState("");
  const [validDocumentTitle, setValidDocumentTitle] = useState(false);

  const { userId, canEdit, canDelete, canAdd, canCreate, isParent, status2 } =
    useAuth();
 // Confirmation Modal states
 const [showConfirmation, setShowConfirmation] = useState(false);
  const [
    updateStudentDocumentsList,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading,
      isSuccess,
      isError,
      error,
    },
  ] = useUpdateStudentDocumentsListMutation(); //it will not execute the mutation nownow but when called

  useEffect(() => {
    setValidDocumentTitle(TITLE_REGEX.test(documentTitle));
  }, [documentTitle]);

  useEffect(() => {
    if (isSuccess) {
      setStudentDocumentsList([]);
      setDocumentsAcademicYear("");
      setDocumentTitle("")
      Navigate("/settings/studentsSet/studentDocumentsListsList"); //will navigate here after saving
    }
  }, [isSuccess, Navigate]); //even if no success it will navigate and not show any warning if failed or success


   // Ensure that the first three documents cannot be removed
   const isRemovable = (index) => index >= 1;


  const handleFieldChange = (index, field, value) => {
    setStudentDocumentsList((prevState) =>
      prevState.map((doc, i) =>
        i === index ? { ...doc, [field]: value } : doc
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
    if (isRemovable(index)) {
      setStudentDocumentsList(
        studentDocumentsList.filter((_, i) => i !== index)
      );
    }
  };

  //to check if we can save before onsave, if every one is true, and also if we are not loading status
  const canSave =
    [
      documentsAcademicYear,
      ...studentDocumentsList.map((entry) => entry.documentTitle),
    ].every(Boolean) && !isLoading;

  const onSaveStudentDocumentsListClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      setShowConfirmation(true);
    }
  };

     const handleConfirmSave = async () => {
    setShowConfirmation(false);

    await updateStudentDocumentsList({
      id: _id,
      documentsList: studentDocumentsList,
      documentsAcademicYear,
    });
    if (isError) {
      console.error("Error saving:", error);
    }
  };
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  const handleCancel = () => {
    Navigate("/settings/studentsSet/studentDocumentsListsList/");
  };

  

  //the error messages to be displayed in every case according to the class we put in like 'form input incomplete... which will underline and highlight the field in that cass
  const errClass = isError ? "errmsg" : "offscreen";
  //const validStudentDocumentsListClass = !validStudentDocumentsListName ? 'form__input--incomplete' : ''
  //const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
  //const validRolesClass = !Boolean(userRoles.length) ? 'form__input--incomplete' : ''

  const content = (
    <>
      <StudentsSet />
      <p className={errClass}>{error?.data?.message}</p>
      <form className="form" onSubmit={onSaveStudentDocumentsListClicked}>
        <div className="form__title-row">
          <h2>Editing Student Documents List for {documentsAcademicYear}</h2>
        </div>
        <h1>Student Documents</h1>
        {studentDocumentsList.map((entry, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Document Title"
              value={entry.documentTitle}
              onChange={(e) =>
                handleFieldChange(index, "documentTitle", e.target.value)
              }
              disabled={index < 3} // Disable editing for the first three elements if needed
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
            {isRemovable(index) && ( <button type="button" onClick={() => handleRemoveEntry(index)}>
              Remove
            </button>)}
          </div>
        ))}
        <button type="button" onClick={handleAddEntry}>
          Add Document
        </button>
        <div className="flex justify-end gap-4">
        <button
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            type="submit"
            title="Save"
            onClick={onSaveStudentDocumentsListClicked}
            disabled={!canSave||isLoading}
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
export default EditStudentDocumentsListForm;
