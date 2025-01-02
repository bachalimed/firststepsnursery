import { useState, useEffect } from "react";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
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
import { OBJECTID_REGEX, DATE_REGEX } from "../../../../config/REGEX";
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
    isLoading: isSchoolsLoading,
    isSuccess: isSchoolsSuccess,
    isError: isSchoolsError,
    error: schoolsError,
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
  let schoolsList = isSchoolsSuccess ? Object.values(schools.entities) : [];
  // let employeesList = isEmployeesSuccess
  //   ? Object.values(employees.entities)
  //   : [];
  let employeesList = [];
  let activeEmployeesList = [];

  if (isEmployeesSuccess) {
    const { entities } = employees;
    employeesList = Object.values(entities);
    activeEmployeesList = employeesList.filter(
      (employee) => employee.employeeData.employeeIsActive === true&&employee.userRoles?.includes('Animator')//////////////
    );
  }

  let assignmentsList = isAssignmentsSuccess
    ? Object.values(assignments.entities)
    : [];

  const [validity, setValidity] = useState({
    validAssignmentYear: false,
    validAssignments: false,
    validAssignedFrom: false,
    validNonEmptyschools: false,
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
      validNonEmptyschools: formData.assignments.every(
        (assign) => assign?.schools?.length > 0
      ),
      validAssignments:
        formData.assignments.length > 0 &&
        formData.assignments.every((assign) => assign?.animator !== ""),
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

  // Remove an assignment row
  const removeAssignment = (index) => {
    const updatedAssignments = formData.assignments.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, assignments: updatedAssignments }));
  };
  // Add a new assignment row for another animator
  const addAssignment = () => {
    setFormData((prev) => ({
      ...prev,
      assignments: [...prev.assignments, { animator: "", schools: [] }],
    }));
  };

  // console.log(formData, "formdata");

  let content;
  if (isSchoolsLoading || isEmployeesLoading || isAssignmentsLoading) {
    content = (
      <>
        <Academics />
        <LoadingStateIcon />
      </>
    );
  }
  if (isSchoolsSuccess && isEmployeesSuccess && isAssignmentsSuccess) {
    content = (
      <>
        <Academics />

        <form onSubmit={handleSubmit} className="form-container">
          <h2 className="formTitle">Edit Assignment</h2>
          <div className="formSectionContainer">
            <h3 className="formSectionTitle">Assignments Dates</h3>
            <div className="formSection">
              
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
              

              <div className="formLineDiv">
                
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
                    {(!validity.validAssignedFrom || !validity.noOverlap) &&
                      formData?.assignedFrom && (
                        <span className="text-red-600">
                          wrong format or date overlap
                        </span>
                      )}
                  </label>
                
                
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
                    {(!validity.validAssignedTo || !validity.noOverlap) &&
                      formData?.assignedTo && (
                        <span className="text-red-600">
                          wrong format or date overlap
                        </span>
                      )}
                  </label>
                
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-4">Assignments</h3>
          {formData.assignments.map((assignment, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <label htmlFor={`assignmentAnimator-${index}`} className="formInputLabel">
                Animator
                {!OBJECTID_REGEX.test(assignment?.animator) && (
                  <span className="text-red-600">*</span>
                )}
                <select
                  id={`assignmentAnimator-${index}`}
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

              <div className="formInputLabel">
                Schools
                {!assignment?.schools?.length > 0 && (
                  <span className="text-red-600">*</span>
                )}
             
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 mt-1">
                {getAvailableSchools(index).map((school) => (
                  <button
                    key={school.id}
                    type="button"
                    onClick={() => toggleSchoolSelection(index, school.id)}
                    className={`px-3 py-1 rounded-md ${
                      assignment.schools.includes(school.id)
                        ? "bg-sky-700 text-white hover:bg-sky-600"
                        : "bg-gray-200 text-gray-700 hover:bg-sky-600 hover:text-white"
                    }`}
                  >
                    {school.schoolName}
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-label="remove assigment"
                onClick={() => removeAssignment(index)}
                className="w-full delete-button mb-2"
              >
                remove
              </button>
              </div>
              {/* <div className="mt-2 text-gray-600">
              Selected Schools:{" "}
              {assignment.schools
                .map(
                  (schoolId) =>
                    schoolsList.find((school) => school.id === schoolId)
                      ?.schoolName
                )
                .join(", ")}
            </div> */}
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
          <div className="cancelSavebuttonsDiv">
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
              disabled={!canSubmit || isUpdateLoading}
              className="save-button"
            >
              save
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
export default EditAnimatorsAssignmentForm;
