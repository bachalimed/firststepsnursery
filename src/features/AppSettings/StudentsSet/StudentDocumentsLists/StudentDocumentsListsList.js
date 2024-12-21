import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useNavigate,useOutletContext } from "react-router-dom";
import { setStudentDocumentsLists } from "./studentDocumentsListsSlice";
import {
  useGetStudentDocumentsListsQuery,
  useDeleteStudentDocumentsListMutation,
} from "./studentDocumentsListsApiSlice";
import { useSelector, useDispatch } from "react-redux";
import useAuth from "../../../../hooks/useAuth";
import { FiEdit } from "react-icons/fi";
import StudentsSet from "../../StudentsSet";
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";

import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineSearch } from "react-icons/hi";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";

const StudentDocumentsListsList = () => {
  //initialise state variables and hooks
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();
  const [studentDocumentsLists, setStudentDocumentsListsState] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for modal
  const [idDocToDelete, setIdDocToDelete] = useState(null); // State to track which document to delete

  //RTK query studentDocumentsLists import
  const {
    data: studentDocumentsListsData,
    isLoading: isDocumentsListsLoading,
    isSuccess: isDocumentsListsSuccess,
    isError: isDocumentsListsError,
    error: documentsListsError,
  } = useGetStudentDocumentsListsQuery(
    {
      endpointName: "StudentDocumentsListsList",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  //initialising the delete Mutation
  const [
    deleteStudentDocumentsList,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteStudentDocumentsListMutation();

  //handler for deleting a studetnDocumentsList

  // Function to handle the delete button click
  const onDeleteStudentDocumentsListClicked = (id) => {
    setIdDocToDelete(id); // Set the document to delete
    setDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteStudentDocumentsList({ id: idDocToDelete });
    setDeleteModalOpen(false); // Close the modal
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
  const handleCloseModal = () => {
    setDeleteModalOpen(false);
    setIdDocToDelete(null);
  };

  //handler for search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handler for selecting rows
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
    //console.log('selectedRows', selectedRows)
  };
  const { triggerBanner } = useOutletContext(); // Access banner trigger

  //console.log(studentDocumentsListsData)
  let filteredStudentDocumentsLists;

  if (isDocumentsListsSuccess) {
    //transform into an array
    const { entities } = studentDocumentsListsData;
    const studentDocumentsListsArray = Object.values(entities);
    //console.log('studentDocumentsListsData',studentDocumentsListsArray)
    filteredStudentDocumentsLists = studentDocumentsListsArray?.filter(
      (item) => {
        // Check if any document in documentsList matches the search query
        const documentsMatch = item?.documentsList?.some((doc) => {
          const documentReferenceMatch = doc.documentReference
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const documentTitleMatch = doc.documentTitle
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());

          return documentReferenceMatch || documentTitleMatch;
        });

        // Check if any top-level property matches the search query
        const topLevelMatch = Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        );

        return documentsMatch || topLevelMatch;
      }
    );

    //console.log('filteredStudentDocumentsLists', filteredStudentDocumentsLists);

    // Dispatch to state using setALL which will create the ids and entities automatically
  } else {
    //console.log('studentDocumentsListsData is not an array')
  }

  //define the content to be conditionally rendered
  const column = [
    //   {
    // name: "ID",
    // selector:row=>row.id,
    // sortable:true
    //  },
    {
      name: "Year",
      selector: (row) => row.documentsAcademicYear,
      sortable: true,
      width: "100px",
    },

    {
      name: "Document Reference",

      selector: (row) => (
        <div>
          {row.documentsList.map((doc) => (
            <div key={doc.documentReference}>{doc.documentReference}</div>
          ))}
        </div>
      ),
      sortable: true,
      removableRows: true,
      width: "210px",
    },
    {
      name: "Document Title",

      selector: (row) => (
        <div>
          {row.documentsList.map((doc) => (
            <div key={doc.documentReference}>{doc.documentTitle}</div>
          ))}
        </div>
      ),
      style: {
        justifyContent: "left",
        textAlign: "left",
        
      },
      sortable: true,
      removableRows: true,
      width: "200px",
    },
    {
      name: "Required",

      selector: (row) => (
        <div>
          {row.documentsList.map((doc) => (
            <div key={doc.documentReference}>
              {doc.isRequired ? "Yes" : "No"}
            </div>
          ))}
        </div>
      ),
      sortable: true,
      removableRows: true,
      width: "110px",
    },
    {
      name: "Legalised",

      selector: (row) => (
        <div>
          {row.documentsList.map((doc) => (
            <div key={doc.documentReference}>
              {doc.isLegalised ? "Yes" : "No"}
            </div>
          ))}
        </div>
      ),
      sortable: true,
      removableRows: true,
      width: "110px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {canEdit ? (
            <button
              aria-label="edit list"
              className="text-amber-300"
              onClick={() =>
                Navigate(
                  `/settings/studentsSet/studentDocumentsList/edit/${row.id}`
                )
              }
              hidden={!canEdit}
            >
              <FiEdit fontSize={20} />
            </button>
          ) : null}

          <button
            aria-label="delete list"
            className="text-red-600"
            onClick={() => onDeleteStudentDocumentsListClicked(row.id)}
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
  let content;

  if (isDocumentsListsLoading)
    content = (
      <>
        <StudentsSet />
        <LoadingStateIcon />
      </>
    );

  content = (
    <>
      <StudentsSet />
      <div className="relative h-10 mr-2">
        <HiOutlineSearch
          fontSize={20}
          className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
        />
        <input aria-label="search"
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="text-sm focus:outline-none active:outline-none mt-1 h-8 w-[24rem] border border-gray-300  px-4 pl-11 pr-4"
        />
      </div>
      <div className="dataTableContainer">
        <div>
          <DataTable
            columns={column}
            data={filteredStudentDocumentsLists}
            pagination
            //selectableRows
            removableRows
            onSelectedRowsChange={handleRowSelected}
            selectableRowsHighlight
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
        <div className="cancelSavebuttonsDiv">
          <button
            aria-label="add new list"
            className="add-button"
            onClick={() =>
              Navigate("/settings/studentsSet/newStudentDocumentsList")
            }
            disabled={selectedRows.length !== 0}
            hidden={!canCreate}
          >
            New Documents List
          </button>
        </div>
      </div>
      <DeletionConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );

  return content;
};
export default StudentDocumentsListsList;
