import {
  useGetPayeesByYearQuery,
  useDeletePayeeMutation,
} from "./payeesApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import FinancesSet from "../../FinancesSet";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { selectAllAcademicYears } from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import useAuth from "../../../../hooks/useAuth";
import { IoShieldCheckmarkOutline, IoShieldOutline } from "react-icons/io5";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import { useOutletContext } from "react-router-dom";
const PayeesList = () => {
  //this is for the academic year selection
  const navigate = useNavigate();

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();

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
      error: delError,
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
    setIdPayeeToDelete(null);
  };

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
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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

    // isAdmin && {
    //   name: "ID",
    //   selector: (row) => (
    //     <div>
    //       <Link to={`/settings/financesSet/payeeDetails/${row.id}`}>
    //         <div>{row.id} </div>
    //       </Link>
    //     </div>
    //   ),

    //   sortable: true,
    //   width: "240px",
    // },
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
      width: "90px",
    },

    {
      name: "Label",
      selector: (row) => row?.payeeLabel,
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
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
      name: "Phone",
      selector: (row) => row?.payeePhone,

      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "120px",
    },

    {
      name: "Notes",
      selector: (row) => row?.payeeNotes,
      sortable: true,
      removableRows: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "140px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {canEdit ? (
            <button
              aria-label="edit payee"
              className="text-amber-300"
              onClick={() =>
                navigate(`/settings/financesSet/editPayee/${row.id}`)
              }
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              aria-label="delete payee"
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
    if (isPayeesSuccess)
  content = (
    <>
      <FinancesSet />
      <div className="flex space-x-2 items-center ml-3">
        <div className="relative h-10 mr-2 ">
          <HiOutlineSearch
            fontSize={20}
            className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
          />
          <input
            aria-label="search"
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="text-sm focus:outline-none active:outline-none mt-1 h-8 w-[12rem] border border-gray-300  px-4 pl-11 pr-4"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearch({ target: { value: "" } })} // Clear search
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="clear search"
            >
              &times;
            </button>
          )}
        </div>
      </div>
      <div className="dataTableContainer">
        <div>
          <DataTable
            title={tableHeader}
            columns={column}
            data={filteredPayees}
            pagination
            // selectableRows
            removableRows
            pageSizeControl
            //onSelectedRowsChange={handleRowSelected}
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
        {/* <div className="cancelSavebuttonsDiv"> */}
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
export default PayeesList;
