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
import { useSelector, useDispatch } from "react-redux";
import Finances from "../Finances";
import { useOutletContext } from "react-router-dom";



const ExpensesList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //get several things from the query
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idAttendedSchoolToDelete, setIdAttendedSchoolToDelete] =
    useState(null); // State to track which document to delete
    const { triggerBanner } = useOutletContext(); // Access banner trigger

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
    expensesList = Object.values(entities); //we are using entity adapter in this query

    // Handle month filter change

    // Handle month filter change
    filteredExpenses = expensesList.filter((expense) => {
      const startMonth = new Date(expense.startTime).getMonth() + 1; // getMonth() returns 0-based month (0-11), so add 1
      const endMonth = new Date(expense.endTime).getMonth() + 1;

      // Assuming assignedFrom and assignedTo are either Date objects or strings representing dates
      const assignedFromMonth = new Date(expense.assignedFrom).getMonth() + 1;
      const assignedToMonth = new Date(expense.assignedTo).getMonth() + 1;

      // Format the numeric month values to match the format "01", "02", ..., "12"
      const formattedStartMonth = startMonth.toString().padStart(2, "0");
      const formattedEndMonth = endMonth.toString().padStart(2, "0");
      const formattedAssignedFromMonth = assignedFromMonth
        .toString()
        .padStart(2, "0");
      const formattedAssignedToMonth = assignedToMonth
        .toString()
        .padStart(2, "0");

      // If a month is selected, filter by start, end, assignedFrom, or assignedTo month
      return (
        monthFilter === "" || // Show all if no month is selected
        formattedStartMonth === monthFilter ||
        formattedEndMonth === monthFilter ||
        formattedAssignedFromMonth === monthFilter ||
        formattedAssignedToMonth === monthFilter
      );
    });
  }

  const handleMonthChange = (e) => setMonthFilter(e.target.value); // Update selected grade

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
      name: "Month",
      selector: (row) => row?.expenseMonth,

      sortable: true,
      width: "100px",
    },
    {
      name: "Payee",
      selector: (row) => row?.expensePayee?.payeeLabel,

      sortable: true,
      width: "150px",
    },
    {
      name: "Payment",
      selector: (row) => (
        <>
          {row?.expenseAmount} {row?.expenseMethod}
        </>
      ),
      sortable: true,
      width: "120px",
    },
    {
      name: "Category",
      selector: (row) => row?.expenseCategory?.expenseCategoryLabel,
      sortable: true,
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
      sortable: false,
      width: "90px",
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
      name: "Payment Date",
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
      sortable: true,
      width: "130px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {canEdit ? (
            <button
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

  if (isExpensesLoading)
    content = (
      <p><Finances />
        <LoadingStateIcon />
      </p>
    );

  if (isExpensesError) {
    //console.log(expensesError,'expensesError')
    //triggerBanner(expensesError?.data?.message, "error");
    content = (
      <>
        <Finances />
        <div className="error-bar">{expensesError?.data?.message}</div>
      </>
    );
  }

  if (isExpensesSuccess) {
    return (
      <>
        <Finances />

        <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
          <div className="flex space-x-2 items-center ml-3">
            {/* Months Filter Dropdown */}

            {filteredExpenses?.length > 0 && (
              <select
                onChange={handleMonthChange}
                className="text-sm h-8 border border-gray-300  px-4"
              >
                {MONTHS}
              </select>
            )}
          </div>

          <DataTable
            title={tableHeader}
            columns={column}
            data={filteredExpenses}
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
              cells: {
                style: {
                  justifyContent: 'center', // Center cell content
                  textAlign: 'center',
                },
              },
            }}
          ></DataTable>
          <div className="cancelSavebuttonsDiv">
            <button
              className="add-button"
              onClick={() => navigate("/finances/expenses/newExpense/")}
              disabled={selectedRows.length !== 0} // Disable if no rows are selected
              hidden={!canCreate}
            >
              New Expense
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
export default ExpensesList;
