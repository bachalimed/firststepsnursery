import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useUpdateAnimatorsAssignmentMutation,
  useGetAnimatorsAssignmentsQuery,
} from "./animatorsAssignmentsApiSlice"; // Redux API action
import { useOutletContext } from "react-router-dom";
import Academics from "../../Academics";
import useAuth from "../../../../hooks/useAuth";
import { useGetAttendedSchoolsQuery } from "../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import { useGetEmployeesByYearQuery } from "../../../HR/Employees/employeesApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { NAME_REGEX, DATE_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";

const EditAnimatorsAssignmentForm = ({ animatorsAssignment }) => {
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const {
    data: employees, //the data is renamed employees
    isLoading: isEmployeesLoading,
    isSuccess: isEmployeesSuccess,
    isError: isEmployeesError,
    error: employeesError,
  } = useGetEmployeesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "EditAnimatorsAssignmentForm",
    } || {},
    {
      //pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const {
    data: schools, //the data is renamed schools
    isLoading: isSchoolLoading,
    isSuccess: isSchoolSuccess,
    isError: isSchoolError,
    error: schoolError,
  } = useGetAttendedSchoolsQuery({
    endpointName: "EditAnimatorsAssignmentForm",
  }) || {}; //this should match the endpoint defined in your API slice.!! what does it mean?

  const {
    data: assignments, //the data is renamed schools
    isLoading: isAssignmentsLoading,
    isSuccess: isAssignmentsSuccess,
    isError: isAssignmentsError,
    error: assignmentsError,
  } = useGetAnimatorsAssignmentsQuery({
    endpointName: "EditAnimatorsAssignmentForm",
  }) || {}; //this should match the endpoint defined in your API slice.!! what does it mean?

  // Redux mutation for adding the attended school
  const [
    updateAnimatorsAssignment,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      isSuccess: isUpdateSuccess,
    },
  ] = useUpdateAnimatorsAssignmentMutation();

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    id: animatorsAssignment._id,
    assignmentYear: animatorsAssignment.assignmentYear || "",
    assignments: animatorsAssignment.assignments,
    assignedFrom: animatorsAssignment.assignedFrom.split("T")[0],
    assignedTo: animatorsAssignment.assignedTo.split("T")[0],

    operator: userId,
  });
  let schoolsList = isSchoolSuccess ? Object.values(schools.entities) : [];
  // let employeesList = isEmployeesSuccess
  //   ? Object.values(employees.entities)
  //   : [];
  let employeesList = [];
  let activeEmployeesList = [];

  if (isEmployeesSuccess) {
    const { entities } = employees;
    employeesList = Object.values(entities);
    activeEmployeesList = employeesList.filter(
      (employee) => employee.employeeData.employeeIsActive === true
    );
  }

  let assignmentsList = isAssignmentsSuccess
    ? Object.values(assignments.entities)
    : [];

  const [validity, setValidity] = useState({
    validAssignmentYear: false,
    validAssignments: false,
    validAssignedFrom: false,
    validAssignedTo: false,
    noOverlap: true, // New validity check for date overlap
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check if any dates overlap with existing assignments, excluding the current one
  const checkNoOverlap = (from, to, excludeId = null) => {
    if (assignmentsList.length === 0) return true;
    return assignmentsList.every((assignment) => {
      if (assignment.id === excludeId) return true; // Skip the current assignment
      const existingFrom = new Date(assignment.assignedFrom);
      const existingTo = new Date(assignment.assignedTo);
      const newFrom = new Date(from);
      const newTo = new Date(to);
      return newTo < existingFrom || newFrom > existingTo; // Ensure no date overlap
    });
  };
  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validAssignmentYear: DATE_REGEX.test(formData.assignmentYear),
      validAssignments:
        formData.assignments.length > 0 &&
        formData.assignments.every((animator) => animator !== ""),
      validAssignedFrom: DATE_REGEX.test(formData.assignedFrom), // Ensure schoolType is selected
      validAssignedTo:
        !!formData.assignedTo &&
        new Date(formData.assignedFrom) < new Date(formData.assignedTo),
      noOverlap: checkNoOverlap(
        formData.assignedFrom,
        formData.assignedTo,
        formData.id
      ),
    }));
  }, [formData]);
  console.log(
    validity.validAssignmentYear,
    validity.validAssignments,
    validity.validAssignedFrom,
    validity.validAssignedTo
  );
  // Clear form and errors on success
  useEffect(() => {
    if (isUpdateSuccess) {
      setFormData({
        id: "",
        assignments: [
          {
            animator: "",
            schools: [],
          },
        ],
        assignedFrom: "",
        assignedTo: "",

        operator: "",
      });

      navigate("/academics/plannings/animatorsAssignments");
    }
  }, [isUpdateSuccess, navigate]);

  // Check if all fields are valid and enable the submit button
  const canSubmit = Object.values(validity).every(Boolean) && !isUpdateLoading;
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are valid
    if (canSubmit) {
      setShowConfirmation(true);
    }
  };
  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);
    try {
      const response = await updateAnimatorsAssignment(formData).unwrap();
      console.log(response, "response");
     if ((response.data && response.data.message) || response?.message) {
        // Success response
        triggerBanner(response?.data?.message || response?.message, "success");
      } else if (
        response?.error &&
        response?.error?.data &&
        response?.error?.data?.message
      ) {
        // Error response
        triggerBanner(response.error.data.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner("Failed to update assignment. Please try again.", "error");

      console.error("Error saving assignment:", error);
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter available animators by excluding already selected ones
  const getAvailableAnimators = (index) => {
    const selectedAnimators = formData.assignments.map(
      (assignment) => assignment.animator
    );
    return activeEmployeesList.filter(
      (employee) =>
        !selectedAnimators.includes(employee.id) ||
        selectedAnimators[index] === employee.id
    );
  };

  // Get available schools for the current assignment index
  const getAvailableSchools = (index) => {
    // Gather all selected schools from previous assignments
    const selectedSchools = formData.assignments
      .slice(0, index) // Only consider previous assignments to allow unique school selection per animator
      .flatMap((assignment) => assignment.schools);

    // Filter out schools already selected in previous assignments
    return schoolsList.filter(
      (school) =>
        !selectedSchools.includes(school.id) &&
        school.schoolName !== "First Steps"
    );
  };

  // Handle animator or school selection changes in each assignment
  const handleAssignmentChange = (index, field, value) => {
    const updatedAssignments = formData.assignments.map((assignment, i) =>
      i === index ? { ...assignment, [field]: value } : assignment
    );
    setFormData((prev) => ({ ...prev, assignments: updatedAssignments }));
  };

  // Toggle school selection for multiple schools in each assignment
  const toggleSchoolSelection = (index, schoolId) => {
    const updatedAssignments = formData.assignments.map((assignment, i) => {
      if (i === index) {
        const schools = assignment.schools.includes(schoolId)
          ? assignment.schools.filter((id) => id !== schoolId) // Remove if already selected
          : [...assignment.schools, schoolId]; // Add if not selected
        return { ...assignment, schools };
      }
      return assignment;
    });
    setFormData((prev) => ({ ...prev, assignments: updatedAssignments }));
  };

  // Add a new assignment row for another animator
  const addAssignment = () => {
    setFormData((prev) => ({
      ...prev,
      assignments: [...prev.assignments, { animator: "", schools: [] }],
    }));
  };

  console.log(formData, "formdata");
  return (
    <>
      <Academics />

      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="formTitle">Edit Assignment</h2>
        <div className="formSectionContainer">
          <h3 className="formSectionTitle">Assignments Dates</h3>
          <div className="formSection">
            <div >
              <label htmlFor="assignmentYear" className="formInputLabel">
                Assignment Year{" "}
                {!validity.validAssignmentYear && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-invalid={!validity.validAssignmentYear}
                  required
                  type="text"
                  id="assignmentYear"
                  name="assignmentYear"
                  value={formData.assignmentYear}
                  onChange={handleChange}
                  placeholder="Enter Year"
                  className="formInputText"
                />
              </label>
            </div>

            <div className="formLineDiv">
              <div>
                <label htmlFor="assignedFrom" className="formInputLabel">
                  From{" "}
                  {(!validity.validAssignedFrom || !validity.noOverlap) && (
                    <span className="text-red-600">*</span>
                  )}
                  <input
                    aria-invalid={!validity.validAssignedFrom}
                    required
                    placeholder="[dd/mm/yyyy]"
                    type="date"
                    id="assignedFrom"
                    name="assignedFrom"
                    value={formData.assignedFrom}
                    onChange={handleChange}
                    className="formInputText"
                  />
                </label>
              </div>
              <div className="mb-4">
                <label htmlFor="assignedTo" className="formInputLabel">
                  To{" "}
                  {(!validity.validAssignedTo || !validity.noOverlap) && (
                    <span className="text-red-600">*</span>
                  )}
                  <input
                    aria-invalid={!validity.validAssignedTo}
                    required
                    placeholder="[dd/mm/yyyy]"
                    type="date"
                    id="assignedTo"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="formInputText"
                  />{" "}
                </label>
              </div>
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-4">Assignments</h3>
        {formData.assignments.map((assignment, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            <label htmlFor="assignmentAnimator" className="formInputLabel">
              Animator
              <select
                id="assignmentAnimator"
                value={assignment.animator}
                onChange={(e) =>
                  handleAssignmentChange(index, "animator", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
              >
                <option value="">Select Animator</option>
                {getAvailableAnimators(index).map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.userFullName.userFirstName}{" "}
                    {employee.userFullName.userMiddleName}{" "}
                    {employee.userFullName.userLastName}
                  </option>
                ))}
              </select>{" "}
            </label>

            <label formInputLabel>
              Schools
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getAvailableSchools(index).map((school) => (
                <button
                  key={school.id}
                  type="button"
                  onClick={() => toggleSchoolSelection(index, school.id)}
                  className={`px-3 py-1 rounded-md ${
                    assignment.schools.includes(school.id)
                      ? "bg-sky-700 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {school.schoolName}
                </button>
              ))}
            </div>

            <div className="mt-2 text-gray-600">
              Selected Schools:{" "}
              {assignment.schools
                .map(
                  (schoolId) =>
                    schoolsList.find((school) => school.id === schoolId)
                      ?.schoolName
                )
                .join(", ")}
            </div>
          </div>
        ))}

        <button
          type="button"
          aria-label="add assigment"
          onClick={addAssignment}
          className="w-full add-button mb-2"
        >
          Add Assignment
        </button>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            aria-label="cancel assignments"
            className="cancel-button"
            onClick={() =>
              navigate("/academics/plannings/animatorsAssignments/")
            }
          >
            Cancel
          </button>
          <button
            type="submit"
            aria-label="submit form"
            disabled={!canSubmit}
            className="save-button"
          >
            {isUpdateLoading ? "Updating..." : "Update Assignment"}
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

export default EditAnimatorsAssignmentForm;
