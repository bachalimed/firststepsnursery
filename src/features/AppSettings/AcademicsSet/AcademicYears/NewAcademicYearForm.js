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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!title || !yearStart || !yearEnd || !academicYearCreator) {
      setError("All fields are required.");
      return;
    }

    try {
      // Ensure yearStart and yearEnd are Date objects when creating the new academic year
      const newAcademicYear = await addNewAcademicYear({
        title,
        yearStart: new Date(yearStart), // Ensure it's a Date object
        yearEnd: new Date(yearEnd),
        academicYearCreator,
      }).unwrap();

      // Dispatch action to update the state in the slice
      dispatch(academicYearAdded(newAcademicYear));//maybe no need to dispatch because it will update when querying again

      navigate("/settings/academicsSet/academicYears/"); // Redirect after successful creation
    } catch (err) {
      setError("Failed to create the academic year.");
    }
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
  console.log(
    title,
    yearStart,
    yearEnd,
    academicYearCreator,
    "title ,yearStart ,yearEnd,academicYearCreator"
  );
  academicYears.map((year) => {
    console.log(year, "year");
  });
  return (
    <>
      <AcademicsSet />
      <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          New Academic Year
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Starting Year (Format: yyyy)
            </label>
            <input
              type="text"
              value={title.split("/")[0] || ""} // Show only the first year in input
              onChange={handleYearStartChange}
              placeholder="e.g., 2023"
              maxLength="4"
              className={`w-full px-3 py-2 border rounded-md ${
                titleError ? "border-red-500" : ""
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {titleError && (
              <p className="text-red-500 text-sm mt-2">{titleError}</p>
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
            <label className="block text-gray-700 font-bold mb-2">
              Year Start
            </label>
            <input
              type="text"
              value={yearStart}
              readOnly
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Year End
            </label>
            <input
              type="text"
              value={yearEnd}
              readOnly
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {isNewYearLoading ? "Creating..." : "Create Academic Year"}
          </button>

          {isNewYearError && (
            <p className="text-red-500 text-sm mt-2">
              {newYearError?.data?.message || "Error creating academic year."}
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default NewAcademicYearForm;
