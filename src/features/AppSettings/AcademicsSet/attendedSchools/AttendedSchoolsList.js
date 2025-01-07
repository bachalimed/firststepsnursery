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
  useGetAttendedSchoolsQuery,
  useDeleteAttendedSchoolMutation,
} from "./attendedSchoolsApiSlice";
import AcademicsSet from "../../AcademicsSet";

const AttendedSchoolsList = () => {
  useEffect(()=>{document.title="Attended Schools List"})

  const Navigate = useNavigate();
   //get several things from the query
  const {
    data: attendedSchoolsData, //the data is renamed attendedSchoolsData
    isLoading: isSchoolsLoading,
    isSuccess: isSchoolsSuccess,
    isError: isSchoolsError,
    error: schoolsError,
  } = useGetAttendedSchoolsQuery({ endpointName: "attendedSchoolsList" }) || {}; //this should match the endpoint defined in your API slice.!! what does it mean?
  //we do not want to import from state but from DB
  

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
      error: delError,
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
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdAttendedSchoolToDelete(null);
  };

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();
  //console.log(attendedSchoolsData)
  
  let attendedSchools = isSchoolsSuccess ? Object.values(attendedSchoolsData?.entities) : [];
  

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
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "180px",
    },
    {
      name: "School Type",
      selector: (row) => row.schoolType,
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "200px",
    },
    {
      name: "School City",
      selector: (row) => row.schoolCity,
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "200px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {canEdit ? (
            <button
              aria-label="edit school"
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
              aria-label="delete school"
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
    <h2>
      Schools List:
      <span> {attendedSchools.length} users</span>
    </h2>
  );

  let content;

  if (isSchoolsLoading)
    content =  (
      <>
        <AcademicsSet />
        <LoadingStateIcon />
      </>
    );
    // if (isSchoolsSuccess)
 content =  (
    <>
      <AcademicsSet />

      <div className="dataTableContainer">
        <div>
          <DataTable
            title={tableHeader}
            columns={column}
            data={attendedSchools}
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
            onClick={() => Navigate("/settings/academicsSet/newSchool")}
           
            hidden={!canCreate}
          >
            New School
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
  return content
};
export default AttendedSchoolsList;
