import {
  useGetEmployeesByYearQuery,
  useDeleteEmployeeMutation,
} from "./employeesApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import HR from "../HR";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
// import RegisterModal from './RegisterModal'
import { Link } from "react-router-dom";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { selectAllAcademicYears } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import useAuth from "../../../hooks/useAuth";
import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import { IoShieldCheckmarkOutline, IoShieldOutline } from "react-icons/io5";
import { IoDocumentAttachOutline } from "react-icons/io5";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
const EmployeesList = () => {
  useEffect(() => {
    document.title = "Employees List";
  });
  //this is for the academic year selection
  const navigate = useNavigate();

  const { canEdit, isAdmin, isManager, canDelete, canCreate, status2 } =
    useAuth();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idEmployeeToDelete, setIdEmployeeToDelete] = useState(null); // State to track which document to delete
  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const {
    data: employees, //the data is renamed employees
    isLoading: isEmployeesLoading,
    isSuccess: isEmployeesSuccess,
    isError: isEmployeesError,
    error: employeesError,
    refetch,
  } = useGetEmployeesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "employeesList",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //initialising the delete Mutation
  const [
    deleteEmployee,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteEmployeeMutation();
  useEffect(() => {
    if (isDelSuccess) {
      refetch();
    }
  }, [isDelSuccess]);
  // Function to handle the delete button click
  const onDeleteEmployeeClicked = (id) => {
    setIdEmployeeToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteEmployee({ id: idEmployeeToDelete });
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
    setIdEmployeeToDelete(null);
  };

  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");

  //we need to declare the variable outside of if statement to be able to use it outside later
  let employeesList = [];
  let filteredEmployees = [];
  if (isEmployeesSuccess) {
    //set to the state to be used for other component s and edit employee component

    const { entities } = employees;

    //we need to change into array to be read??
    employeesList = Object.values(entities); //we are using entity adapter in this query
    //console.log(employeesList,'employeesList')
    //dispatch(setEmployees(employeesList)); //timing issue to update the state and use it the same time

    //the serach result data
    filteredEmployees = employeesList?.filter((item) => {
      //the nested objects need extra logic to separate them
      const firstNameMatch = item?.userFullName?.userFirstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const middleNameMatch = item?.userFullName?.userMiddleName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const lastNameMatch = item?.userFullName?.userLastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      //console.log('filteredEmployees in the success', item)
      return (
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        firstNameMatch ||
        middleNameMatch ||
        lastNameMatch
      );
    });
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },
    //show this column only if user is a parent and not employee

    // isAdmin && {
    //   name: "ID",
    //   selector: (row) => (
    //     <div>
    //       <Link to={`/admin/users/userManagement/userDetails/${row.id}`}>
    //         <div>User {row.id} </div>
    //       </Link>
    //       <Link to={`/hr/employees/employeeDetails/${row.id}`}>
    //         {" "}
    //         {/* the employee details use the user Id and not employeeId */}{" "}
    //         {row.employeeId && <div>Emp {row.employeeId} </div>}
    //       </Link>
    //     </div>
    //   ),

    //   sortable: true,
    //   width: "240px",
    // },
    //  (isAdmin)&&{
    // name: "Employee ID",
    // selector:row=>( <Link to={`/hr/employees/employeeDetails/${row.employeeId}`} >{row.employeeId} </Link> ),
    // sortable:true,
    // width:'200px'
    //  },
    {
      name: "Active",
      selector: (row) => row.employeeData?.employeeIsActive,
      cell: (row) => (
        <span>
          {row.employeeData?.employeeIsActive ? (
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
      name: "CIN",
      selector: (row) => row?.cin || "",
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "100px",
      // sortFunction: (rowA, rowB) => {
      //   const usernameA = rowA.username.toLowerCase();
      //   const usernameB = rowB.username.toLowerCase();

      //   if (usernameA < usernameB) {
      //     return -1;
      //   }
      //   if (usernameA > usernameB) {
      //     return 1;
      //   }
      //   return 0;
      // },
    },
    {
      name: "Employee Name",
      selector: (row) =>
        `${row.userFullName?.userFirstName || ""} ${
          row.userFullName?.userMiddleName || ""
        } ${row.userFullName?.userLastName || ""}`,
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "200px",
      cell: (row) =>
        `${row.userFullName?.userFirstName}${" "}${
          row.userFullName?.userMiddleName
        }${" "}
          ${row.userFullName?.userLastName}`,
    },
    {
      name: "Sex",
      selector: (row) => row.userSex, //changed from userSex
      cell: (row) => (
        <span>
          {row.userSex === "Male" ? (
            <LiaMaleSolid className="text-sky-700 text-3xl" />
          ) : (
            <LiaFemaleSolid className="text-red-600 text-3xl" />
          )}
        </span>
      ),
      sortable: true,
      removableRows: true,
      width: "80px",
    },

    // {name: "DOB",
    //   selector:row=>new Date(row.userDob).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }),

    //   sortable:true,
    //   width:'100px'
    // },

    {
      name: "Years",
      selector: (row) => (
        <div>
          {(row?.employeeData?.employeeYears).map((year) => (
            <div key={year.academicYear}>{year.academicYear}</div>
          ))}
        </div>
      ),
      sortable: true,
      removableRows: true,
      width: "110px",
    },

    {
      name: "Position",
      selector: (row) =>
        row.employeeData?.employeeCurrentEmployment?.position || "",

      cell: (row) => (
        <div>
          <div>{row.employeeData?.employeeCurrentEmployment?.contractType}</div>
          <div>{row.employeeData?.employeeCurrentEmployment?.position}</div>
        </div>
      ),
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "110px",
    },

    {
      name: "Roles",
      selector: (row) => (
        <div>
          {(row?.userRoles).map((role) => (
            <div key={role}>{role}</div>
          ))}
        </div>
      ),
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      removableRows: true,
      width: "130px",
    },

    {
      name: "Package",
      selector: (row) => {
        // Find the most recent package
        const mostRecentPackage = row.employeeData?.salaryPackage
          ?.filter((pkg) => pkg.salaryFrom) // Ensure valid packages
          .sort((a, b) => {
            const dateA = a.salaryTo ? new Date(a.salaryTo) : Infinity; // Open-ended packages come first
            const dateB = b.salaryTo ? new Date(b.salaryTo) : Infinity;
            return dateB - dateA; // Sort by descending date
          })[0]; // Pick the most recent

        return mostRecentPackage ? (
          <div>
            <div>{`Basic: ${mostRecentPackage.basicSalary || "N/A"}`}</div>
            {mostRecentPackage.allowances?.map((allowance, index) => (
              <div key={index}>
                {`${allowance.allowanceLabel || "Allowance"}: ${
                  allowance.allowanceUnitValue || "0"
                }`}
              </div>
            ))}
            <div className="text-red-600">
              {`${
                mostRecentPackage.deduction?.deductionLabel || "Deduction"
              }: -${mostRecentPackage.deduction?.deductionAmount || "0"}`}
            </div>
          </div>
        ) : (
          <div>No Active Package</div>
        );
      },
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      removableRows: true,
      width: "250px",
    },

    {
      name: "Documents",
      selector: (row) => (
        <Link
          to={`/hr/employees/employeeDocumentsList/${row.id}`}
          aria-label={`employee document-${row?.id}`}
        >
          {" "}
          <IoDocumentAttachOutline className="text-fuchsia-500 text-2xl " />
        </Link>
      ),
      sortable: true,
      removableRows: true,
      width: "130px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          <button
            aria-label="employee Details"
            className="text-sky-700"
            fontSize={20}
            onClick={() => navigate(`/hr/employees/employeeDetails/${row.id}`)}
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
              aria-label="edit employee"
              className="text-amber-300"
              onClick={() => navigate(`/hr/employees/editEmployee/${row.id}`)}
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              aria-label="delete employee"
              className="text-red-600"
              onClick={() => onDeleteEmployeeClicked(row.id)}
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
      Employees List: <span> {filteredEmployees.length} employees</span>
    </h2>
  );
  let content;
  if (isEmployeesLoading)
    content = (
      <>
        <HR />
        <LoadingStateIcon />
      </>
    );
  // if (isEmployeesSuccess) {
  content = (
    <>
      <HR />
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
            className="serachQuery"
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
        {/* Year Filter Dropdown */}
        {/* not implemented becasue we only query the selected eyar */}
        {/* <label htmlFor="yearFilter" className="relative">
          <select
            aria-label="yearFilter"
            id="yearFilter"
            value={selectedYear}
            onChange={handleYearChange}
            className="text-sm h-8 border border-gray-300 px-4"
          >
            <option value="">All Years</option>
            {academicYears
              .filter((year) => year?.title !== "1000") // Exclude the year with title "1000"
              .map((year) => (
                <option key={year?.title} value={year?.title}>
                  {year?.title}
                </option>
              ))}
          </select>
        </label> */}
      </div>
      <div className="dataTableContainer">
        <div>
          <DataTable
            title={tableHeader}
            columns={column}
            data={filteredEmployees}
            pagination
            //selectableRows
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
          onClick={() => navigate("/hr/employees/newEmployee")}
          // disabled={selectedRows.length !== 1} // Disable if no rows are selected
          hidden={!canCreate}
        >
          New Employee
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
export default EmployeesList;
