import {
  useGetPayeesByYearQuery,
  useUpdatePayeeMutation,
  useDeletePayeeMutation,
} from "./payeesApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import FinancesSet from "../../FinancesSet";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
//import { useGetPayeeDocumentsByYearByIdQuery } from "../../../AppSettings/PayeesSet/PayeeDocumentsLists/payeeDocumentsListsApiSlice"
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";
// import RegisterModal from './RegisterModal'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  setAcademicYears,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import useAuth from "../../../../hooks/useAuth";
import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import { IoShieldCheckmarkOutline, IoShieldOutline } from "react-icons/io5";
import { setSomePayees, setPayees, currentPayeesList } from "./payeesSlice";
import { IoDocumentAttachOutline } from "react-icons/io5";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import { useOutletContext } from "react-router-dom";
const PayeesList = () => {
  //this is for the academic year selection
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();
  const [requiredDocNumber, setRequiredDocNumber] = useState("");
  const [payeeDocNumber, setPayeeDocNumber] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idPayeeToDelete, setIdPayeeToDelete] = useState(null); // State to track which document to delete

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const {
    data: payees, //the data is renamed payees
    isLoading: isPayeesLoading, 
    isSuccess: isPayeesSuccess,
    isError: isPayeesError,
    error: payeesError,
  } = useGetPayeesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "payeesList",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //initialising the delete Mutation
  const [
    deletePayee,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeletePayeeMutation();
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  // Function to handle the delete button click
  const onDeletePayeeClicked = (id) => {
    setIdPayeeToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deletePayee({ id: idPayeeToDelete });
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
    triggerBanner("Failed to delete payee. Please try again.", "error");

    console.error("Error deleting:", error);
  }
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdPayeeToDelete(null);
  };

  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredPayees, setFilteredPayees] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  let payeesList = [];
  let filteredPayees = [];
  if (isPayeesSuccess) {
    //set to the state to be used for other component s and edit payee component

    const { entities } = payees;

    //we need to change into array to be read??
    payeesList = Object.values(entities); //we are using entity adapter in this query
    //console.log(payeesList,'payeesList')
    //dispatch(setPayees(payeesList)); //timing issue to update the state and use it the same time

    //the serach result data
    filteredPayees = payeesList?.filter((item) => {
      
      //console.log('filteredPayees in the success', item)
      return (
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  // Handler for selecting rows
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
    //console.log('selectedRows', selectedRows)
  };

 
  //console.log(filteredPayees, "filteredPayees");

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },
    //show this column only if user is a parent and not payee

    isAdmin && {
      name: "ID",
      selector: (row) => (
        <div>
          <Link to={`/settings/financesSet/payeeDetails/${row.id}`}>
            <div>{row.id} </div>
          </Link>
        </div>
      ),

      sortable: true,
      width: "240px",
    },

    {
      name: "Years",

      selector: (row) => (
        <div>
          {(row?.payeeYears).map((year) => (
            <div key={year}>{year}</div>
          ))}
        </div>
      ),

      sortable: true,
      removableRows: true,
      width: "120px",
    },
   

    {
      name: "Active",
      selector: (row) => row.payeeData?.payeeIsActive,
      cell: (row) => (
        <span>
          {row?.payeeIsActive ? (
            <IoShieldCheckmarkOutline className="text-green-500 text-2xl" />
          ) : (
            <IoShieldOutline className="text-amber-300 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      width: "80px",
    },
    {
      name: "Label",
      selector: (row) => row?.payeeLabel,
      sortable: true,
      width: "150px",
    },
    // {
    //   name: "Categories",

    //   selector: (row) => (
    //     <div>
    //       {(row?.payeeCategories).map((cat) => (
    //         <div key={cat}>{cat}</div>
    //       ))}
    //     </div>
    //   ),

    //   sortable: true,
    //   removableRows: true,
    //   width: "140px",
    // },

    {
      name: "Phone",
      selector: (row) => row?.payeePhone,

      sortable: true,
      width: "110px",
    },

    {
      name: "Notes",
      selector: (row) => row?.payeeNotes,
      sortable: true,
      removableRows: true,
      width: "130px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          <button
            className="text-sky-700"
            fontSize={20}
            onClick={() => navigate(`/settings/financesSet/payeeDetails/${row.id}`)}
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
              className="text-amber300"
              onClick={() => navigate(`/settings/financesSet/editPayee/${row.id}`)}
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              className="text-red-600"
              onClick={() => onDeletePayeeClicked(row.id)}
            >
              <RiDeleteBin6Line className="text-2xl" />
            </button>
          )}
        </div>
      ),
      ignoreRowClick: true,

      button: true,
    },
  ].filter(Boolean); // Filter out falsy values like `false` or `undefined`

  // Custom header to include the row count
  const tableHeader = (
    
      <h2>
        Payees List: <span> {filteredPayees.length} payees</span>
      </h2>
   
  );
  let content;
  if (isPayeesLoading)
    content = (
      <>
        <FinancesSet />
        <LoadingStateIcon />
      </>
    );
  if (isPayeesError) {
    content = (
      <>
        <FinancesSet />
        <div className="error-bar">
          {payeesError?.data?.message}
         
        </div>
      </>
    );  }
  if (isPayeesSuccess) {
    content = (
      <>
        <FinancesSet />

        <div className="relative h-10 mr-2 ">
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
        <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
          <DataTable
            title={tableHeader}
            columns={column}
            data={filteredPayees}
            pagination
            selectableRows
            removableRows
            pageSizeControl
            onSelectedRowsChange={handleRowSelected}
            selectableRowsHighlight
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
                  justifyContent: 'center', // Center cell content
                  textAlign: 'center',
                },
              },
            }}
          ></DataTable>
          <div className="flex justify-end items-center space-x-4">
            <button
              className="add-button"
              onClick={() => navigate("/settings/financesSet/newPayee/")}
              // disabled={selectedRows.length !== 1} // Disable if no rows are selected
              hidden={!canCreate}
            >
              New Payee
            </button>

            {/* {isAdmin && (
            <button
              className="px-3 py-2 bg-gray-400 text-white rounded"
              onClick={handleDuplicateSelected}
              disabled={selectedRows.length !== 1} // Disable if no rows are selected
              hidden={!canCreate}
            >
              optional button
            </button>
          )} */}
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
  return content;
};
export default PayeesList;
