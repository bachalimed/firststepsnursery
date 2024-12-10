import {
  useGetEmployeesByYearQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "./employeesApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import HR from "../HR";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
//import { useGetEmployeeDocumentsByYearByIdQuery } from "../../../AppSettings/EmployeesSet/EmployeeDocumentsLists/employeeDocumentsListsApiSlice"
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
// import RegisterModal from './RegisterModal'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  setAcademicYears,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import useAuth from "../../../hooks/useAuth";
import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import { IoShieldCheckmarkOutline, IoShieldOutline } from "react-icons/io5";
import {
  setSomeEmployees,
  setEmployees,
  currentEmployeesList,
} from "./employeesSlice";
import { IoDocumentAttachOutline } from "react-icons/io5";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
const EmployeesList = () => {
  //this is for the academic year selection
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();
  const [requiredDocNumber, setRequiredDocNumber] = useState("");
  const [employeeDocNumber, setEmployeeDocNumber] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idEmployeeToDelete, setIdEmployeeToDelete] = useState(null); // State to track which document to delete

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
      error: delerror,
    },
  ] = useDeleteEmployeeMutation();

  // Function to handle the delete button click
  const onDeleteEmployeeClicked = (id) => {
    setIdEmployeeToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deleteEmployee({ id: idEmployeeToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdEmployeeToDelete(null);
  };

  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredEmployees, setFilteredEmployees] = useState([])
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
  // Handler for selecting rows
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
    //console.log('selectedRows', selectedRows)
  };

  // Handler for duplicating selected rows,
  const handleDuplicateSelected = () => {
    //console.log('Selected Rows to duplicate:', selectedRows);
    // Add  delete logic here (e.g., dispatching a Redux action or calling an API)
    //ensure only one can be selected: the last one
    const toDuplicate = selectedRows[-1];

    setSelectedRows([]); // Clear selection after delete
  };

  const [
    updateEmployee,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateEmployeeMutation(); //it will not execute the mutation nownow but when called
  const [employeeObject, setEmployeeObject] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  //console.log(academicYears)
  // Handler for registering selected row,
  const [employeeYears, setEmployeeYears] = useState([]);
  const handleRegisterSelected = () => {
    //we already allowed only one to be selected in the button options
    //console.log('Selected Rows to detail:', selectedRows)

    setEmployeeObject(selectedRows[0]);
    //console.log(employeeObject, "employeeObject");
    //const {employeeYears}= (employeeObject)

    setEmployeeYears(employeeObject?.employeeYears);
    //console.log("employee years and id", employeeYears);
    setIsRegisterModalOpen(true);

    //setSelectedRows([]); // Clear selection after process
  };
  //console.log(filteredEmployees, "filteredEmployees");
  // This is called when saving the updated employee years from the modal
  const onUpdateEmployeeClicked = async (updatedYears) => {
    console.log("Updated employeeYears from modal:", updatedYears);

    const updatedEmployeeObject = {
      ...employeeObject,
      employeeYears: updatedYears, // Merge updated employeeYears
    };

    console.log("Saving updated employee:", updatedEmployeeObject);

    try {
      await updateEmployee(updatedEmployeeObject); // Save updated employee to backend
      console.log("Employee updated successfully");
    } catch (employeesError) {
      console.log("employeesError saving employee:", employeesError);
    }

    setIsRegisterModalOpen(false); // Close modal
  };

  //   const [employeeYears, setEmployeeYears] = useState([])
  // //adds to the previous entries in arrays for gardien, schools...
  //       const onEmployeeYearsChanged = (e, selectedYear) => {
  //         if (e.target.checked) {
  //           // Add the selectedYear to employeeYears if it's checked
  //           setEmployeeYears([...employeeYears, selectedYear]);
  //         } else {
  //           // Remove the selectedYear from employeeYears if it's unchecked
  //           setEmployeeYears(employeeYears.filter(year => year !== selectedYear))
  //         }
  //       }

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },
    //show this column only if user is a parent and not employee

    isAdmin && {
      name: "ID",
      selector: (row) => (
        <div>
          <Link to={`/admin/users/userManagement/userDetails/${row.id}`}>
            <div>User {row.id} </div>
          </Link>
          <Link to={`/hr/employees/employeeDetails/${row.id}`}>
            {" "}
            {/* the employee details use the user Id and not employeeId */}{" "}
            {row.employeeId && <div>Emp {row.employeeId} </div>}
          </Link>
        </div>
      ),

      sortable: true,
      width: "240px",
    },
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
      width: "80px",
    },
    {
      name: "Employee Name",
      selector: (row) =>
        `${row.userFullName?.userFirstName || ""} ${
          row.userFullName?.userMiddleName || ""
        } ${row.userFullName?.userLastName || ""}`,
      sortable: true,
      width: "200px",
      cell: (row) => (
        <Link to={`/hr/employees/employeeDetails/${row.id}`}>
          {row.userFullName?.userFirstName} {row.userFullName?.userMiddleName}{" "}
          {row.userFullName?.userLastName}
        </Link>
      ),
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
      width: "70px",
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
      removableRows: true,
      width: "130px",
    },

    {
      name: "Package",
      selector: (row) => (
        <div>
          <div>{`Basic:  ${row.employeeData?.employeeCurrentEmployment?.salaryPackage?.basic} ${row.employeeData?.employeeCurrentEmployment?.salaryPackage?.payment}`}</div>
          {row.employeeData?.employeeCurrentEmployment?.salaryPackage?.cnss && (
            <div>{`cnss: ${row.employeeData?.employeeCurrentEmployment?.salaryPackage?.cnss}`}</div>
          )}
          {row.employeeData?.employeeCurrentEmployment?.salaryPackage
            ?.other && (
            <div>{`other: ${row.employeeData?.employeeCurrentEmployment?.salaryPackage?.other}`}</div>
          )}
        </div>
      ),
      sortable: true,
      removableRows: true,
      width: "150px",
    },

    {
      name: "Documents",
      selector: (row) => (
        <Link to={`/hr/employees/employeeDocumentsList/${row.id}`}>
          {" "}
          <IoDocumentAttachOutline className="text-slate-800 text-2xl" />
        </Link>
      ),
      sortable: true,
      removableRows: true,
      width: "120px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          <button
            className="text-sky-700"
            fontSize={20}
            onClick={() => navigate(`/hr/employees/employeeDetails/${row.id}`)}
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
              className="text-amber-300"
              onClick={() => navigate(`/hr/employees/editEmployee/${row.id}`)}
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
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
  ];

  // Custom header to include the row count
  const tableHeader = (
    <div>
      <h2>
        Employees List: <span> {filteredEmployees.length} employees</span>
      </h2>
    </div>
  );
  let content;
  if (isEmployeesLoading)
    content = (
      <>
        <HR />
        <LoadingStateIcon />
      </>
    );
  if (isEmployeesError) {
    content = (
      <>
        <HR />
        <div className="error-bar">{employeesError?.data?.message}</div>
      </>
    );
  }
  if (isEmployeesSuccess) {
    content = (
      <>
        <HR />

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
            data={filteredEmployees}
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
          </div>
        </div>
        <DeletionConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
        {/* <RegisterModal 
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        employeeYears={employeeYears}
        academicYears={academicYears}
        onSave={onUpdateEmployeeClicked}
      /> */}
      </>
    );
  }
  return content;
};
export default EmployeesList;
