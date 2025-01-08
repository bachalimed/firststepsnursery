import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";
import useAuth from "../../../../hooks/useAuth";
import { useOutletContext } from "react-router-dom";

import {
  useGetClassroomsQuery,
  useDeleteClassroomMutation,
} from "./classroomsApiSlice";
import { useSelector, useDispatch } from "react-redux";

import AcademicsSet from "../../AcademicsSet";

const ClassroomsList = () => {
  useEffect(()=>{document.title="Classrooms List"})

  const Navigate = useNavigate();
  const dispatch = useDispatch();
  //get several things from the query
  const {
    data: classrooms, //the data is renamed classroomsData
    isLoading: isClassroomsLoading,
    isSuccess: isClassroomsSuccess,
    // isError: isClassroomsError,
    // error: classroomsError,
    refetch,
  } = useGetClassroomsQuery("classroomsList") || {}; //this should match the endpoint defined in your API slice.!! what does it mean?
 

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idClassroomToDelete, setIdClassroomToDelete] = useState(null); // State to track which document to delete

  //initialising the delete Mutation
  const [
    deleteClassroom,
    {
      // isLoading: isDelLoading,
       isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteClassroomMutation();
  useEffect(() => {
    if (isDelSuccess) {
      refetch();
    }
  }, [isDelSuccess]);
  // Function to handle the delete button click
  const onDeleteClassroomClicked = (id) => {
    setIdClassroomToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  const { triggerBanner } = useOutletContext(); // Access banner trigger
  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteClassroom({ id: idClassroomToDelete });
      setIsDeleteModalOpen(false); // Close the modal
      if (response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      } else if (response?.data?.message) {
        // Success response
        triggerBanner(response?.data?.message, "success");
      } else if (response?.error?.data?.message) {
        // Error response
        triggerBanner(response?.error?.data?.message, "error");
      } else if (isDelError) {
        // In case of unexpected response format
        triggerBanner(delError?.data?.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner(error?.data?.message, "error");
    }
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdClassroomToDelete(null);
  };

  //handle delete

   const { canEdit, isAdmin, isManager, canDelete, canCreate, status2 } =
    useAuth();

  let classroomsList = [];
  if (isClassroomsSuccess) {
    //console.log('classroomsData',classroomsData)
    //transform into an array
    const { entities } = classrooms;
    classroomsList = Object.values(entities);
  
  }

  //define the content to be conditionally rendered
  const column = [
    // isAdmin && {
    //   name: "ID",
    //   selector: (row) => row.id,
    //   sortable: true,
    //   width: "210px",
    // },
    {
      name: "Color",
      selector: (row) => (
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: row.classroomColor,
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        ></div>
      ),
      sortable: true,
      width: "90px",
    },
    {
      name: "Number",
      selector: (row) => row.classroomNumber,
      sortable: true,
      width: "110px",
    },
    {
      name: "Label",
      selector: (row) => row.classroomLabel,
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "140px",
    },
    {
      name: "Capacity",
      selector: (row) => row.classroomCapacity,
      sortable: true,
      width: "110px",
    },
    {
      name: "Max Capacity",
      selector: (row) => row.classroomMaxCapacity,
      sortable: true,
      width: "130px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {canEdit ? (
            <button
              hidden={!isAdmin || !isManager}
              aria-label="edit classroom"
              className="text-amber-300"
              onClick={() =>
                Navigate(`/settings/academicsSet/editClassroom/${row.id}`)
              }
            >
              <FiEdit fontSize={20} />
            </button>
          ) : null}
          {canDelete ? (
            <button
              aria-label="delete classroom"
              className="text-red-600"
              onClick={() => onDeleteClassroomClicked(row.id)}
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
        Classrooms List:
        <span> {classroomsList?.length} classrooms</span>
      </h2>
    </div>
  );
  let content;

  if (isClassroomsLoading)
    content = (
      <>
        {" "}
        <AcademicsSet />
        <LoadingStateIcon />
      </>
    );
  // if (isClassroomsSuccess)
    content = (
      <>
        <AcademicsSet />

        <div className="dataTableContainer">
          <div>
            <DataTable
              title={tableHeader}
              columns={column}
              data={classroomsList}
              pagination
              // selectableRows
              removableRows
              pageSizeControl
              customStyles={{
                headCells: {
                  style: {
                    // Apply Tailwind style via a class-like syntax
                    justifyContent: "center", // Align headers to the center
                    textAlign: "center", // Center header text
                    color: "black",
                    fontSize: "14px", // Increase font size for header text
                  },
                },

                cells: {
                  style: {
                    justifyContent: "center", // Center cell content
                    textAlign: "center",
                    color: "black",
                    fontSize: "14px", // Increase font size for cell text
                  },
                },
                pagination: {
                  style: {
                    display: "flex",
                    justifyContent: "center", // Center the pagination control
                    alignItems: "center",
                    padding: "10px 0", // Optional: Add padding for spacing
                  },
                },
              }}
            ></DataTable>
          </div>
          {/* <div className="cancelSavebuttonsDiv"> */}
          <button
            className="add-button"
            onClick={() => Navigate("/settings/academicsSet/newClassroom")}
           
            hidden={!canCreate}
          >
            New Classroom
          </button>
          {/* </div> */}
        </div>
        <DeletionConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      </>
    );
  return content;
};
export default ClassroomsList;
