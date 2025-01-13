import { HiOutlineSearch } from "react-icons/hi";
import { GiMoneyStack } from "react-icons/gi";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoShieldCheckmarkOutline, IoShieldOutline } from "react-icons/io5";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
// import RegisterModal from './RegisterModal'
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  useGetPayslipsByYearQuery,
  useDeletePayslipMutation,
} from "./payslipsApiSlice";
import HR from "../HR";
import { selectAllAcademicYears } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import useAuth from "../../../hooks/useAuth";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { MONTHS } from "../../../config/Months";
import { CurrencySymbol } from "../../../config/Currency";
import { FiPrinter } from "react-icons/fi";
import PayslipDocument from "./PayslipDocument";
const PayslipsList = () => {
  useEffect(() => {
    document.title = "Payslips List";
  });
  //this is for the academic year selection
  const navigate = useNavigate();

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idPayslipToDelete, setIdPayslipToDelete] = useState(null); // State to track which document to delete

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const { triggerBanner } = useOutletContext(); // Access banner trigger

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
    // isError: isPayslipsError,
    // error: payslipsError,
    refetch,
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
      error: delError,
    },
  ] = useDeletePayslipMutation();
  useEffect(() => {
    if (isDelSuccess) {
      refetch();
    }
  }, [isDelSuccess]);
  // Function to handle the delete button click
  const onDeletePayslipClicked = (id) => {
    setIdPayslipToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deletePayslip({ id: idPayslipToDelete });
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
    setIdPayslipToDelete(null);
  };

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [payslipData, setPayslipData] = useState(null);
  //console.log(filteredPayments,'filteredPayments')
  const handleFetchPayslip = (payslipId) => {
    const payslip = filteredPayslips.filter(
      (payslip) => payslip.id === payslipId
    );

    console.log(payslip[0], "payslip");
    setPayslipData(payslip[0]);
    setIsPreviewOpen(true);
  };

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },
    {
      name: "Month", // New column for entry number
      selector: (row) => row?.payslipMonth, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "100px",
    },
    //show this column only if user is a parent and not payslip

    // isAdmin && {
    //   name: "ID",
    //   selector: (row) => {
    //     row.id;
    //   },

    //   sortable: true,
    //   width: "240px",
    // },

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
      width: "120px",
    },
    {
      name: "Paid",
      selector: (row) => row?.payslipPaymentDate,
      cell: (row) => (
        <span>
          {row?.payslipPaymentDate && row?.payslipPaymentDate !== "" ? (
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
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
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
      name: "PayDay",
      selector: (row) =>
        row?.payslipPaymentDate
          ? new Date(row.payslipPaymentDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          : "---", // Or any placeholder for empty dates
      sortable: true,
      width: "110px",
    },

    //  {name: "Worked hours",
    //   selector:row=>(row?.TBD),

    //   sortable:true,
    //   width:'100px'
    // },
    {
      name: `Salary Details (${CurrencySymbol})`,
      selector: (row) => (
        <div>
          {/* Basic Salary */}
          <div>{`Basic: ${row?.payslipSalaryComponents?.basic || 0} `}</div>
          <div>{`Paid Basic: ${
            row?.payslipSalaryComponents?.payableBasic || 0
          } `}</div>

          {/* Allowances */}
          {row?.payslipSalaryComponents?.allowances?.length > 0 && (
            <div>
              <strong>Allowances:</strong>
              {row.payslipSalaryComponents.allowances.map(
                (allowance, index) => (
                  <div key={index}>
                    {`${allowance?.allowanceLabel || "N/A"}: ${
                      allowance?.allowanceUnitValue || 0
                    } x ${allowance?.allowanceNumber || 0} = ${
                      allowance?.allowanceTotalValue || 0
                    } `}
                  </div>
                )
              )}
            </div>
          )}

          {/* Deductions */}
          {row?.payslipSalaryComponents?.deduction && (
            <div>
              <strong>Deductions:</strong>
              <div>{`${
                row.payslipSalaryComponents.deduction.deductionLabel || "N/A"
              }: ${
                row.payslipSalaryComponents.deduction.deductionAmount || 0
              } `}</div>
            </div>
          )}

          {/* Total Salary */}
          <div>
            <strong>Total:</strong> {`${row?.payslipTotalAmount || 0} `}
          </div>
        </div>
      ),
      sortable: true,
      removableRows: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "260px",
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
          {row?.payslipIsApproved && row?.payslipPaymentDate && (
            <button
              className="text-teal-500"
              fontSize={20}
              onClick={() => handleFetchPayslip(row.id)}
            >
              <FiPrinter className="text-2xl" />
            </button>
          )}
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
              hidden={
                row?.payslipPaymentDate &&
                row.payslipPaymentDate &&
                row.payslipPaymentDate !== "" &&
                row?.payslipIsApproved === true
              }
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              aria-label="delete payslip"
              className="text-red-600"
              onClick={() => onDeletePayslipClicked(row.id)}
              hidden={
                (row?.payslipPaymentDate && row.payslipPaymentDate !== "") ||
                row?.payslipIsApproved === true
              }
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
  // if (isPayslipsSuccess)
  content = (
    <>
      <HR />
      <div className="flex space-x-2 items-center ml-3">
        {/* Search Bar */}
        <div className="relative h-10 mr-2 ">
          <HiOutlineSearch
            fontSize={20}
            className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
            aria-label="search payslips"
          />
          <input
            aria-label="search payslips"
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="serachQuery"
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
          </select>
        </label>
      </div>
      <div className="dataTableContainer">
        <div>
          <DataTable
            title={tableHeader}
            columns={column}
            data={filteredPayslips}
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
        {/* </div> */}
      </div>
      <DeletionConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />{" "}
      {isPreviewOpen && payslipData && (
        <PayslipDocument
          payslipData={payslipData}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </>
  );

  return content;
};
export default PayslipsList;
