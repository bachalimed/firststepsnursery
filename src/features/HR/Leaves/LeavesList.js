import { HiOutlineSearch } from "react-icons/hi";
import { GiMoneyStack } from "react-icons/gi";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { IoMdCheckboxOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import { useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
// import RegisterModal from './RegisterModal'
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  useGetLeavesByYearQuery,
  useDeleteLeaveMutation,
} from "./leavesApiSlice";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { TbMedicalCrossOff } from "react-icons/tb";
import { TbMedicalCross } from "react-icons/tb";
import HR from "../HR";
import {
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import useAuth from "../../../hooks/useAuth";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { MONTHS } from "../../../config/Months";
const LeavesList = () => {
  //this is for the academic year selection
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idLeaveToDelete, setIdLeaveToDelete] = useState(null); // State to track which document to delete

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const [selectedLeaveMonth, setSelectedLeaveMonth] = useState(""); // invoice month
  //function to return curent month for month selection
  const getCurrentMonth = () => {
    const currentMonthIndex = new Date().getMonth(); // Get current month (0-11)
    return MONTHS[currentMonthIndex]; // Return the month name with the first letter capitalized
  };

  const {
    data: leaves, //the data is renamed leaves
    isLoading: isLeavesLoading,
    isSuccess: isLeavesSuccess,
    isError: isLeavesError,
    error: leavesError,
  } = useGetLeavesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "leavesList",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //initialising the delete Mutation
  const [
    deleteLeave,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteLeaveMutation();

  // Function to handle the delete button click
  const onDeleteLeaveClicked = (id) => {
    setIdLeaveToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteLeave({ id: idLeaveToDelete });
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
    setIdLeaveToDelete(null);
  };

  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredLeaves, setFilteredLeaves] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  let leavesList = [];
  let filteredLeaves = [];
  if (isLeavesSuccess) {
    //set to the state to be used for other component s and edit leave component

    const { entities } = leaves;

    //we need to change into array to be read??
    leavesList = Object.values(entities); //we are using entity adapter in this query
    //console.log(leavesList,'leavesList')
  
    //the serach result data
    filteredLeaves = leavesList?.filter((item) => {
      //the nested objects need extra logic to separate them
      const firstNameMatch = item?.leaveEmployee?.userFullName?.userFirstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const middleNameMatch = item?.leaveEmployee?.userFullName?.userMiddleName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const lastNameMatch = item?.leaveEmployee?.userFullName?.userLastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      //console.log('filteredLeaves in the success', item)
      const meetsLeaveMonthCriteria =
        !selectedLeaveMonth || item.leaveMonth === selectedLeaveMonth;

      return (
        (Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
          firstNameMatch ||
          middleNameMatch ||
          lastNameMatch) &&
        meetsLeaveMonthCriteria
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
      width: "40px",
    },
    {
      name: "Month", // New column for entry number
      selector: (row) => row?.leaveMonth, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "100px",
    },
    //show this column only if user is a parent and not leave

    // isAdmin && {
    //   name: "ID",
    //   selector: (row) => (
    //     <div>
    //       <Link to={`/hr/leaves/leaveDetails/${row.id}`}>
    //         <div>User {row.id} </div>
    //       </Link>
    //       <Link to={`/hr/leaves/leaveDetails/${row.id}`}>
    //         {" "}
    //         {/* the leave details use the user Id and not leaveId */}{" "}
    //         {row.leaveId && <div>Emp {row.leaveId} </div>}
    //       </Link>
    //     </div>
    //   ),

    //   sortable: true,
    //   width: "240px",
    // },

    {
      name: "Approved",
      selector: (row) => row?.leaveIsApproved,
      cell: (row) => (
        <span>
          {row?.leaveIsApproved ? (
            <IoMdCheckboxOutline className="text-green-500 text-2xl" />
          ) : (
            <MdCheckBoxOutlineBlank className="text-red-400 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      width: "120px",
    },
    {
      name: "Paid",
      selector: (row) => row?.leaveIsPaidLeave,
      cell: (row) => (
        <span>
          {row?.leaveIsPaidLeave ? (
            <GiMoneyStack className="text-green-500 text-2xl" />
          ) : (
            <GiMoneyStack className="text-red-400 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      width: "90px",
    },
    {
      name: "Sick",
      selector: (row) => row?.leaveIsSickLeave,
      cell: (row) => (
        <span>
          {row?.leaveIsSickLeave ? (
            <TbMedicalCross className="text-green-500 text-2xl" />
          ) : (
            <TbMedicalCrossOff className="text-red-400 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      width: "90px",
    },
    {
      name: "Employee Name",
      selector: (row) =>
        `${row?.leaveEmployee?.userFullName?.userFirstName || ""} ${
          row?.leaveEmployee?.userFullName?.userMiddleName || ""
        } ${row?.leaveEmployee?.userFullName?.userLastName || ""}`,

      cell: (row) => (
        <Link to={`/hr/leaves/leaveDetails/${row.id}`}>
          {row?.leaveEmployee?.userFullName?.userFirstName}{" "}
          {row?.leaveEmployee?.userFullName?.userMiddleName}{" "}
          {row?.leaveEmployee?.userFullName?.userLastName}
        </Link>
      ),
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "200px",
    },

    {
      name: "Duration",
      selector: (row) => {
        if (row?.leaveIsPartDay) {
          // Calculate hours difference for part-day leave
          const start = new Date(row.leaveStartDate);
          const end = new Date(row.leaveEndDate);
          const durationInHours = Math.abs((end - start) / (1000 * 60 * 60)); // Convert milliseconds to hours
          return <div>{durationInHours.toFixed(1)} hour(s)</div>;
        } else {
          // Show duration in days for full-day leave
          const LeaveDuration = ({ leaveStartDate, leaveEndDate }) => {
            // Ensure the dates are properly parsed
            const startDate = new Date(leaveStartDate);
            const endDate = new Date(leaveEndDate);

            // Calculate the duration in days (inclusive)
            const leaveDuration = Math.max(
              Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1,
              0
            ); // Ensure the duration doesn't go negative

            return <div>{leaveDuration} day(s)</div>;
          };

          // Usage
          return (
            <LeaveDuration
              leaveStartDate={row?.leaveStartDate}
              leaveEndDate={row?.leaveEndDate}
            />
          );
        }
      },
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      removableRows: true,
      width: "130px",
    },
    {
      name: "Leave Days",
      selector: (row) => {
        if (row?.leaveIsPartDay) {
          // Display hours for part-day leave
          const start = new Date(row?.leaveStartDate).toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
          const end = new Date(row?.leaveEndDate).toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <div>
              <div>fr {start}</div>
              <div>to {end}</div>
            </div>
          );
        } else {
          // Display dates for full-day leave
          return (
            <div>
              <div>
                from{" "}
                {new Date(row?.leaveStartDate).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </div>
              <div>
                to{" "}
                {new Date(row?.leaveEndDate).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </div>
            </div>
          );
        }
      },
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      removableRows: true,
      width: "160px",
    },

    {
      name: "Comment", //means authorised
      selector: (row) => row?.leaveComment,

      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {row?.leaveComment}
        </div>
      ),
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
          <button
            aria-label="leave Details"
            className="text-sky-700"
            fontSize={20}
            onClick={() => navigate(`/hr/leaves/leaveDetails/${row.id}`)}
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
              aria-label="edit leave"
              className="text-amber-300"
              onClick={() => navigate(`/hr/leaves/editLeave/${row.id}`)}
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              aria-label="delete leave"
              className="text-red-600"
              onClick={() => onDeleteLeaveClicked(row.id)}
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
      Leaves List: <span> {filteredLeaves.length} leaves</span>
    </h2>
  );
  let content;
  if (isLeavesLoading)
    content = (
      <>
        <HR />
        <LoadingStateIcon />
      </>
    );
    if (isLeavesSuccess)
  content = (
    <>
      <HR />

      <div className="flex space-x-2 items-center ml-3">
        {/* Search Bar */}
        <div className="relative h-10 mr-2 ">
          <HiOutlineSearch
            fontSize={20}
            className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
            aria-label="search leaves"
          />
          <input
            aria-label="search leaves"
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
        {/*  Month Filter */}
        <label htmlFor="monthFilter" className="formInputLabel">
          <select
            aria-label="monthFilter"
            id="monthFilter"
            value={selectedLeaveMonth}
            onChange={(e) => setSelectedLeaveMonth(e.target.value)}
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
            data={filteredLeaves}
            pagination
            //selectableRows
            removableRows
            pageSizeControl
            // onSelectedRowsChange={handleRowSelected}
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
            onClick={() => navigate("/hr/leaves/newLeave")}
            // disabled={selectedRows.length !== 1} // Disable if no rows are selected
            hidden={!canCreate}
          >
            New Leave
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
export default LeavesList;
