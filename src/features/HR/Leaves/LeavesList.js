import { HiOutlineSearch } from "react-icons/hi";
import { GiMoneyStack } from "react-icons/gi";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import { IoShieldCheckmarkOutline, IoShieldOutline } from "react-icons/io5";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { IoMdCheckboxOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
// import RegisterModal from './RegisterModal'
import { Link, useNavigate } from "react-router-dom";
import {
  useGetLeavesByYearQuery,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} from "./leavesApiSlice";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { TbMedicalCrossOff } from "react-icons/tb";
import { TbMedicalCross } from "react-icons/tb";
import HR from "../HR";
import {
  setAcademicYears,
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
  const [requiredDocNumber, setRequiredDocNumber] = useState("");
  const [leaveDocNumber, setLeaveDocNumber] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idLeaveToDelete, setIdLeaveToDelete] = useState(null); // State to track which document to delete

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

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
      error: delerror,
    },
  ] = useDeleteLeaveMutation();

  // Function to handle the delete button click
  const onDeleteLeaveClicked = (id) => {
    setIdLeaveToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deleteLeave({ id: idLeaveToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdLeaveToDelete(null);
  };

  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
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
    //dispatch(setLeaves(leavesList)); //timing issue to update the state and use it the same time

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
    updateLeave,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateLeaveMutation(); //it will not execute the mutation nownow but when called
  const [leaveObject, setLeaveObject] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  //console.log(academicYears)
  // Handler for registering selected row,
  const [leaveYears, setLeaveYears] = useState([]);
  const handleRegisterSelected = () => {
    //we already allowed only one to be selected in the button options
    //console.log('Selected Rows to detail:', selectedRows)

    setLeaveObject(selectedRows[0]);
    //console.log(leaveObject, "leaveObject");
    //const {leaveYears}= (leaveObject)

    setLeaveYears(leaveObject?.leaveYears);
    //console.log("leave years and id", leaveYears);
    setIsRegisterModalOpen(true);

    //setSelectedRows([]); // Clear selection after process
  };
  //console.log(filteredLeaves, "filteredLeaves");
  // This is called when saving the updated leave years from the modal
  const onUpdateLeaveClicked = async (updatedYears) => {
    console.log("Updated leaveYears from modal:", updatedYears);

    const updatedLeaveObject = {
      ...leaveObject,
      leaveYears: updatedYears, // Merge updated leaveYears
    };

    console.log("Saving updated leave:", updatedLeaveObject);

    try {
      await updateLeave(updatedLeaveObject); // Save updated leave to backend
      console.log("Leave updated successfully");
    } catch (leavesError) {
      console.log("leavesError saving leave:", leavesError);
    }

    setIsRegisterModalOpen(false); // Close modal
  };

  //   const [leaveYears, setLeaveYears] = useState([])
  // //adds to the previous entries in arrays for gardien, schools...
  //       const onLeaveYearsChanged = (e, selectedYear) => {
  //         if (e.target.checked) {
  //           // Add the selectedYear to leaveYears if it's checked
  //           setLeaveYears([...leaveYears, selectedYear]);
  //         } else {
  //           // Remove the selectedYear from leaveYears if it's unchecked
  //           setLeaveYears(leaveYears.filter(year => year !== selectedYear))
  //         }
  //       }

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },
    {
      name: "Month", // New column for entry number
      selector: (row) => row?.leaveMonth, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "100px",
    },
    //show this column only if user is a parent and not leave

    isAdmin && {
      name: "ID",
      selector: (row) => (
        <div>
          <Link to={`/hr/leaves/leaveDetails/${row.id}`}>
            <div>User {row.id} </div>
          </Link>
          <Link to={`/hr/leaves/leaveDetails/${row.id}`}>
            {" "}
            {/* the leave details use the user Id and not leaveId */}{" "}
            {row.leaveId && <div>Emp {row.leaveId} </div>}
          </Link>
        </div>
      ),

      sortable: true,
      width: "240px",
    },
    //  (isAdmin)&&{
    // name: "Leave ID",
    // selector:row=>( <Link to={`/hr/leaves/leaveDetails/${row.leaveId}`} >{row.leaveId} </Link> ),
    // sortable:true,
    // width:'200px'
    //  },
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
      width: "100px",
    },
    {
      name: "Paid Leave",
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
      width: "110px",
    },
    {
      name: "Sick Leave",
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
      width: "110px",
    },
    {
      name: "Employee Name",
      selector: (row) =>
        `${row?.leaveEmployee?.userFullName?.userFirstName || ""} ${
          row?.leaveEmployee?.userFullName?.userMiddleName || ""
        } ${row?.leaveEmployee?.userFullName?.userLastName || ""}`,
      sortable: true,
      width: "200px",
      cell: (row) => (
        <Link to={`/hr/leaves/leaveDetails/${row.id}`}>
          {row?.leaveEmployee?.userFullName?.userFirstName}{" "}
          {row?.leaveEmployee?.userFullName?.userMiddleName}{" "}
          {row?.leaveEmployee?.userFullName?.userLastName}
        </Link>
      ),
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
          return <LeaveDuration leaveStartDate={row?.leaveStartDate} leaveEndDate={row?.leaveEndDate} />;
        }
      },
      sortable: true,
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
      removableRows: true,
      width: "150px",
    },
    
    //  {name: "Worked hours",
    //   selector:row=>(row?.TBD),

    //   sortable:true,
    //   width:'100px'
    // },
    {
      name: "Comment", //means authorised
      selector: (row) => row?.leaveNote,

      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {row?.leaveNote}
        </div>
      ),
      width: "140px",
    },

    // {
    //   name: "Documents",
    //   selector: (row) => (
    //     <Link to={`/hr/leaves/leaveDocumentsList/${row.id}`}>
    //       {" "}
    //       <IoDocumentAttachOutline className="text-slate-800 text-2xl" />
    //     </Link>
    //   ),
    //   sortable: true,
    //   removableRows: true,
    //   width: "120px",
    // },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          <button
            className="text-blue-500"
            fontSize={20}
            onClick={() => navigate(`/hr/leaves/leaveDetails/${row.id}`)}
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() => navigate(`/hr/leaves/editLeave/${row.id}`)}
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              className="text-red-500"
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
  ];

  // Custom header to include the row count
  const tableHeader = (
    <div>
      <h2>
        Leaves List: <span> {filteredLeaves.length} leaves</span>
      </h2>
    </div>
  );
  let content;
  if (isLeavesLoading)
    content = (
      <p>
        <HR />
        <LoadingStateIcon />
      </p>
    );
  if (isLeavesError) {
    content = (
      <p className="errmsg">
        <HR />
        {leavesError?.data?.message}
      </p>
    ); //errormessage class defined in the css, the error has data and inside we have message of error
  }
  if (isLeavesSuccess) {
    content = (
      <>
        <HR />

        <div className="flex space-x-2 items-center">
          {/* Search Bar */}
          <div className="relative h-10 mr-2 ">
            <HiOutlineSearch
              fontSize={20}
              className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="text-sm focus:outline-none active:outline-none mt-1 h-8 w-[24rem] border border-gray-300 rounded-md px-4 pl-11 pr-4"
            />
          </div>
          {/*  Month Filter */}
          <select
            value={selectedLeaveMonth}
            onChange={(e) => setSelectedLeaveMonth(e.target.value)}
            className="text-sm h-8 border border-gray-300 rounded-md px-4"
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
        </div>
        <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
          <DataTable
            title={tableHeader}
            columns={column}
            data={filteredLeaves}
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
        leaveYears={leaveYears}
        academicYears={academicYears}
        onSave={onUpdateLeaveClicked}
      /> */}
      </>
    );
  }
  return content;
};
export default LeavesList;
