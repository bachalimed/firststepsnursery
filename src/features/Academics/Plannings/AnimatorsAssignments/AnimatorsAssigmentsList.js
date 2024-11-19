import { HiOutlineSearch } from "react-icons/hi";
import { useGetEmployeesByYearQuery } from "../../../HR/Employees/employeesApiSlice";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
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
  useGetAnimatorsAssignmentsQuery,
  useDeleteAnimatorsAssignmentMutation,
} from "./animatorsAssignmentsApiSlice";
import { useGetAttendedSchoolsQuery } from "../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";

import { useSelector, useDispatch } from "react-redux";

import Academics from "../../Academics";
import { MONTHS } from "../../../../config/Months";
const AnimatorsAssignmentsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //get several things from the query
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  
  //function to return curent month for month selection
  const getCurrentMonth = () => {
    const currentMonthIndex = new Date().getMonth(); // Get current month (0-11)
    return MONTHS[currentMonthIndex]; // Return the month name with the first letter capitalized
  };
  const {
    data: employees, //the data is renamed employees
    isLoading: isEmployeesLoading, //monitor several situations is loading...
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
    isLoading: isSchoolLoading, //monitor several situations is loading...
    isSuccess: isSchoolSuccess,
    isError: isSchoolError,
    error: schoolError,
  } = useGetAttendedSchoolsQuery({ endpointName: "AnimatorsAssignmentList" }) ||
  {}; //this should match the endpoint defined in your API slice.!! what does it mean?

  const {
    data: assignments, //the data is renamed schools
    isLoading: isAssignmentsLoading, 
    isSuccess: isAssignmentsSuccess,
    isError: isAssignmentsError,
    error: assignmentsError,
  } = useGetAnimatorsAssignmentsQuery({
    endpointName: "AnimatorsAssignmentList",
  }) || {}; //this should match the endpoint defined in your API slice.!! what does it mean?
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
  //we do not want to import from state but from DB
  const [selectedRows, setSelectedRows] = useState([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idAttendedSchoolToDelete, setIdAttendedSchoolToDelete] =
    useState(null); // State to track which document to delete

  //initialising the delete Mutation
  let schoolsList = isSchoolSuccess ? Object.values(schools.entities) : [];
  let employeesList = isEmployeesSuccess
    ? Object.values(employees.entities)
    : [];
  // let assignmentsList = isAssignmentsSuccess
  //   ? Object.values(assignments.entities)
  //   : [];
  // Function to handle the delete button click
  const onDeleteAttendedSchoolClicked = (id) => {
    setIdAttendedSchoolToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deleteAssignment({ id: idAttendedSchoolToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdAttendedSchoolToDelete(null);
  };

  // Handler for selecting rows
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
    //console.log('selectedRows', selectedRows)
  };
  const [monthFilter, setMonthFilter] = useState(getCurrentMonth()); // Initialize with empty string (for "All Months")
  let filteredAssignments = [];
  let assignmentsList = [];
  if (isAssignmentsSuccess) {
    const { entities } = assignments;
    assignmentsList = Object.values(entities); //we are using entity adapter in this query

    // Filter assignments based on the selected month
     filteredAssignments = assignmentsList.filter((assignment) => {
      const startMonth = getCurrentMonth(assignment.startTime);
      const endMonth = getCurrentMonth(assignment.endTime);
      const assignedFromMonth = getCurrentMonth(assignment.assignedFrom);
      const assignedToMonth = getCurrentMonth(assignment.assignedTo);

      // If a month is selected, filter by matching month names
      return (
        monthFilter === "" || // Show all if no month is selected
        startMonth === monthFilter ||
        endMonth === monthFilter ||
        assignedFromMonth === monthFilter ||
        assignedToMonth === monthFilter
      );
    });
  }

  //handle delete

  const handleDelete = () => {
    console.log("deleting");
  };

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();

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
    // {
    //   name: "Animator",
    //   selector: (row) => (
    //     <div>
    //       {row?.assignments.map((assignment, index) => {
    //         const animator = employeesList.find(
    //           (employee) => employee.id === assignment.animator
    //         );

    //         const animatorName = animator
    //           ? `${animator.userFullName.userFirstName} ${animator.userFullName.userMiddleName || ""} ${animator.userFullName.userLastName || ""}`.trim()
    //           : "Unknown";

    //         return (
    //           <div key={index} style={{ marginBottom: "4px" }}>
    //       {animatorName}
    //       {index < row.assignments.length - 1 && (
    //         <hr style={{ border: "0.5px solid #ccc", margin: "4px 0" }} />
    //       )}
    //     </div>
    //         );
    //       })}
    //     </div>
    //   ),

    //   sortable: true,
    //   width: "160px",
    // },
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

                {assignment.schools.map((schoolId, schoolIndex) => {
                  const schoolName =
                    schoolsList.find((school) => school.id === schoolId)
                      ?.schoolName || "Unknown";

                  return (
                    <div key={schoolId} style={{ marginBottom: "4px" }}>
                      {schoolName}
                      {
                        schoolIndex < assignment.schools.length - 1
                        // && ( <hr style={{ border: "0.5px solid #ddd", margin: "4px 0" }} />  )
                      }
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

   (isAdmin&& {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() =>
                navigate(
                  `/academics/plannings/editAnimatorsAssignment/${row.id}`
                )
              }
              hidden ={!canEdit}
            >
              <FiEdit fontSize={20} />
            </button>
          ) : null}
          {isAdmin && (
            <button
              className="text-red-500"
              onClick={() => onDeleteAttendedSchoolClicked(row.id)}
              hidden ={!canDelete}
            >
              <RiDeleteBin6Line fontSize={20} />
            </button>
          ) }
        </div>
      ),
      ignoreRowClick: true,

      button: true,
    }),
  ];

   // Custom header to include the row count
   const tableHeader = (
    <div>
      <h2>Assignments List: 
      <span> {filteredAssignments.length} assignments</span></h2>
    </div>
  );
  let content;

  if (isSchoolLoading) content = <> <Academics /><LoadingStateIcon/>...</>;

  if (isSchoolError) {
    content = <p className="errmsg">{schoolError?.data?.message}</p>; //errormessage class defined in the css, the error has data and inside we have message of error
  }

  if (isSchoolSuccess) {
    return (
      <>
        <Academics />

        <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
          <div className="flex space-x-2 items-center">
            {/* Months Filter Dropdown */}

            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="text-sm h-8 border border-gray-300 rounded-md px-4"
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
          </div>

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
                  justifyContent: 'center', // Align headers to the center
                  textAlign: 'center', // Center header text
                },
              },
              // cells: {
              //   style: {
              //     justifyContent: 'center', // Center cell content
              //     textAlign: 'center',
              //   },
              // },
            }}
          ></DataTable>
          <div className="flex justify-end items-center space-x-4">
            <button
              className="px-3 py-2 bg-green-500 text-white rounded"
              onClick={() =>
                navigate("/academics/plannings/NewAnimatorsAssignmentForm/")
              }
              disabled={selectedRows.length !== 0} // Disable if no rows are selected
              hidden={!canCreate}
            >
              New Assignment
            </button>
          </div>
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
