import { HiOutlineSearch } from "react-icons/hi";
import { useGetEmployeesByYearQuery } from "../../HR/Employees/employeesApiSlice";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
import useAuth from "../../../hooks/useAuth";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";

import {
  useGetExpensesQuery,
  useDeleteExpenseMutation,
} from "./expensesApiSlice";
import { useGetAttendedSchoolsQuery } from "../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";

import { useSelector, useDispatch } from "react-redux";

import Finances from "../Finances";

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
    data: employees, //the data is renamed employees
    isLoading: isEmployeesLoading, //monitor several situations is loading...
    isSuccess: isEmployeesSuccess,
    isError: isEmployeesError,
    error: employeesError,
  } = useGetEmployeesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "ExpenseList",
    } || {},
    {
      //this param will be passed in req.params to select only employees for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );
  const {
    data: schools, //the data is renamed schools
    isLoading: isSchoolLoading, //monitor several situations is loading...
    isSuccess: isSchoolSuccess,
    isError: isSchoolError,
    error: schoolError,
  } = useGetAttendedSchoolsQuery({ endpointName: "ExpenseList" }) || {}; //this should match the endpoint defined in your API slice.!! what does it mean?

  const {
    data: expenses, //the data is renamed schools
    isLoading: isExpensesLoading, //monitor several situations is loading...
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

  //initialising the delete Mutation
  let schoolsList = isSchoolSuccess ? Object.values(schools.entities) : [];
  let employeesList = isEmployeesSuccess
    ? Object.values(employees.entities)
    : [];
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
      name: "From",
      selector: (row) =>
        new Date(row.assignedFrom).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      sortable: true,
      width: "100px",
    },
    {
      name: "To",
      selector: (row) =>
        new Date(row.assignedTo).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      sortable: true,
      width: "100px",
    },
    // {
    //   name: "Animator",
    //   selector: (row) => (
    //     <div>
    //       {row?.expenses.map((expense, index) => {
    //         const animator = employeesList.find(
    //           (employee) => employee.id === expense.animator
    //         );

    //         const animatorName = animator
    //           ? `${animator.userFullName.userFirstName} ${animator.userFullName.userMiddleName || ""} ${animator.userFullName.userLastName || ""}`.trim()
    //           : "Unknown";

    //         return (
    //           <div key={index} style={{ marginBottom: "4px" }}>
    //       {animatorName}
    //       {index < row.expenses.length - 1 && (
    //         <hr style={{ border: "0.5px solid #ccc", margin: "4px 0" }} />
    //       )}
    //     </div>
    //         );
    //       })}
    //     </div>
    //   ),

    //   sortable: true,
    //   width: "160px",
    // },
    {
      name: "Expenses",
      selector: (row) => (
        <div>
          {row?.expenses.map((expense, expenseIndex) => {
            const animator = employeesList.find(
              (employee) => employee.id === expense.animator
            );

            const animatorName = animator
              ? `${animator.userFullName.userFirstName} ${
                  animator.userFullName.userMiddleName || ""
                } ${animator.userFullName.userLastName || ""}`.trim()
              : "Unknown";

            return (
              <div key={expenseIndex} style={{ marginBottom: "8px" }}>
                <div style={{ fontWeight: "bold" }}>
                  {animatorName}
                  <hr style={{ border: "0.5px solid #ddd", margin: "4px 1" }} />
                </div>

                {expense.schools.map((schoolId, schoolIndex) => {
                  const schoolName =
                    schoolsList.find((school) => school.id === schoolId)
                      ?.schoolName || "Unknown";

                  return (
                    <div key={schoolId} style={{ marginBottom: "4px" }}>
                      {schoolName}
                      {
                        schoolIndex < expense.schools.length - 1
                        // && ( <hr style={{ border: "0.5px solid #ddd", margin: "4px 0" }} />  )
                      }
                    </div>
                  );
                })}

                {expenseIndex < row.expenses.length - 1 && (
                  <hr style={{ border: "0.5px solid #aaa", margin: "8px 0" }} />
                )}
              </div>
            );
          })}
        </div>
      ),

      sortable: true,
      width: "180px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() =>
                navigate(`/academics/plannings/editExpense/${row.id}`)
              }
            >
              <FiEdit fontSize={20} />
            </button>
          ) : null}
          {canDelete ? (
            <button
              className="text-red-500"
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
  ];

  // Custom header to include the row count
  const tableHeader = (
    <div>
      <h2>
        Expenses List:
        <span> {filteredExpenses.length} users</span>
      </h2>
    </div>
  );

  let content;

  if (isSchoolLoading) content = <p>Loading...</p>;

  if (isSchoolError) {
    content = <p className="errmsg">{schoolError?.data?.message}</p>; //errormessage class defined in the css, the error has data and inside we have message of error
  }

  if (isSchoolSuccess) {
    return (
      <>
        <Finances />

        <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
          <div className="flex space-x-2 items-center">
            {/* Months Filter Dropdown */}

            {filteredExpenses?.length > 0 && (
              <select
                onChange={handleMonthChange}
                className="text-sm h-8 border border-gray-300 rounded-md px-4"
              >
                <option value="">All Months</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
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
              className="px-3 py-2 bg-green-400 text-white rounded"
              onClick={() => navigate("/academics/plannings/NewExpenseForm/")}
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
