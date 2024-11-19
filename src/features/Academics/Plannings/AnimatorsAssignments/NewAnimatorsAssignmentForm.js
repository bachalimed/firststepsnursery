import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddNewAnimatorsAssignmentMutation,
  useGetAnimatorsAssignmentsQuery,
} from "./animatorsAssignmentsApiSlice"; // Redux API action
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
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

const NewAnimatorsAssignmentForm = () => {
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const {
    data: employees, //the data is renamed employees
    isLoading: isEmployeesLoading, //monitor several situations is loading...
    isSuccess: isEmployeesSuccess,
    isError: isEmployeesError,
    error: employeesError,
  } = useGetEmployeesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewAnimatorsAssignmentForm",
    } || {},
    {
      //pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const {
    data: schools, //the data is renamed schools
    isLoading: isSchoolLoading, //monitor several situations is loading...
    isSuccess: isSchoolSuccess,
    isError: isSchoolError,
    error: schoolError,
  } = useGetAttendedSchoolsQuery({
    endpointName: "NewAnimatorsAssignmentForm",
  }) || {}; //this should match the endpoint defined in your API slice.!! what does it mean?

  const {
    data: assignments, //the data is renamed schools
    isLoading: isAssignmentsLoading, //monitor several situations is loading...
    isSuccess: isAssignmentsSuccess,
    isError: isAssignmentsError,
    error: assignmentsError,
  } = useGetAnimatorsAssignmentsQuery({
    endpointName: "NewAnimatorsAssignmentForm",
  }) || {}; //this should match the endpoint defined in your API slice.!! what does it mean?
  const [formData, setFormData] = useState({
    assignmentYear: selectedAcademicYear?.title || "",
    assignments: [
      {
        animator: "",
        schools: [],
      },
    ],
    assignedFrom: "",
    assignedTo: "",
    creator: userId,
    operator: userId,
  });
  let schoolsList = isSchoolSuccess ? Object.values(schools.entities) : [];
  // let employeesList = isEmployeesSuccess
  //   ? Object.values(employees.entities)
  //   : [];
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
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

  // Redux mutation for adding the attended school
  const [
    addNewAnimatorsAssignment,
    {
      isLoading: isAddLoading,
      isError: isAddError,
      error: addError,
      isSuccess: isAddSuccess,
    },
  ] = useAddNewAnimatorsAssignmentMutation();
  // Check if any dates overlap with existing assignments
  const checkNoOverlap = (from, to) => {
    if (assignmentsList != []) {
      return assignmentsList.every((assignment) => {
        const existingFrom = new Date(assignment.assignedFrom);
        const existingTo = new Date(assignment.assignedTo);
        const newFrom = new Date(from);
        const newTo = new Date(to);

        return newTo < existingFrom || newFrom > existingTo; // Ensure no date overlap
      });
    }
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
        new Date(formData?.assignedFrom) < new Date(formData.assignedTo),
      noOverlap: checkNoOverlap(formData.assignedFrom, formData.assignedTo),
    }));
  }, [formData]);
  // console.log(
  //   validity.validAssignmentYear,
  //   validity.validAssignments,
  //   validity.validAssignedFrom,
  //   validity.validAssignedTo
  // );
  // Clear form and errors on success
  useEffect(() => {
    if (isAddSuccess) {
      setFormData({
        assignments: [
          {
            animator: "",
            schools: [],
          },
        ],
        assignedFrom: "",
        assignedTo: "",
        creator: "",
        operator: "",
      });

      navigate("/academics/plannings/animatorsAssignments");
    }
  }, [isAddSuccess, navigate]);

  // Check if all fields are valid and enable the submit button
  const canSubmit = Object.values(validity).every(Boolean) && !isAddLoading;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are valid
    if (canSubmit) {
      setShowConfirmation(true);
    }
  };
  //setError("Please fill in all fields correctly.");
  // This function handles the confirmed save action
  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);

    try {
      const newAnimatorsAssignment = await addNewAnimatorsAssignment(
        formData
      ).unwrap();
    } catch (err) {
      //setError("Failed to add the attended school.");
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
      <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Assignment
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Assignment Year{" "}
              {!validity.validAssignmentYear && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="text"
              name="assignmentYear"
              value={formData.assignmentYear}
              onChange={handleChange}
              placeholder="Enter Year"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              From{" "}
              {(!validity.validAssignedFrom || !validity.noOverlap) && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="date"
              name="assignedFrom"
              value={formData.assignedFrom}
              onChange={handleChange}
              placeholder="Enter Date"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              To{" "}
              {(!validity.validAssignedTo || !validity.noOverlap) && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="date"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Enter Date"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <h3 className="text-xl font-bold mb-4">Assignments</h3>
          {formData.assignments.map((assignment, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <label className="block text-gray-700 font-bold mb-2">
                Animator
              </label>
              <select
                value={assignment.animator}
                onChange={(e) =>
                  handleAssignmentChange(index, "animator", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Animator</option>
                {getAvailableAnimators(index).map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.userFullName.userFirstName}{" "}
                    {employee.userFullName.userMiddleName}{" "}
                    {employee.userFullName.userLastName}
                  </option>
                ))}
              </select>

              <label className="block text-gray-700 font-bold mt-4 mb-2">
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
                        ? "bg-blue-500 text-white"
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
            onClick={addAssignment}
            className="w-full bg-blue-200 text-gray-700 py-2 px-4 rounded-md mt-2 hover:bg-blue-300 transition duration-200"
          >
            Add Another Assignment
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 mt-4"
          >
            {isAddLoading ? "Adding..." : "Add Assignment"}
          </button>
          <button
            type="submit"
            //disabled={!canSubmit}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 mt-4"
            onClick={() =>
              navigate("/academics/plannings/animatorsAssignments/")
            }
          >
            Cancel
          </button>
        </form>
        {/* Confirmation Modal */}
        <ConfirmationModal
          show={showConfirmation}
          onClose={handleCloseModal}
          onConfirm={handleConfirmSave}
          title="Confirm Save"
          message="Are you sure you want to save?"
        />
      </div>
    </>
  );
};

export default NewAnimatorsAssignmentForm;
