import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { academicYearAdded } from "./academicYearsSlice"; // Redux action
import { useAddNewAcademicYearMutation } from "./academicYearsApiSlice"; // Redux API action
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import AcademicsSet from "../../AcademicsSet";
import useAuth from "../../../../hooks/useAuth";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";

const NewAcademicYearForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAdmin, userId: academicYearCreator } = useAuth();
  const [title, setTitle] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState("");
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId);
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  );
  const academicYears = useSelector(selectAllAcademicYears);

  // State to determine if the form can be submitted
  const [canSubmit, setCanSubmit] = useState(false);
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Helper function to format date
  const formatDate = (day, month, year, hour, minute) => {
    return `${day}/${month}/${year} ${hour}:${minute}`;
  };
  const handleYearStartChange = (e) => {
    const startYear = e.target.value;

    // Validate input as a 4-digit number
    if (startYear.length <= 4 && /^\d{0,4}$/.test(startYear)) {
      if (startYear.length === 4) {
        const endYear = (parseInt(startYear) + 1).toString();
        const academicYearTitle = `${startYear}/${endYear}`;

        // Check if the title already exists in the array
        if (academicYears.includes(academicYearTitle)) {
          setTitleError(`Academic year ${academicYearTitle} already exists!`);
          setTitle("");
          setYearStart("");
          setYearEnd("");
        } else {
          setTitleError("");
          setTitle(academicYearTitle);

          // Set yearStart and yearEnd as Date objects
          const generatedYearStart = new Date(
            `${startYear}-08-31T00:00:00.000Z`
          ); // Set to August 31st
          const generatedYearEnd = new Date(`${endYear}-09-01T00:00:00.000Z`); // Set to September 1st

          setYearStart(generatedYearStart);
          setYearEnd(generatedYearEnd);
        }
      } else {
        // Reset title and dates if the input is not fully valid
        setTitle(`${startYear}/${parseInt(startYear) + 1}`); // Set the title while typing
        setYearStart("");
        setYearEnd("");
        setTitleError("");
      }
    } else {
      // If the input is invalid, show an error
      setTitleError("Please enter a valid 4-digit year.");
    }
  };

  // Utility function to reset fields
  const resetFields = () => {
    setTitle("");
    setYearStart("");
    setYearEnd("");
  };

  // Redux mutation for adding the academic year
  const [
    addNewAcademicYear,
    {
      isLoading: isNewYearLoading,
      isError: isNewYearError,
      error: newYearError,
    },
  ] = useAddNewAcademicYearMutation();

  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!title || !yearStart || !yearEnd || !academicYearCreator) {
      setError("All fields are required.");
      return;
    }
    setShowConfirmation(true);
  };
  // This function handles the confirmed save action
  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);
    try {
      // Ensure yearStart and yearEnd are Date objects when creating the new academic year
      const newAcademicYear = await addNewAcademicYear({
        title,
        yearStart: new Date(yearStart), // Ensure it's a Date object
        yearEnd: new Date(yearEnd),
        academicYearCreator,
      }).unwrap();

      // Dispatch action to update the state in the slice
      dispatch(academicYearAdded(newAcademicYear)); //maybe no need to dispatch because it will update when querying again

      navigate("/settings/academicsSet/academicYears/"); // Redirect after successful creation
      if (newAcademicYear.data && newAcademicYear.data.message) {
        // Success response
        triggerBanner(newAcademicYear.data.message, "success");
      } else if (
        newAcademicYear?.error &&
        newAcademicYear?.error?.data &&
        newAcademicYear?.error?.data?.message
      ) {
        // Error response
        triggerBanner(newAcademicYear.error.data.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner("Failed to create academic year. Please try again.", "error");

      console.error("Error creating acadmic year:", error);
    }
  };
  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  // Update canSubmit state whenever relevant variables change
  useEffect(() => {
    setCanSubmit(
      !!title &&
        !!yearStart &&
        !!yearEnd &&
        !!academicYearCreator &&
        !titleError
    );
  }, [title, yearStart, yearEnd, academicYearCreator, titleError]);
  // console.log(
  //   title,
  //   yearStart,
  //   yearEnd,
  //   academicYearCreator,
  //   "title ,yearStart ,yearEnd,academicYearCreator"
  // );
  // academicYears.map((year) => {
  //   console.log(year, "year");
  // });
  return (
    <>
      <AcademicsSet />
     

        <form onSubmit={handleSubmit} className="form-container">
        <h2 className="text-2xl font-bold mb-6 text-center">
          New Academic Year
        </h2>
          <div className="mb-4">
            <label htmlFor=""  className="formInputLabel">
              Starting Year (Format: yyyy)
              <input
               aria-label="starting year"
               
               placeholder="[yyyy]"
                type="text"
                value={title.split("/")[0] || ""} // Show only the first year in input
                onChange={handleYearStartChange}
              
                maxLength="4"
                className={`w-full px-3 py-2 border rounded-md ${
                  titleError ? "border-red-600" : ""
                } focus:outline-none focus:ring-2 focus:ring-sky-700`}
              />
              {titleError && (
                <p className="text-red-600 text-sm mt-2">{titleError}</p>
              )}{" "}
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor=""  className="formInputLabel">
              Academic Year Title
              <input
              aria-label="year title"
                type="text"
                value={title}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor=""  className="formInputLabel">
              Year Start
              <input
                type="text"
                value={yearStart}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />{" "}
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor=""  className="formInputLabel">
              Year End
              <input
                type="text"
                value={yearEnd}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </label>
          </div>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-4">
            <button
              aria-label="cancel new"
              type="button"
              onClick={() => navigate("/settings/academicsSet/academicYears/")}
              className="cancel-button"
            >
              Cancel
            </button>
            <button

              type="submit"
              disabled={!canSubmit}
              className="w-full bg-sky-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              {isNewYearLoading ? "Creating..." : "Create Academic Year"}
            </button>
          </div>
          {/* {isNewYearError && (
            <p className="text-red-600 text-sm mt-2">
              {newYearError?.data?.message || "Error creating academic year."}
            </p>
          )} */}
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

export default NewAcademicYearForm;
