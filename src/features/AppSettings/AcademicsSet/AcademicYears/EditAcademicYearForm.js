import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateAcademicYearMutation } from "./academicYearsApiSlice"; // Redux API action for updating
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "./academicYearsSlice";
import AcademicsSet from "../../AcademicsSet";
import useAuth from "../../../../hooks/useAuth";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";

const EditAcademicYearForm = ({ academicYear }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAdmin, userId: academicYearCreator } = useAuth();

  // Initialize state with passed academicYear props
  const [title, setTitle] = useState(academicYear?.title || "");
  const [yearStart, setYearStart] = useState(academicYear?.yearStart || "");
  const [yearEnd, setYearEnd] = useState(academicYear?.yearEnd || "");
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState("");

  const academicYears = useSelector(selectAllAcademicYears);

  // State to determine if the form can be submitted
  const [canSubmit, setCanSubmit] = useState(false);


  //confirmation Modal states
const [showConfirmation, setShowConfirmation] = useState(false);
  const handleYearStartChange = (e) => {
    const startYear = e.target.value;

    if (startYear.length <= 4 && /^\d{0,4}$/.test(startYear)) {
      if (startYear.length === 4) {
        const endYear = (parseInt(startYear) + 1).toString();
        const academicYearTitle = `${startYear}/${endYear}`;

        // Check if the title already exists
        if (
          academicYears.some((year) => year.title === academicYearTitle) &&
          academicYearTitle !== academicYear.title
        ) {
          setTitleError(`Academic year ${academicYearTitle} already exists!`);
          setTitle("");
          setYearStart("");
          setYearEnd("");
        } else {
          setTitleError("");
          setTitle(academicYearTitle);

          // Set yearStart and yearEnd as Date objects
          const generatedYearStart = new Date(`${startYear}-08-31T00:00:00.000Z`);
          const generatedYearEnd = new Date(`${endYear}-09-01T00:00:00.000Z`);

          setYearStart(generatedYearStart);
          setYearEnd(generatedYearEnd);
        }
      } else {
        setTitle(`${startYear}/${parseInt(startYear) + 1}`);
        setYearStart("");
        setYearEnd("");
        setTitleError("");
      }
    } else {
      setTitleError("Please enter a valid 4-digit year.");
    }
  };

  // Redux mutation for updating the academic year
  const [
    updateAcademicYear,
    { isLoading: isUpdating, isError: isUpdateError, error: updateError },
  ] = useUpdateAcademicYearMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !yearStart || !yearEnd || !academicYearCreator) {
      setError("All fields are required.");
      return;
    }
    setShowConfirmation(true);
  }
  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);
    try {
      const response = await updateAcademicYear({
        id: academicYear.id,
        title,
        yearStart: new Date(yearStart),
        yearEnd: new Date(yearEnd),
        academicYearCreator,
      }).unwrap();

      navigate("/settings/academicsSet/academicYears/");
      console.log(response,'response')
      if (response.data && response.data.message) {
        // Success response
        triggerBanner(response.data.message, "success");

      } else if (response?.error && response?.error?.data && response?.error?.data?.message) {
        // Error response
        triggerBanner(response.error.data.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner("Failed to update academic Year. Please try again.", "error");

      console.error("Error saving:", error);
    }
  };
 // Close the modal without saving
 const handleCloseModal = () => {
  setShowConfirmation(false);
};
  // Update canSubmit state
  useEffect(() => {
    setCanSubmit(
      !!title && !!yearStart && !!yearEnd && !!academicYearCreator && !titleError
    );
  }, [title, yearStart, yearEnd, academicYearCreator, titleError]);

  return (
    <>
      <AcademicsSet />
      <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center"> {`Edit Academic Year ${academicYear.title}`}</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Starting Year (Format: yyyy)
            </label>
            <input
              type="text"
              value={title.split("/")[0] || ""}
              onChange={handleYearStartChange}
              placeholder="e.g., 2023"
              maxLength="4"
              className={`w-full px-3 py-2 border rounded-md ${
                titleError ? "border-red-600" : ""
              } focus:outline-none focus:ring-2 focus:ring-sky-700`}
            />
            {titleError && (
              <p className="text-red-600 text-sm mt-2">{titleError}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Academic Year Title
            </label>
            <input
              type="text"
              value={title}
              readOnly
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Year Start</label>
            <input
              type="text"
              value={yearStart}
              onChange={(e)=>setYearStart(e.target.value)

              }
            
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Year End</label>
            <input
              type="text"
              value={new Date(yearEnd).toLocaleDateString()}
             
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-sky-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {isUpdating ? "Updating..." : "Update Academic Year"}
          </button>

          {isUpdateError && (
            <p className="text-red-600 text-sm mt-2">
              {updateError?.data?.message || "Error updating academic year."}
            </p>
          )}
        </form>
      </div>
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

export default EditAcademicYearForm;
