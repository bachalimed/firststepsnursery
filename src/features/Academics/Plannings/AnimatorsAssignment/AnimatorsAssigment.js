import { HiOutlineSearch } from "react-icons/hi";
import { useGetEmployeesByYearQuery } from "../../../HR/Employees/employeesApiSlice";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

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

import Plannings from "../../Plannings";

const AnimatorsAssignment = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  //get several things from the query
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
      endpointName: "AnimatorsAssignment",
    } || {},
    {
      //this param will be passed in req.params to select only employees for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );
  const {
    data: schools, //the data is renamed schools
    isLoading: isSchoolLoading, //monitor several situations is loading...
    isSuccess: isSchoolSuccess,
    isError: isSchoolError,
    error: schoolError,
  } = useGetAttendedSchoolsQuery({ endpointName: "AnimatorsAssignment" }) || {}; //this should match the endpoint defined in your API slice.!! what does it mean?

  const {
    data: assignments, //the data is renamed schools
    isLoading: isAssignmentsLoading, //monitor several situations is loading...
    isSuccess: isAssignmentsSuccess,
    isError: isAssignmentsError,
    error: assignmentsError,
  } = useGetAnimatorsAssignmentsQuery({ endpointName: "AnimatorsAssignment" }) ||
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
      selector: (row) => row?.assignedFrom,
      sortable: true,
      width: "100px",
    },
    {
      name: "To",
      selector: (row) => row?.assignedTo,
      sortable: true,
      width: "100px",
    },
    {
      name: "Animator",
      selector: (row) => row?.assignments,
      sortable: true,
      width: "160px",
    },
    {
      name: "Schools",
      selector: (row) => row?.schoolCity,
      sortable: true,
      width: "160px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() =>
                Navigate(`/settings/academicsSet/editAttendedSchool/${row.id}`)
              }
            >
              <FiEdit fontSize={20} />
            </button>
          ) : null}
          {canDelete ? (
            <button
              className="text-red-500"
              onClick={() => onDeleteAttendedSchoolClicked(row.id)}
            >
              <RiDeleteBin6Line fontSize={20} />
            </button>
          ) : null}
        </div>
      ),
      ignoreRowClick: true,

      button: true,
    },
  ];
  let content;

  if (isSchoolLoading) content = <p>Loading...</p>;

  if (isSchoolError) {
    content = <p className="errmsg">{schoolError?.data?.message}</p>; //errormessage class defined in the css, the error has data and inside we have message of error
  }

  if (isSchoolSuccess) {
    return (
      <>
        <Plannings />

        <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
          {/* <div>
    <input type="text" placeholder="search" onChange={handleFilter}/>
   </div> */}

          <DataTable
            columns={column}
            data={schoolsList}
            pagination
            selectableRows
            removableRows
            pageSizeControl
          ></DataTable>
          <div className="flex justify-end items-center space-x-4">
            <button
              className="px-3 py-2 bg-yellow-400 text-white rounded"
              onClick={() => Navigate("/settings/academicsSet/newSchool")}
              disabled={selectedRows.length !== 0} // Disable if no rows are selected
              hidden={!canCreate}
            >
              New School
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
export default AnimatorsAssignment;
