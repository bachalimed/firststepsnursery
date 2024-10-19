import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useUpdateAttendedSchoolMutation } from "./attendedSchoolsApiSlice";
import { attendedSchoolAdded } from "./attendedSchoolsSlice";
import AcademicsSet from "../../AcademicsSet";

const NAME_REGEX = /^[A-z 0-9]{3,25}$/;

const EditAttendedSchoolForm = ({ attendedSchool }) => {
  console.log(attendedSchool, 'attendedSchool');
  
  const [formData, setFormData] = useState({
    schoolName: attendedSchool.schoolName,
    schoolCity: attendedSchool.schoolCity,
    schoolType: attendedSchool.schoolType,
    schoolColor: attendedSchool.schoolColor || "#FF5733",  // Default color if none exists
    id: attendedSchool._id
  });

  const [validity, setValidity] = useState({
    validSchoolName: false,
    validSchoolCity: false,
    validSchoolType: false,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateAttendedSchool, { isLoading, isError, error: apiError, isSuccess }] =
    useUpdateAttendedSchoolMutation();

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity({
      validSchoolName: NAME_REGEX.test(formData.schoolName),
      validSchoolCity: NAME_REGEX.test(formData.schoolCity),
      validSchoolType: !!formData.schoolType,
    });
  }, [formData]);

  // Redirect on success
  useEffect(() => {
    if (isSuccess) {
      navigate("/settings/academicsSet/attendedSchools/");
    }
  }, [isSuccess, navigate]);

  // Check if form is ready for submission
  const canSubmit = Object.values(validity).every(Boolean) && !isLoading;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      setError("Please fill in all fields correctly.");
      return;
    }

    try {
      const newAttendedSchool = await updateAttendedSchool(formData).unwrap();
      setError("");
    } catch (err) {
      setError("Failed to update the attended school.");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <AcademicsSet />
      <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Edit Attended School
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">School Name</label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder="Enter school name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {!validity.validSchoolName && formData.schoolName && (
              <p className="text-red-500 text-sm">Invalid school name.</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">School City</label>
            <input
              type="text"
              name="schoolCity"
              value={formData.schoolCity}
              onChange={handleChange}
              placeholder="Enter school city"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {!validity.validSchoolCity && formData.schoolCity && (
              <p className="text-red-500 text-sm">Invalid school city.</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">School Type</label>
            <select
              name="schoolType"
              value={formData.schoolType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select School Type</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Charter">Charter</option>
              <option value="Other">Other</option>
            </select>
            {!validity.validSchoolType && formData.schoolType && (
              <p className="text-red-500 text-sm">Please select a school type.</p>
            )}
          </div>

          <div className="mb-4">
  <label className="block text-gray-700 font-bold mb-2">School Color</label>
  <div className="flex items-center">
    {/* Square displaying the selected color */}
    <div
      className="w-8 h-8 mr-4 border"
      style={{ backgroundColor: formData.schoolColor }}
    ></div>
    {/* Color input field */}
    <input
      type="color"
      name="schoolColor"
      value={formData.schoolColor}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</div>


          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {isError && (
            <p className="text-red-500 text-sm mt-2">
              {apiError?.data?.message || "Error updating the school."}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {isLoading ? "Updating..." : "Update School"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditAttendedSchoolForm;
