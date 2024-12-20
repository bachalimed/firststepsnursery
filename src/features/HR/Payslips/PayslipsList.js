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

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
// import RegisterModal from './RegisterModal'
import { Link, useNavigate } from "react-router-dom";
import {
  useGetPayslipsByYearQuery,
  useUpdatePayslipMutation,
  useDeletePayslipMutation,
} from "./payslipsApiSlice";

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
const PayslipsList = () => {
  //this is for the academic year selection
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();
  const [requiredDocNumber, setRequiredDocNumber] = useState("");
  const [payslipDocNumber, setPayslipDocNumber] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idPayslipToDelete, setIdPayslipToDelete] = useState(null); // State to track which document to delete

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const [selectedPayslipMonth, setSelectedPayslipMonth] = useState(""); // invoice month
  //function to return curent month for month selection
  const getCurrentMonth = () => {
    const currentMonthIndex = new Date().getMonth(); // Get current month (0-11)
    return MONTHS[currentMonthIndex]; // Return the month name with the first letter capitalized
  };

  const {
    data: payslips, //the data is renamed payslips
    isLoading: isPayslipsLoading,
    isSuccess: isPayslipsSuccess,
    isError: isPayslipsError,
    error: payslipsError,
  } = useGetPayslipsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "payslipsList",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //initialising the delete Mutation
  const [
    deletePayslip,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeletePayslipMutation();

  // Function to handle the delete button click
  const onDeletePayslipClicked = (id) => {
    setIdPayslipToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deletePayslip({ id: idPayslipToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdPayslipToDelete(null);
  };

  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredPayslips, setFilteredPayslips] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  let payslipsList = [];
  let filteredPayslips = [];
  if (isPayslipsSuccess) {
    //set to the state to be used for other component s and edit payslip component

    const { entities } = payslips;

    //we need to change into array to be read??
    payslipsList = Object.values(entities); //we are using entity adapter in this query
    //console.log(payslipsList,'payslipsList')
    //dispatch(setPayslips(payslipsList)); //timing issue to update the state and use it the same time

    //the serach result data
    filteredPayslips = payslipsList?.filter((item) => {
      //the nested objects need extra logic to separate them
      const firstNameMatch = item?.payslipEmployee?.userFullName?.userFirstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const middleNameMatch =
        item?.payslipEmployee?.userFullName?.userMiddleName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const lastNameMatch = item?.payslipEmployee?.userFullName?.userLastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      //console.log('filteredPayslips in the success', item)
      const meetsPayslipMonthCriteria =
        !selectedPayslipMonth || item.payslipMonth === selectedPayslipMonth;

      return (
        (Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
          firstNameMatch ||
          middleNameMatch ||
          lastNameMatch) &&
        meetsPayslipMonthCriteria
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
    updatePayslip,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdatePayslipMutation(); //it will not execute the mutation nownow but when called
  const [payslipObject, setPayslipObject] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  //console.log(academicYears)
  // Handler for registering selected row,
  const [payslipYears, setPayslipYears] = useState([]);
  const handleRegisterSelected = () => {
    //we already allowed only one to be selected in the button options
    //console.log('Selected Rows to detail:', selectedRows)

    setPayslipObject(selectedRows[0]);
    //console.log(payslipObject, "payslipObject");
    //const {payslipYears}= (payslipObject)

    setPayslipYears(payslipObject?.payslipYears);
    //console.log("payslip years and id", payslipYears);
    setIsRegisterModalOpen(true);

    //setSelectedRows([]); // Clear selection after process
  };
  //console.log(filteredPayslips, "filteredPayslips");
  // This is called when saving the updated payslip years from the modal
  const onUpdatePayslipClicked = async (updatedYears) => {
    console.log("Updated payslipYears from modal:", updatedYears);

    const updatedPayslipObject = {
      ...payslipObject,
      payslipYears: updatedYears, // Merge updated payslipYears
    };

    console.log("Saving updated payslip:", updatedPayslipObject);

    try {
      await updatePayslip(updatedPayslipObject); // Save updated payslip to backend
      console.log("Payslip updated successfully");
    } catch (payslipsError) {
      console.log("payslipsError saving payslip:", payslipsError);
    }

    setIsRegisterModalOpen(false); // Close modal
  };

  //   const [payslipYears, setPayslipYears] = useState([])
  // //adds to the previous entries in arrays for gardien, schools...
  //       const onPayslipYearsChanged = (e, selectedYear) => {
  //         if (e.target.checked) {
  //           // Add the selectedYear to payslipYears if it's checked
  //           setPayslipYears([...payslipYears, selectedYear]);
  //         } else {
  //           // Remove the selectedYear from payslipYears if it's unchecked
  //           setPayslipYears(payslipYears.filter(year => year !== selectedYear))
  //         }
  //       }

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "40px",
    },
    {
      name: "Month", // New column for entry number
      selector: (row) => row?.payslipMonth, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "100px",
    },
    //show this column only if user is a parent and not payslip

    isAdmin && {
      name: "ID",
      selector: (row) => (
        <div>
          <Link to={`/hr/payslips/payslipDetails/${row.id}`}>
            <div>User {row.id} </div>
          </Link>
          <Link to={`/hr/payslips/payslipDetails/${row.id}`}>
            {" "}
            {/* the payslip details use the user Id and not payslipId */}{" "}
            {row.payslipId && <div>Emp {row.payslipId} </div>}
          </Link>
        </div>
      ),

      sortable: true,
      width: "240px",
    },
    //  (isAdmin)&&{
    // name: "Payslip ID",
    // selector:row=>( <Link to={`/hr/payslips/payslipDetails/${row.payslipId}`} >{row.payslipId} </Link> ),
    // sortable:true,
    // width:'200px'
    //  },
    {
      name: "Approved",
      selector: (row) => row?.payslipIsApproved,
      cell: (row) => (
        <span>
          {row?.payslipIsApproved ? (
            <IoShieldCheckmarkOutline className="text-green-500 text-2xl" />
          ) : (
            <IoShieldOutline className="text-amber-300 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: "Paid",
      selector: (row) => row?.payslipPaymentDate,
      cell: (row) => (
        <span>
          {row?.payslipPaymentDate ? (
            <GiMoneyStack className="text-green-500 text-2xl" />
          ) : (
            <GiMoneyStack className="text-red-400 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      width: "80px",
    },
    {
      name: "Employee Name",
      selector: (row) =>
        `${row?.payslipEmployee?.userFullName?.userFirstName || ""} ${
          row?.payslipEmployee?.userFullName?.userMiddleName || ""
        } ${row?.payslipEmployee?.userFullName?.userLastName || ""}`,
      sortable: true,
      width: "200px",
      cell: (row) => (
        <Link to={`/hr/payslips/payslipDetails/${row.id}`}>
          {row?.payslipEmployee?.userFullName?.userFirstName}{" "}
          {row?.payslipEmployee?.userFullName?.userMiddleName}{" "}
          {row?.payslipEmployee?.userFullName?.userLastName}
        </Link>
      ),
    },

    {
      name: "Total",
      selector: (row) => {
        if (
          !row.payslipSalaryComponents ||
          !Array.isArray(row?.payslipSalaryComponents)
        ) {
          return 0; // Return 0 if no components exist
        }

        // Calculate total amount
        const total = row?.payslipSalaryComponents?.reduce((sum, component) => {
          const amount = Number(component?.amount) || 0; // Ensure amount is numeric
          const reduction = Number(component?.reduction) || 0; // Ensure reduction is numeric
          return sum + amount - reduction; // Add amount and subtract reduction
        }, 0);

        return total.toFixed(2); // Format to 2 decimal places
      },
      sortable: true,
      width: "100px",
    },

    {
      name: "Leave Days",
      selector: (row) => (
        <div>
          {row?.payslipAbsentDays?.map((day, index) => (
            <div key={index}>
              {day?.dayIsPaid ? "paid: " : "unpaid: "}
              {new Date(day?.absentDate).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </div>
          ))}
        </div>
      ),

      sortable: true,
      removableRows: true,
      width: "130px",
    },
    //  {name: "Worked hours",
    //   selector:row=>(row?.TBD),

    //   sortable:true,
    //   width:'100px'
    // },
    {
      name: "Package",
      selector: (row) => (
        <div>
          {row?.payslipSalaryComponents?.map((comp, index) => (
            <div key={index}>
              {comp?.component} {comp?.amount} {comp?.periodicity}
            </div>
          ))}
        </div>
      ),

      sortable: true,
      removableRows: true,
      width: "180px",
    },

    // {
    //   name: "Documents",
    //   selector: (row) => (
    //     <Link to={`/hr/payslips/payslipDocumentsList/${row.id}`}>
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
          aria-label="payslip Details"
            className="text-sky-700"
            fontSize={20}
            onClick={() => navigate(`/hr/payslips/payslipDetails/${row.id}`)}
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
            aria-label="edit payslip"
              className="text-amber-300"
              onClick={() => navigate(`/hr/payslips/editPayslip/${row.id}`)}
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
            aria-label="delete payslip"
              className="text-red-600"
              onClick={() => onDeletePayslipClicked(row.id)}
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
        Payslips List: <span> {filteredPayslips.length} payslips</span>
      </h2>
    
  );
  let content;
  if (isPayslipsLoading)
    content = (
      <>
        <HR />
        <LoadingStateIcon />
      </>
    );

    content = (
      <>
        <HR />

        <div className="flex space-x-2 items-center ml-3">
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
              className="text-sm focus:outline-none active:outline-none mt-1 h-8 w-[24rem] border border-gray-300  px-4 pl-11 pr-4"
            />
          </div>
          {/*  Month Filter */}
          <label htmlFor="monthFilter" className="formInputLabel">
        <select
        aria-label="monthFilter"
        id="monthFilter"
            value={selectedPayslipMonth}
            onChange={(e) => setSelectedPayslipMonth(e.target.value)}
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
          </select></label>
        </div>
        <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
          <DataTable
            title={tableHeader}
            columns={column}
            data={filteredPayslips}
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
            }}
          ></DataTable>
          <div className="cancelSavebuttonsDiv">
            <button
              className="add-button"
              onClick={() => navigate("/hr/payslips/newPayslip")}
              // disabled={selectedRows.length !== 1} // Disable if no rows are selected
              hidden={!canCreate}
            >
              New Payslip
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
        payslipYears={payslipYears}
        academicYears={academicYears}
        onSave={onUpdatePayslipClicked}
      /> */}
      </>
    );
  
  return content;
};
export default PayslipsList;
