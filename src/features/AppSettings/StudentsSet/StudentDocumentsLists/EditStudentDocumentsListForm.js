import React from "react";
import StudentsSet from "../../StudentsSet";
import { useState, useEffect } from "react";
import { useUpdateStudentDocumentsListMutation } from "./studentDocumentsListsApiSlice";
import { useNavigate } from "react-router-dom";
// import useAuth from "../../../../hooks/useAuth";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";
import { NAME_REGEX } from "../../../../config/REGEX";

const EditStudentDocumentsListForm = ({ listToEdit }) => {
  //console.log(listToEdit.documentsAcademicYear,'lllllyear')
  const navigate = useNavigate();
  const { _id } = listToEdit;
  //console.log(listToEdit,'listToEdit in form')
  const [documentsAcademicYear, setDocumentsAcademicYear] = useState(
    listToEdit?.documentsAcademicYear
  );
  const [studentDocumentsList, setStudentDocumentsList] = useState(
    listToEdit.documentsList || []
  );
  console.log(listToEdit.documentsList);
  const [documentTitle, setDocumentTitle] = useState("");
  const [validDocumentTitle, setValidDocumentTitle] = useState(false);
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  // const { userId, canEdit, canDelete, canAdd, canCreate, isParent, status2 } =
  //   useAuth();
  // Confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [
    updateStudentDocumentsList,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateStudentDocumentsListMutation(); //it will not execute the mutation nownow but when called

  // Validation effects
  useEffect(() => {
    const allValid = studentDocumentsList?.every((entry) =>
      NAME_REGEX.test(entry.documentTitle)
    );
    setValidDocumentTitle(allValid);
  }, [studentDocumentsList]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setStudentDocumentsList([]);
      setDocumentsAcademicYear("");
      setDocumentTitle("");
      navigate("/settings/studentsSet/studentDocumentsListsList"); //will navigate here after saving
    }
  }, [isUpdateSuccess, navigate]); //even if no success it will navigate and not show any warning if failed or success

  // Ensure that the first three documents cannot be removed
  // const isRemovable = (index) => index >= 2; //the first threea reprpedefined(stud photo, father photo, mother photo)
  const isRemovable = (index) => {
    const nonRemovableTitles = [
      "Student Photo",
      "Father Photo",
      "Mother Photo",
    ];
    return !nonRemovableTitles.includes(
      studentDocumentsList[index]?.documentTitle
    );
  };

  const handleFieldChange = (index, field, value) => {
    const updatedEntries = studentDocumentsList.map((entry, i) =>
      i === index
        ? {
            ...entry,
            [field]: value, // Update the specific field
          }
        : entry
    );
    setStudentDocumentsList(updatedEntries);
  };

  // // Handler to update an entry field
  // const handleFieldChange = (index, field, value) => {
  //   const updatedEntries = [...studentDocumentsList];
  //   updatedEntries[index][field] = value;
  //   setStudentDocumentsList(updatedEntries);
  // };
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
    ].every(Boolean) && !isUpdateLoading;

  const onSaveStudentDocumentsListClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async () => {
    setShowConfirmation(false);
    try {
      const response = await updateStudentDocumentsList({
        id: _id,
        documentsList: studentDocumentsList,
        documentsAcademicYear,
      });
      if (response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      } else if (response?.data?.message) {
        // Success response
        triggerBanner(response?.data?.message, "success");
      } else if (response?.error?.data?.message) {
        // Error response
        triggerBanner(response?.error?.data?.message, "error");
      } else if (isUpdateError) {
        // In case of unexpected response format
        triggerBanner(updateError?.data?.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner(error?.data?.message, "error");
    }
  };

  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  const handleCancel = () => {
    navigate("/settings/studentsSet/studentDocumentsListsList/");
  };

  const content = (
    <>
      <StudentsSet />

      <form
        className="form-container"
        onSubmit={onSaveStudentDocumentsListClicked}
      >
        <h2 className="formTitle">
          Edit Documents List Form for {documentsAcademicYear}{" "}
        </h2>
        <div className="formSectionContainer">
          <h3 className="formSectionTitle">Student Documents</h3>
          <div className="formSection">
            {studentDocumentsList.map((entry, index) => (
              <div key={index} className="formSection">
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
                    aria-label="document title"
                    placeholder="[3-25 characters]"
                    type="text"
                    id={`${entry.documentTitle}-${index}`}
                    name={`${entry.documentTitle}-${index}`}
                    value={entry.documentTitle}
                    onChange={(e) =>
                      handleFieldChange(index, "documentTitle", e.target.value)
                    }
                    className={`formInputText`}
                    disabled={!isRemovable(index)} // Disable editing for the  three elements if needed
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

                {isRemovable(index) && (
                  <button
                    className="delete-button w-full"
                    aria-label="remove document"
                    type="button"
                    onClick={() => handleRemoveEntry(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="add-button w-full"
            aria-label="add document"
            onClick={handleAddEntry}
          >
            Add Document
          </button>
        </div>
        <div className="cancelSavebuttonsDiv">
          <button
            aria-label="cancel edit list"
            className="cancel-button"
            onClick={() =>
              navigate("/settings/studentsSet/studentDocumentsListsList/")
            }
          >
            Cancel
          </button>
          <button
            aria-label="submit list"
            className="save-button"
            type="submit"
            disabled={!canSave || isUpdateLoading}
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
        message="Are you sure you want to save Changes?"
      />
    </>
  );

  return content;
};
export default EditStudentDocumentsListForm;
