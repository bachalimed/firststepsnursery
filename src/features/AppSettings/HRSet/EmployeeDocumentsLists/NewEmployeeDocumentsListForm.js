import React from "react";
import EmployeesSet from "../../HRSet";
import { useState, useEffect } from "react";
import { useAddNewEmployeeDocumentsListMutation } from "./employeeDocumentsListsApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import { useGetEmployeeDocumentsListsQuery } from "./employeeDocumentsListsApiSlice";
import { useSelector } from "react-redux";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AcademicsSet/AcademicYears/academicYearsSlice";
import { TITLE_REGEX, NAME_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
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
    isLoading: isEmpDocsLoading,
    isSuccess: isEmpDocsSuccess,
    isError: isEmpDocsError,
    error: empDocsError,
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
    filteredAcademicYearsList = academicYears.filter(
      (academicYear) =>
        !employeeDocumentsListsArray.some(
          (doc) => doc.documentsAcademicYear === academicYear.title
        )
    );
  }

  const { triggerBanner } = useOutletContext(); // Access banner trigger
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

  // Validation effects
  useEffect(() => {
    const allValid = employeeDocumentsList.every((entry) =>
      NAME_REGEX.test(entry.documentTitle)
    );
    setValidDocumentTitle(allValid);
  }, [employeeDocumentsList]);
  useEffect(() => {
    setValidDocumentsAcademicYear(TITLE_REGEX.test(documentsAcademicYear));
  }, [documentsAcademicYear]);

  useEffect(() => {
    if (isAddSuccess) {
      //if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list

      setEmployeeDocumentsList([
        {
          documentTitle: "Employee Photo",
          isRequired: false,
          isLegalised: false,
        },
      ]);
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
      const response = await addNewEmployeeDocumentsList({
        documentsList: employeeDocumentsList,
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
  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  const handleCancel = () => {
    Navigate("/settings/hrSet/employeeDocumentsListsList");
  };
  let content;
  if (isEmpDocsLoading) {
    content = (
      <>
        {" "}
        <EmployeesSet />
        <LoadingStateIcon />
      </>
    );
  }
  if (isEmpDocsSuccess) {
    content = (
      <>
        <EmployeesSet />

        <form
          className="form-container"
          onSubmit={onSaveEmployeeDocumentsListClicked}
        >
          <h2 className="formTitle">New EmployeeDocumentsList Form</h2>
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
                  aria-label="document academic year"
                  id="documentsAcademicYear"
                  name="documentsAcademicYear"
                  value={documentsAcademicYear}
                  onChange={onDocumentsAcademicYearChanged}
                  className={`formInputText`}
                >
                  <option value="">Select Year</option>
                  {filteredAcademicYearsList.map((year) => (
                    <option key={year.id} value={year.title}>
                      {year.title}
                    </option>
                  ))}
                </select>{" "}
              </label>
            </div>
          </div>
          <h3 className="formSectionTitle">Employee Documents</h3>
          <div className="formSection">
            {employeeDocumentsList.map((entry, index) => (
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
                      aria-label="document title"
                      placeholder="[3-25 characters]"
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
                     disabled={index < 1} // Disable input for the  element to avoid changing title because we need exact syntax of titile
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
                {index >= 1 && (
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
              className="add-button w-full"
              onClick={handleAddEntry}
            >
              Add Document
            </button>
          </div>

          <div className="cancelSavebuttonsDiv">
            <button
              aria-label="cancel new document list"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              aria-label="submit new document list"
              className="save-button"
              type="submit"
              onClick={onSaveEmployeeDocumentsListClicked}
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
  }

  return content;
};
export default NewEmployeeDocumentsListForm;
