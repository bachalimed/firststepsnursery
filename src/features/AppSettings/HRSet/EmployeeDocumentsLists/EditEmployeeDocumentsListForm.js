import React from "react";
import HRSet from "../../HRSet";
import { useState, useEffect } from "react";
import { useUpdateEmployeeDocumentsListMutation } from "./employeeDocumentsListsApiSlice";
import { useNavigate } from "react-router-dom";
import { TITLE_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";

const EditEmployeeDocumentsListForm = ({ listToEdit }) => {
  useEffect(() => {
    document.title = "Edit Employee Documents List";
  });

  //console.log(listToEdit.documentsAcademicYear,'lllllyear')
  const navigate = useNavigate();
  const { _id: id } = listToEdit;
  ///console.log(id, "ddddd");
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
  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const [
    updateEmployeeDocumentsList,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateEmployeeDocumentsListMutation(); //it will not execute the mutation nownow but when called

  useEffect(() => {
    setValidDocumentTitle(TITLE_REGEX.test(documentTitle));
  }, [documentTitle]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setEmployeeDocumentsList([]);
      setDocumentsAcademicYear("");
      navigate("/settings/HRSet/EmployeeDocumentsListsList/"); //will navigate here after saving
    }
  }, [isUpdateSuccess, navigate]); //even if no success it will navigate and not show any warning if failed or success

  // Ensure that the first three documents cannot be removed
  const isRemovable = (index) => index >= 1;

  const handleActionChange = (index, action) => {
    setEmployeeDocumentsList((prevList) =>
      prevList.map((entry, i) =>
        i === index ? { ...entry, [action]: !entry[action] } : entry
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
    ].every(Boolean) && !isUpdateLoading;

  const onSaveEmployeeDocumentsListClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);
    try {
      const response = await updateEmployeeDocumentsList({
        id: listToEdit.id,
        documentsList: employeeDocumentsList,
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

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  const handleCancel = () => {
    navigate("/settings/employeesSet/employeeDocumentsListsList/");
  };

  

  const content = (
    <>
      <HRSet />

      <form
        className="form-container"
        onSubmit={onSaveEmployeeDocumentsListClicked}
      >
        <h2 className="formTitle">
          Edit Employee Documents List for {documentsAcademicYear}
        </h2>
        <div className="formSectionContainer">
          <h3 className="formSectionTitle">Employee documents</h3>
          <div className="formSection">
            {employeeDocumentsList.map((entry, index) => (
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
                      handleActionChange(index, "documentTitle", e.target.value)
                    }
                    className={`formInputText`}
                    disabled={index < 1} // Disable editing for the first  element if needed
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
            aria-label="add document"
            className="add-button w-full"
            type="button"
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
              navigate("/settings/HRSet/EmployeeDocumentsListsList")
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
export default EditEmployeeDocumentsListForm;
