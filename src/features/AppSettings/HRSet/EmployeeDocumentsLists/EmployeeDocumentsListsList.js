import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { setEmployeeDocumentsLists } from "./EmployeeDocumentsListsSlice";
import {
  useGetEmployeeDocumentsListsQuery,
  useDeleteEmployeeDocumentsListMutation,
} from "./employeeDocumentsListsApiSlice";
import { useSelector, useDispatch } from "react-redux";
import useAuth from "../../../../hooks/useAuth";
import { FiEdit } from "react-icons/fi";
import EmployeesSet from "../../HRSet";
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";

import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineSearch } from "react-icons/hi";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";

const EmployeeDocumentsListsList = () => {
  //initialise state variables and hooks
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();
  const [employeeDocumentsLists, setEmployeeDocumentsListsState] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for modal
  const [idDocToDelete, setIdDocToDelete] = useState(null); // State to track which document to delete

  //RTK query employeeDocumentsLists import
  const {
    data: employeeDocumentsListsData,
    isLoading: isDocumentsListsLoading,
    isSuccess: isDocumentsListsSuccess,
    isError: isDocumentsListsError,
    error: documentsListsError,
  } = useGetEmployeeDocumentsListsQuery("employeeDocumentsListsList") || {};

  //initialising the delete Mutation
  const [
    deleteEmployeeDocumentsList,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteEmployeeDocumentsListMutation();

  //handler for deleting a studetnDocumentsList

  // Function to handle the delete button click
  const onDeleteEmployeeDocumentsListClicked = (id) => {
    setIdDocToDelete(id); // Set the document to delete
    setDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deleteEmployeeDocumentsList({ id: idDocToDelete });
    setDeleteModalOpen(false); // Close the modal
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

  //console.log(employeeDocumentsListsData)
  let filteredEmployeeDocumentsLists;

  if (isDocumentsListsSuccess) {
    //transform into an array
    const { entities } = employeeDocumentsListsData;
    const employeeDocumentsListsArray = Object.values(entities);
    //console.log('employeeDocumentsListsData',employeeDocumentsListsArray)
    filteredEmployeeDocumentsLists = employeeDocumentsListsArray?.filter(
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

    //console.log('filteredEmployeeDocumentsLists', filteredEmployeeDocumentsLists);

    // Dispatch to state using setALL which will create the ids and entities automatically
  } else {
    //console.log('employeeDocumentsListsData is not an array')
  }

  //define the content to be conditionally rendered
  const column = [
    //   {
    // name: "ID",
    // selector:row=>row.id,
    // sortable:true
    //  },
    {
      name: "School Year",
      selector: (row) => row.documentsAcademicYear,
      sortable: true,
      width: "120px",
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
      width: "200px",
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
      width: "100px",
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
      width: "100px",
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
                Navigate(`/settings/hrSet/employeeDocumentsList/edit/${row.id}`)
              }
            >
              <FiEdit fontSize={20} />
            </button>
          ) : null}
          {canDelete ? (
            <button
            aria-label="delete list"
              className="text-red-600"
              onClick={() => onDeleteEmployeeDocumentsListClicked(row.id)}
              hidden={!canDelete}
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
  let content;

  if (isDocumentsListsLoading)
    content = (
      <>
        <EmployeesSet />
        <LoadingStateIcon />
      </>
    );

  if (isDocumentsListsError) {
    content = (
      <>
        <EmployeesSet />
        <div className="error-bar">{documentsListsError?.data?.message}</div>
      </>
    );
  }
  if (isDocumentsListsSuccess) {
    content = (
      <>
        <EmployeesSet />
        <div className="relative h-10 mr-2">
          <HiOutlineSearch
            fontSize={20}
            className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="text-sm focus:outline-none active:outline-none mt-1 h-8 w-[24rem] border border-gray-300  px-4 pl-11 pr-4"
          />
        </div>
        <div className="flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
          <DataTable
            columns={column}
            data={filteredEmployeeDocumentsLists}
            pagination
            selectableRows
            removableRows
            onSelectedRowsChange={handleRowSelected}
            selectableRowsHighlight
          />
          <div className="flex justify-end items-center space-x-4">
            <button
              className="add-button"
              onClick={() =>
                Navigate("/settings/hrSet/newEmployeeDocumentsList")
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
  }
  return content;
};
export default EmployeeDocumentsListsList;
