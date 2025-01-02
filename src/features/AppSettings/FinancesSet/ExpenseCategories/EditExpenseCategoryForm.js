import { useState, useEffect } from "react";
import { useUpdateExpenseCategoryMutation } from "./expenseCategoriesApiSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import FinancesSet from "../../FinancesSet";
import useAuth from "../../../../hooks/useAuth";
import { useSelector } from "react-redux";
import { RiAddLargeLine } from "react-icons/ri";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AcademicsSet/AcademicYears/academicYearsSlice";
import {  NAME_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
// import LoadingStateIcon from "../../../../Components/LoadingStateIcon";


const EditExpenseCategoryForm = ({ expenseCategory }) => {
  const navigate = useNavigate();
  const { userId, isAdmin } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const [updateExpenseCategory, { isLoading:isUpdateLoading, isSuccess:isUpdateSuccess, isError:isUpdateError, error:updateError }] =
    useUpdateExpenseCategoryMutation();

  // const {
  //   data: services, //the data is renamed services
  //   isLoading: isServicesLoading,
  //   isSuccess: isServicesSuccess,
  //   isError: isServicesError,
  //   error: servicesError,
  // } = useGetServicesByYearQuery(
  //   {
  //     selectedYear: selectedAcademicYear?.title,
  //     endpointName: "EditExpenseCategoryForm",
  //   } || {},
  //   {
  //     refetchOnFocus: true,
  //     refetchOnMountOrArgChange: true,
  //   }
  // );

  // let servicesList = isServicesSuccess ? Object.values(services.entities) : [];

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Consolidated form state
  const [formData, setFormData] = useState({
    id: expenseCategory?._id,
    expenseCategoryLabel: expenseCategory?.expenseCategoryLabel,
    expenseCategoryYears: expenseCategory?.expenseCategoryYears,
    expenseCategoryItems: expenseCategory?.expenseCategoryItems,
    // expenseCategoryService:expenseCategory?.expenseCategoryService?._id,
    expenseCategoryIsActive: expenseCategory?.expenseCategoryIsActive,
    expenseCategoryOperator: userId,
  });

  const [validity, setValidity] = useState({
    validExpenseCategoryLabel: false,
    validExpenseCategoryYears: false,
    validExpenseCategoryItems: false,
    // validExpenseCategoryService: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validExpenseCategoryLabel: NAME_REGEX.test(formData.expenseCategoryLabel),
      validExpenseCategoryYears: formData?.expenseCategoryYears?.length > 0,
      validExpenseCategoryItems: formData?.expenseCategoryItems?.length > 0,
      // validExpenseCategoryService: OBJECTID_REGEX.test(formData.expenseCategoryService)
    }));
  }, [formData]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setFormData({
        id: "",
        expenseCategoryLabel: "",
        expenseCategoryYears: [],
        expenseCategoryItems: [],
        expenseCategoryIsActive: "",
        // expenseCategoryService:"",
        expenseCategoryOperator: "",
        expenseCategoryCreator: "",
      });
      navigate("/settings/financesSet/expenseCategoriesList/");
    }
  }, [isUpdateSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleYearChange = (year) => {
    setFormData((prev) => {
      const updatedYears = prev.expenseCategoryYears.includes(year)
        ? prev.expenseCategoryYears.filter((yr) => yr !== year)
        : [...prev.expenseCategoryYears, year];
      return { ...prev, expenseCategoryYears: updatedYears };
    });
  };

  const handleAddItem = () => {
    const newItem = formData.newItemInput?.trim();
    if (newItem && !formData.expenseCategoryItems.includes(newItem)) {
      setFormData((prev) => ({
        ...prev,
        expenseCategoryItems: [...prev.expenseCategoryItems, newItem],
        newItemInput: "", // Reset the input field after adding
      }));
    }
  };

  

  const handleRemoveItem = (itemToRemove) => {
    setFormData((prev) => ({
      ...prev,
      expenseCategoryItems: prev.expenseCategoryItems.filter(
        (item) => item !== itemToRemove
      ),
    }));
  };

  const canSave = Object.values(validity).every(Boolean) && !isUpdateLoading;

  const onSaveExpenseCategoryClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      setShowConfirmation(true);
    }
  };

  const { triggerBanner } = useOutletContext(); // Access banner trigger
  // This function handles the confirmed save action
  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);

    try {
      const response = await updateExpenseCategory(formData);
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
  // console.log(validity, "valisty");

  // console.log(formData, "formData");
  return  (
      <>
        <FinancesSet />

        <form
          onSubmit={onSaveExpenseCategoryClicked}
          className="form-container"
        >
          <h2 className="formTitle ">
            Edit Expense category: {`${formData?.expenseCategoryLabel} `}
          </h2>
          <h3 className="formSectionTitle">Expense category details</h3>
          <div className="formSection">
            <div className="formLineDiv">
              {/* ExpenseCategory Active Status */}

              <label className="formInputLabel">
                Category active:
                <div className="formCheckboxItemsDiv">
                  <label
                    htmlFor="expenseCategoryIsActive"
                    className="formCheckboxChoice"
                  >
                    <input
                      aria-label="expense category active"
                      type="checkbox"
                      id="expenseCategoryIsActive"
                      name="expenseCategoryIsActive"
                      checked={formData.expenseCategoryIsActive}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          expenseCategoryIsActive: e.target.checked,
                        }))
                      }
                      className={`formCheckbox`}
                    />{" "}
                    Expense category is active
                  </label>
                </div>
              </label>
              {/* ExpenseCategory Label */}

              <label htmlFor="expenseCategoryLabel" className="formInputLabel">
                Expense category label{" "}
                {!validity.validExpenseCategoryLabel && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="expense category"
                  aria-invalid={!validity.validExpenseCategoryLabel}
                  placeholder="[3-25 letters]"
                  type="text"
                  id="expenseCategoryLabel"
                  name="expenseCategoryLabel"
                  value={formData.expenseCategoryLabel}
                  onChange={handleInputChange}
                  className={`formInputText`}
                  required
                />{" "}
              </label>
            </div>
          </div>
          {/* ExpenseCategory Years Selection - Using Checkboxes */}
          <h3 className="formSectionTitle">Expense category years</h3>
          <div className="formSection">
            ExpenseCategory Years{" "}
            {!validity.validExpenseCategoryYears && (
              <span className="text-red-600">*</span>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 mt-1 max-h-80 overflow-y-auto">
              {academicYears
                .filter((year) => year?.title !== "1000") // Exclude the year with title "1000"
                .map((year, index) => {
                  const isSelected = formData.expenseCategoryYears.includes(
                    year.title
                  ); // Check if the year is selected

                  return (
                    <button
                      aria-label="selectYears"
                      key={index}
                      type="button"
                      onClick={() => handleYearChange(year.title)} // Use onClick to toggle selection
                      className={`px-3 py-2  rounded-md ${
                        isSelected
                          ? "bg-sky-700 text-white hover:bg-sky-600"
                          : "bg-gray-200 text-gray-700 hover:bg-sky-600 hover:text-white"
                      }`}
                    >
                      <div className="font-semibold">{year.title}</div>
                    </button>
                  );
                })}
            </div>
          </div>

          <h3 className="formSectionTitle">Expense category items</h3>
          <div className="formSection">
            {/* Input Section */}
            <label htmlFor="newItemInput" className="formInputLabel">
              ExpenseCategory Items{" "}
              {!validity.validExpenseCategoryItems && (
                <span className="text-red-600">*</span>
              )}
              <div className="flex flex-col items-center space-y-2">
                <input
                  aria-label="new expense item"
                  type="text"
                  id="newItemInput"
                  name="newItemInput"
                  value={formData.newItemInput}
                  onChange={handleInputChange}
                  className={`formInputText`}
                  placeholder="[3-25 letters]"
                />
                <button
                  aria-label="new expense item"
                  type="button"
                  onClick={handleAddItem}
                  className="add-button w-full flex  justify-center items-center "
                >
                  <RiAddLargeLine className="h-6 w-4 " />
                </button>
              </div>
            </label>

            {/* Display Items as Buttons */}
            <div className="formSection">
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {formData.expenseCategoryItems.map((item) => (
                <button
                key={item}
                aria-label="remove expense item"
                type="button"
                onClick={() => isAdmin && handleRemoveItem(item)}
                className={`px-3 py-2 rounded-md flex items-center justify-center ${
                  isAdmin ? "bg-red-200 hover:bg-red-400" : "bg-gray-300"
                }`}
                disabled={!isAdmin} // Disable button for non-admins
              >
                {item}
              </button>
              ))}
            </div>
          </div>
          </div>

          {/* Save Button */}
          <div className="cancelSavebuttonsDiv">
            <button
              aria-label="cancel edit expense category"
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/settings/financesSet/expenseCategoriesList/")
              }
            >
              Cancel
            </button>
            <button
              aria-label="submit expense category"
              type="submit"
              className="save-button"
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
          message="Are you sure you want to save?"
        />
      </>
    );
  
};

export default EditExpenseCategoryForm;
