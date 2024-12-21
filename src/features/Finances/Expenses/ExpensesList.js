import { HiOutlineSearch } from "react-icons/hi";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
import useAuth from "../../../hooks/useAuth";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { MONTHS } from "../../../config/Months";
import {
  useGetExpensesQuery,
  useDeleteExpenseMutation,
} from "./expensesApiSlice";
import { useSelector } from "react-redux";
import Finances from "../Finances";

const ExpensesList = () => {
  const navigate = useNavigate();

  //get several things from the query
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const getCurrentMonth = () => {
    const currentMonthIndex = new Date().getMonth(); // Get current month (0-11)
    return MONTHS[currentMonthIndex]; // Return the month name with the first letter capitalized
  };
  const {
    data: expenses, //the data is renamed schools
    isLoading: isExpensesLoading,
    isSuccess: isExpensesSuccess,
    isError: isExpensesError,
    error: expensesError,
  } = useGetExpensesQuery({ endpointName: "ExpenseList" }) || {}; //this should match the endpoint defined in your API slice.!! what does it mean?
  const [
    deleteExpense,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteExpenseMutation();
  // if (isSchoolsSuccess && !isSchoolsLoading) {
  //   const { entities } = schools;
  //   schoolsList = Object.values(entities);
  // }
  //we do not want to import from state but from DB
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idAttendedSchoolToDelete, setIdAttendedSchoolToDelete] =
    useState(null); // State to track which document to delete

  //initialising the delete Mutation

  // let expensesList = isExpensesSuccess
  //   ? Object.values(expenses.entities)
  //   : [];
  // Function to handle the delete button click
  const onDeleteAttendedSchoolClicked = (id) => {
    setIdAttendedSchoolToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deleteExpense({ id: idAttendedSchoolToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdAttendedSchoolToDelete(null);
  };

  // console.log(filteredInvoices, "filteredInvoices");
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  // Handler for selecting rows
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
    //console.log('selectedRows', selectedRows)
  };

  const [monthFilter, setMonthFilter] = useState(""); // Initialize with empty string (for "All Months")
  let filteredExpenses = [];
  let expensesList = [];
  if (isExpensesSuccess) {
    const { entities } = expenses;
    expensesList = Object.values(entities); // Convert entity adapter to an array

    // Apply filters
    filteredExpenses = expensesList.filter((expense) => {
      const matchesMonth =
        monthFilter === "" || monthFilter === expense?.expenseMonth;
      const matchesSearch =
        searchQuery === "" ||
        // Check in payeeLabel
        (expense?.expensePayee?.payeeLabel &&
          expense.expensePayee.payeeLabel
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        // Check in items array
        (Array.isArray(expense?.expenseItems) &&
          expense.expenseItems.some((item) =>
            JSON.stringify(item)
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          ));

      return matchesMonth && matchesSearch; // AND logic
    });
  }

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();

  //define the content to be conditionally rendered
  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "40px",
    },
    {
      name: "Month",
      selector: (row) => row?.expenseMonth,

      sortable: true,
      width: "100px",
    },
    {
      name: "Payee",
      selector: (row) => row?.expensePayee?.payeeLabel,

      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "110px",
    },
    {
      name: "Amount",
      selector: (row) => (
        <>
          {row?.expenseAmount} {row?.expenseMethod}
        </>
      ),
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      sortable: true,
      width: "140px",
    },
    {
      name: "Category",
      selector: (row) => row?.expenseCategory?.expenseCategoryLabel,
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "120px",
    },
    {
      name: "Items",
      selector: (row) => (
        <div>
          {row?.expenseItems?.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      ),
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      sortable: false,
      width: "140px",
    },

    {
      name: "Date",
      selector: (row) =>
        new Date(row?.expenseDate).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      sortable: true,
      width: "120px",
    },

    {
      name: "Payment",
      selector: (row) =>
        row?.expensePaymentDate
          ? new Date(row?.expensePaymentDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          : new Date(row?.expenseDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      sortable: true,
      width: "130px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {canEdit ? (
            <button
              aria-label="edit expense"
              className="text-amber-300"
              onClick={() =>
                navigate(`/finances/expenses/editExpense/${row.id}`)
              }
            >
              <FiEdit fontSize={20} />
            </button>
          ) : null}
          {canDelete ? (
            <button
              aria-label="delete expense"
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
      Expenses List:
      <span> {filteredExpenses.length} expenses</span>
    </h2>
  );

  let content;

  if (isExpensesLoading) {
    content = (
      <p>
        <Finances />
        <LoadingStateIcon />
      </p>
    );
  }

  content = (
    <>
      <Finances />

      <div className="flex space-x-2 items-center ml-3">
        {/* Search Bar */}
        <div className="relative h-10 mr-2 ">
          <HiOutlineSearch
            fontSize={20}
            className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
            aria-label="search expenses"
          />
          <input
            aria-label="search expenses"
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="text-sm focus:outline-none active:outline-none mt-1 h-8 w-[12rem] border border-gray-300  px-4 pl-11 pr-4"
          />{" "}
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
        {/* Months Filter Dropdown */}

        <label htmlFor="monthFilter" className="formInputLabel">
          <select
            aria-label="monthFilter"
            id="monthFilter"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="text-sm h-8 border border-gray-300  px-4"
          >
            {/* Default option is the current month */}
            <option value={getCurrentMonth()}>{getCurrentMonth()}</option>
            <option value="">All Months</option>
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
        </label>
      </div>
      <div className="dataTableContainer">
        <div>
          <DataTable
            title={tableHeader}
            columns={column}
            data={filteredExpenses}
            pagination
            //selectableRows
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
            onClick={() => navigate("/finances/expenses/newExpense/")}
            disabled={selectedRows.length !== 0} // Disable if no rows are selected
            hidden={!canCreate}
          >
            New Expense
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
export default ExpensesList;
