import { HiOutlineSearch } from "react-icons/hi";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { setAttendedSchools } from "./attendedSchoolsSlice";
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";
import useAuth from "../../../../hooks/useAuth";
import { useOutletContext } from "react-router-dom";

import {
  useGetAttendedSchoolsQuery,
  useDeleteAttendedSchoolMutation,
} from "./attendedSchoolsApiSlice";

import { useSelector, useDispatch } from "react-redux";

import AcademicsSet from "../../AcademicsSet";

const AttendedSchoolsList = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  //get several things from the query
  const {
    data: attendedSchoolsData, //the data is renamed attendedSchoolsData
    isLoading: isSchoolsLoading,
    isSuccess: isSchoolsSuccess,
    isError: isSchoolsError,
    error: schoolsError,
  } = useGetAttendedSchoolsQuery({ endpointName: "attendedSchoolsList" }) || {}; //this should match the endpoint defined in your API slice.!! what does it mean?
  //we do not want to import from state but from DB
  const [selectedRows, setSelectedRows] = useState([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idAttendedSchoolToDelete, setIdAttendedSchoolToDelete] =
    useState(null); // State to track which document to delete

  //initialising the delete Mutation
  const [
    deleteAttendedSchool,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteAttendedSchoolMutation();
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  // Function to handle the delete button click
  const onDeleteAttendedSchoolClicked = (id) => {
    setIdAttendedSchoolToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteAttendedSchool({
        id: idAttendedSchoolToDelete,
      });
      setIsDeleteModalOpen(false); // Close the modal
      if (response.data && response.data.message) {
        // Success response
        triggerBanner(response.data.message, "success");
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
      triggerBanner(
        "Failed to delete attended School. Please try again.",
        "error"
      );

      console.error("Error deleting:", error);
    }
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

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();
  //console.log(attendedSchoolsData)
  const [attendedSchools, setAttendedSchoolsState] = useState([]);
  useEffect(() => {
    // console.log('isLoading:', isLoading)
    // console.log('isSuccess:', isSuccess)
    // console.log('isError:', isError)
   
    if (isSchoolsSuccess) {
      //console.log('attendedSchoolsData',attendedSchoolsData)
      //transform into an array
      const { entities } = attendedSchoolsData;
      const attendedSchoolsArray = Object.values(entities);
      setAttendedSchoolsState(attendedSchoolsArray);
      //console.log('academic years from list call', attendedSchools)
      dispatch(setAttendedSchools(entities)); // Dispatch to state  using setALL which will create the ids and entities automatically
      //console.log('attendedSchools',attendedSchools)
    }
  }, [
    isSchoolsSuccess,
    attendedSchoolsData,
    isSchoolsError,
    schoolsError,
    dispatch,
  ]);

  //define the content to be conditionally rendered
  const column = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "210px",
    },
    {
      name: "Color",
      selector: (row) => (
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: row.schoolColor,
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        ></div>
      ),
      sortable: true,
      width: "90px",
    },
    {
      name: "School Name",
      selector: (row) => row.schoolName,
      sortable: true,
      width: "150px",
    },
    {
      name: "School Type",
      selector: (row) => row.schoolType,
      sortable: true,
      width: "160px",
    },
    {
      name: "School City",
      selector: (row) => row.schoolCity,
      sortable: true,
      width: "160px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {canEdit ? (
            <button
              className="text-amber-300"
              onClick={() =>
                Navigate(`/settings/academicsSet/editAttendedSchool/${row.id}`)
              }
            >
              <FiEdit fontSize={20} />
            </button>
          ) : null}
          {canDelete ? (
            <button
              className="text-red-600"
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
  ].filter(Boolean); // Filter out falsy values like `false` or `undefined`
  // Custom header to include the row count
  const tableHeader = (
    <div>
      <h2>
        Schools List:
        <span> {attendedSchools.length} users</span>
      </h2>
    </div>
  );

  let content;

  if (isSchoolsLoading)
    content = (
      <>
        <AcademicsSet />
        <LoadingStateIcon />
      </>
    );

  if (isSchoolsError) {
    content = (
      <>
        <AcademicsSet />
        <div className="error-bar">{schoolsError?.data?.message}</div>
      </>
    );
  }

  if (isSchoolsSuccess) {
    return (
      <>
        <AcademicsSet />

        <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
          {/* <div>
    <input type="text" placeholder="search" onChange={handleFilter}/>
   </div> */}

          <DataTable
            title={tableHeader}
            columns={column}
            data={attendedSchools}
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
              className="add-button"
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
export default AttendedSchoolsList;
