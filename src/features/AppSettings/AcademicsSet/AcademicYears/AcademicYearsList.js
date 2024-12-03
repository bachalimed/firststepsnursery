import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { setAcademicYears } from "./academicYearsSlice";
import DeletionConfirmModal from '../../../../Components/Shared/Modals/DeletionConfirmModal'
import useAuth from "../../../../hooks/useAuth";
import {  useDeleteAcademicYearMutation } from "./academicYearsApiSlice";
import { useSelector, useDispatch } from "react-redux";
import AcademicsSet from "../../AcademicsSet";
import { useOutletContext } from "react-router-dom";


const AcademicYearsList = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  //get several things from the query

  //we do not want to import from state but from DB
  const [selectedRows, setSelectedRows] = useState([]);

  // Handler for selecting rows
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
    //console.log('selectedRows', selectedRows)
  };
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  //handle delete

  
  //initialising the delete Mutation
  const [
    deleteAcademicYear,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteAcademicYearMutation();

  const { triggerBanner } = useOutletContext(); // Access banner trigger
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idYearToDelete, setIdYearToDelete] = useState(null);
  const handleDelete = (id) => {
    // Function to handle the delete button click
  
    setIdYearToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };
  
  
  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteAcademicYear({ id: idYearToDelete });
    setIsDeleteModalOpen(false); // Close the modal
    if (response.data && response.data.message) {
      // Success response
      triggerBanner(response.data.message, "success");

    } else if (response?.error && response?.error?.data && response?.error?.data?.message) {
      // Error response
      triggerBanner(response.error.data.message, "error");
    } else {
      // In case of unexpected response format
      triggerBanner("Unexpected response from server.", "error");
    }
  } catch (error) {
    triggerBanner("Failed to delete academic year. Please try again.", "error");

    console.error("Error deleting:", error);
  }
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdYearToDelete(null);
  };


  const handleNextSelected = () => {
    console.log("Selected Rows to duplicate forward:", selectedRows);
    // Add  delete logic here (e.g., dispatching a Redux action or calling an API)
    //ensure only one can be selected: the last one
    const toDuplicate = selectedRows[-1];

    setSelectedRows([]); // Clear selection after delete
  };

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();
  //console.log(academicYears)

  //define the content to be conditionally rendered
  const column = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "200px",
    },
    {
      name: "Title",
      selector: (row) => row?.title,
      sortable: true,
      width: "100px",
    },
    {
      name: "Period",
      selector: (row) => (
        <div>
          <div>
            {"start: "}
            {new Date(row.yearStart).toLocaleString("en-GB", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </div>
          <div>
          {"End: "}
            {new Date(row.yearEnd).toLocaleString("en-GB", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      ),
      sortable: true,
      width: "140px", // Adjust the width as needed to fit both dates
    },
   
    {
      name: "Creator",
      selector: (row) => row?.academicYearCreator,
      sortable: true,
      width: "200px",
    },
    {
      name: "Action",
      selector: null,

      removableRows: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() =>
                Navigate(`/settings/academicsSet/editAcademicYear/${row.id}`)
              }
            >
              <FiEdit fontSize={20} />
            </button>
          ) : null}
          {canDelete ? (
            <button
              className="text-red-500"
              onClick={() => handleDelete(row.id)}
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
 // Custom header to include the row count
 const tableHeader = (
  <div>
    <h2>Academics Years List: 
    <span> {academicYears.length} users</span></h2>
  </div>
);



  let content;

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
          data={academicYears}
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
            className="add-button"
            onClick={() => Navigate("/settings/academicsSet/newAcademicYear")}
            disabled={selectedRows.length !== 0} // Disable if no rows are selected
            hidden={!canCreate}
          >
            New academic Year
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
};
export default AcademicYearsList;
