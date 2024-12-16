import { useGetEmployeesByYearQuery } from "../../../HR/Employees/employeesApiSlice";
import DataTable from "react-data-table-component";
import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";
import useAuth from "../../../../hooks/useAuth";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  useGetAnimatorsAssignmentsByYearQuery,
  useDeleteAnimatorsAssignmentMutation,
} from "./animatorsAssignmentsApiSlice";
import { useGetAttendedSchoolsQuery } from "../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import { useOutletContext } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Academics from "../../Academics";
import { MONTHS } from "../../../../config/Months";
const AnimatorsAssignmentsList = () => {
  const navigate = useNavigate();

  //get several things from the query
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //function to return curent month for month selection
  const getCurrentMonth = () => {
    const currentMonthIndex = new Date().getMonth(); // Get current month (0-11)
    return MONTHS[currentMonthIndex]; // Return the month name with the first letter capitalized
  };

  const {
    data: assignments, //the data is renamed schools
    isLoading: isAssignmentsLoading,
    isSuccess: isAssignmentsSuccess,
    isError: isAssignmentsError,
    error: assignmentsError,
  } = useGetAnimatorsAssignmentsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "AnimatorsAssignmentList",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const {
    data: employees, //the data is renamed employees
    isLoading: isEmployeesLoading,
    isSuccess: isEmployeesSuccess,
    isError: isEmployeesError,
    error: employeesError,
  } = useGetEmployeesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "AnimatorsAssignmentList",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
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
  } = useGetAttendedSchoolsQuery({ endpointName: "AnimatorsAssignmentList" }) ||
  {}; //this should match the endpoint defined in your API slice.!! what does it mean?

  const [
    deleteAssignment,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteAnimatorsAssignmentMutation();
  // if (isSchoolsSuccess && !isSchoolsLoading) {
  //   const { entities } = schools;
  //   schoolsList = Object.values(entities);
  // }

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idAttendedSchoolToDelete, setIdAttendedSchoolToDelete] =
    useState(null); // State to track which document to delete

  //initialising the delete Mutation
  let schoolsList = isSchoolsSuccess ? Object.values(schools.entities) : [];
  let employeesList = isEmployeesSuccess
    ? Object.values(employees.entities)
    : [];
  // let assignmentsList = isAssignmentsSuccess
  //   ? Object.values(assignments.entities)
  //   : [];

  const { triggerBanner } = useOutletContext(); // Access banner trigger
  // Function to handle the delete button click
  const onDeleteAttendedSchoolClicked = (id) => {
    setIdAttendedSchoolToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteAssignment({ id: idAttendedSchoolToDelete });
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
      triggerBanner("Failed to add assignment. Please try again.", "error");

      console.error("Error saving assignment:", error);
    }
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdAttendedSchoolToDelete(null);
  };

  const [dateFilter, setDateFilter] = useState(""); // Initialize with empty string (for "All Months")
  const [monthFilter, setMonthFilter] = useState(getCurrentMonth()); // Initialize with empty string (for "All Months")
  let filteredAssignments = [];
  let assignmentsList = [];
  if (isAssignmentsSuccess) {
    const { entities } = assignments;
    assignmentsList = Object.values(entities); //we are using entity adapter in this query

    // Filter assignments based on the selected month, date, and search query
    filteredAssignments = assignmentsList.filter((assignment) => {
      const startMonth = getCurrentMonth(assignment?.startTime);
      const endMonth = getCurrentMonth(assignment?.endTime);
      const assignedFromMonth = getCurrentMonth(assignment?.assignedFrom);
      const assignedToMonth = getCurrentMonth(assignment?.assignedTo);

      // Month Filter: Matches month names
      const matchesMonth =
        monthFilter === "" || // Show all if no month is selected
        startMonth === monthFilter ||
        endMonth === monthFilter ||
        assignedFromMonth === monthFilter ||
        assignedToMonth === monthFilter;

      // Date Filter: Selected date falls between startTime and endTime
      const matchesDate =
        !dateFilter || // Show all if no date is selected
        (new Date(assignment?.assignedFrom).setHours(0, 0, 0, 0) <=
          new Date(dateFilter).setHours(0, 0, 0, 0) &&
          new Date(dateFilter).setHours(0, 0, 0, 0) <=
            new Date(assignment?.assignedTo).setHours(0, 0, 0, 0));

      // Search Filter: Match animator name or school name (case-insensitive)
      const matchesSearch =
        searchQuery === "" ||
        assignment?.assignments?.some((assig) =>
          assig?.schools?.some((school) =>
            school?.schoolName
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
        ); // Match school name in schools array

      // Return true if the assignment passes all active filters
      return matchesMonth && matchesDate && matchesSearch;
    });
  }

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const {
    isEmployee,
    isParent,
    isContentManager,
    isAnimator,
    isAcademic,
    isFinance,
    isHR,
    isDesk,
    isDirector,
    isManager,
    isAdmin,
    canEdit,
    canDelete,
    canView,
    canCreate,
  } = useAuth();

  //define the content to be conditionally rendered
  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },

    {
      name: "From",
      selector: (row) =>
        new Date(row.assignedFrom).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      sortable: true,
      width: "100px",
    },
    {
      name: "To",
      selector: (row) =>
        new Date(row.assignedTo).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      sortable: true,
      width: "100px",
    },

    {
      name: "Assignments",
      selector: (row) => (
        <div>
          {row?.assignments.map((assignment, assignmentIndex) => {
            const animator = employeesList.find(
              (employee) => employee.id === assignment.animator
            );

            const animatorName = animator
              ? `${animator.userFullName.userFirstName} ${
                  animator.userFullName.userMiddleName || ""
                } ${animator.userFullName.userLastName || ""}`.trim()
              : "Unknown";

            return (
              <div key={assignmentIndex} style={{ marginBottom: "8px" }}>
                <div style={{ fontWeight: "bold" }}>
                  {animatorName}
                  <hr style={{ border: "0.5px solid #ddd", margin: "4px 1" }} />
                </div>

                {assignment.schools.map((school) => {
                  const schoolName = school?.schoolName;

                  return (
                    <div key={school?._id} style={{ marginBottom: "4px" }}>
                      {schoolName}
                    </div>
                  );
                })}

                {assignmentIndex < row.assignments.length - 1 && (
                  <hr style={{ border: "0.5px solid #aaa", margin: "8px 0" }} />
                )}
              </div>
            );
          })}
        </div>
      ),

      sortable: true,
      width: "180px",
    },

    (isDirector || isAcademic || isManager || isAdmin) && {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          <button
            className="text-amber-300"
            onClick={() =>
              navigate(`/academics/plannings/editAnimatorsAssignment/${row.id}`)
            }
            hidden={!canEdit}
          >
            <FiEdit fontSize={20} />
          </button>

          <button
            className="text-red-600"
            onClick={() => onDeleteAttendedSchoolClicked(row.id)}
            hidden={!canDelete}
          >
            <RiDeleteBin6Line fontSize={20} />
          </button>
        </div>
      ),
      ignoreRowClick: true,

      button: true,
    },
  ].filter(Boolean); // Filter out falsy values like `false` or `undefined`

  // Custom header to include the row count
  const tableHeader = (
    <h2>
      Assignments List:
      <span> {filteredAssignments.length} assignments</span>
    </h2>
  );
  let content;

  if (isSchoolsLoading)
    content = (
      <>
        <Academics />
        <LoadingStateIcon />
      </>
    );

  if (isSchoolsError || isEmployeesError || isAssignmentsError) {
    content = (
      <>
        <Academics />
        <div className="error-bar">
          {schoolsError?.data?.message}
          {assignmentsError?.data?.message}
          {employeesError?.data?.message}
        </div>
      </>
    );
  }

  if (isSchoolsSuccess) {
    return (
      <>
        <Academics />

        <div className="flex space-x-2 items-center">
          {/* Search Bar */}
          <div className="relative h-10 mr-2 ">
            <HiOutlineSearch
              fontSize={20}
              className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
              aria-label="search students"
            />
            <input
              aria-label="search students"
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="text-sm focus:outline-none active:outline-none mt-1 h-8 w-[24rem] border border-gray-300  px-4 pl-11 pr-4"
            />
          </div>

          {/* Months Filter Dropdown */}
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="text-sm h-8 border  border-gray-300  px-4"
          >
            {/* Default option is the current month */}
            <option value={getCurrentMonth()}>{getCurrentMonth()}</option>

            {/* Render the rest of the months, excluding the current month */}
            {MONTHS.map(
              (month, index) =>
                month !== getCurrentMonth() && (
                  <option key={index} value={month}>
                    {month}
                  </option>
                )
            )}
          </select>
          {/* date Filter  */}
          <input
            type="date"
            value={dateFilter || ""}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-sm h-8 border border-gray-300 px-4 rounded"
            placeholder="Select a date"
          />
          {/* Clear Button */}
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="text-sm text-gray-600 hover:text-red-600 focus:outline-none"
            >
              Clear
            </button>
          )}
        </div>
        <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
          <DataTable
            title={tableHeader}
            columns={column}
            data={filteredAssignments}
            pagination
            selectableRows
            removableRows
            pageSizeControl
            customStyles={{
              headCells: {
                style: {
                  // Apply Tailwind style via a class-like syntax
                  justifyContent: "center", // Align headers to the center
                  textAlign: "center", // Center header text
                },
              },
              cells: {
                style: {
                  justifyContent: "center", // Center cell content
                  textAlign: "center",
                },
              },
            }}
          ></DataTable>
          {(isAdmin || isDirector || isManager || isAcademic) && (
            <div className="flex justify-end items-center  space-x-4">
              <button
                className="add-button"
                onClick={() =>
                  navigate("/academics/plannings/NewAnimatorsAssignmentForm/")
                }
                hidden={!canCreate}
              >
                New Assignment
              </button>
            </div>
          )}
        </div>
        <DeletionConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      </>
    );
  }
};
export default AnimatorsAssignmentsList;
