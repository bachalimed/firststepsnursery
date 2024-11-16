import {

  useGetPaymentsByYearQuery,
  useDeletePaymentMutation,
} from "./paymentsApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import Finances from "../Finances";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";

import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

import useAuth from "../../../hooks/useAuth";
import { MONTHS } from "../../../config/Months";
import { MdPaid, MdOutlinePaid } from "react-icons/md";
const PaymentsList = () => {
  //this is for the academic year selection
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idPaymentToDelete, setIdPaymentToDelete] = useState(null); // State to track which document to delete


  //function to return curent month for month selection
  const getCurrentMonth = () => {
    const currentMonthIndex = new Date().getMonth(); // Get current month (0-11)
    return MONTHS[currentMonthIndex]; // Return the month name with the first letter capitalized
  };
  //console.log("Fetch payments for academic year:", selectedAcademicYear);
  const {
    data: payments, //the data is renamed payments
    isLoading: isPaymentGetLoading, //monitor several situations is loading...
    isSuccess: isPaymentGetSuccess,
    isError: isPaymentGetError,
    error: paymentGetError,
  } = useGetPaymentsByYearQuery(
    {
      selectedMonth: getCurrentMonth(),
      selectedYear: selectedAcademicYear?.title,
      endpointName: "PaymentsList",
    } || {},
    {
      //this param will be passed in req.params to select only payments for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      pollingInterval: 60000, //will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  const {
    data: services,
    isLoading: isServicesLoading,
    isSuccess: isServicesSuccess,
    isError: isServicesError,
    error: servicesError,
  } = useGetServicesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "PaymentsList",
    } || {},
    {
      //this param will be passed in req.params to select only services for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );
  //initialising the delete Mutation
  const [
    deletePayment,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeletePaymentMutation();

  // Function to handle the delete button click
  const onDeletePaymentClicked = (id) => {
    setIdPaymentToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deletePayment({ id: idPaymentToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdPaymentToDelete(null);
  };
  const servicesList = isServicesSuccess
    ? Object.values(services.entities)
    : [];
  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredPayments, setFilteredPayments] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  let paymentsList = [];
  let filteredPayments = [];

  const [discountedFilter, setDiscountedFilter] = useState(""); // "paymentd" or "unpaymentd"

  const [paidFilter, setPaidFilter] = useState(""); // "paid" or "unpaid"
  const [selectedServiceType, setSelectedServiceType] = useState(""); // service type from servicesList
  const [selectedPaymentMonth, setSelectedPaymentMonth] = useState(
    getCurrentMonth()
  ); // payment month

  if (isPaymentGetSuccess) {
    //set to the state to be used for other component s and edit payment component
    const { entities } = payments;
    //we need to change into array to be read??
    paymentsList = Object.values(entities); //we are using entity adapter in this query
    //dispatch(setPayments(paymentsList)); //timing issue to update the state and use it the same time

    filteredPayments = paymentsList.filter((invoi) => {
      // Check if the student's name or any other field contains the search query
      const nameMatches = [
        invoi?.enrolments[0]?.student?.studentName?.firstName,
        invoi?.enrolments[0]?.student?.studentName?.middleName,
        invoi?.enrolments[0]?.student?.studentName?.lastName,
      ].some((name) => name?.toLowerCase().includes(searchQuery.toLowerCase()));

      const otherMatches = Object.values(invoi)
        .flat()
        .some((val) =>
          val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Apply all filters with AND logic
      const meetsDiscountedCriteria =
        !discountedFilter ||
        (discountedFilter === "Discounted"
          ? parseFloat(invoi.paymentDiscountAmount) !== 0
          : parseFloat(invoi.paymentDiscountAmount) === 0);

      const meetsPaidCriteria =
        !paidFilter ||
        (paidFilter === "paid" ? invoi.isFullyPaid : !invoi.isFullyPaid);
      const meetsServiceTypeCriteria =
        !selectedServiceType ||
        invoi.enrolments[0]?.serviceType === selectedServiceType;
      const meetsPaymentMonthCriteria =
        !selectedPaymentMonth || invoi.paymentMonth === selectedPaymentMonth;

      return (
        (nameMatches || otherMatches) &&
        meetsDiscountedCriteria &&
        meetsPaidCriteria &&
        meetsServiceTypeCriteria &&
        meetsPaymentMonthCriteria
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

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },
    //show this column only if user is a parent and not employee

    isAdmin
      ? {
          name: "Payment ID",
          selector: (row) => (
            <Link to={`/payments/payments/paymentDetails/${row.id}`}>
              {row.id}
            </Link>
          ),
          sortable: true,
          width: "200px",
        }
      : null,
    {
      name: "Month",
      selector: (row) => row.paymentMonth,
      sortable: true,
      width: "100px",
    },
    {
      name: " Paid",
      selector: (row) => row?.paymentIsFullyPaid,
      cell: (row) => (
        <span>
          {row?.paymentIsFullyPaid ? (
            <MdOutlinePaid className="text-green-500 text-2xl" />
          ) : (
            <MdPaid className="text-red-400 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      width: "80px",
    },
    {
      name: "Student Name",
      selector: (row) =>
        row?.enrolments[0]?.student?.studentName?.firstName +
        " " +
        row?.enrolments[0]?.student?.studentName?.middleName +
        " " +
        row?.enrolments[0]?.student?.studentName?.lastName,
      sortable: true,
      width: "160px",
    },
    {
      name: "Paymentd", //means authorised
      selector: (row) => (
        
          <div>{row?.paymentAmount} </div>
        
      ),
      sortable: true,
      
      width: "110px",
    },
    {
      name: "Agreed", //means authorised
      selector: (row) => (
        <>
          <div>Final {row?.enrolments[0]?.serviceFinalFee}</div>
          <div>Authorised {row.enrolments[0]?.serviceAuthorisedFee}</div>
        </>
      ),
      sortable: true,
      width: "140px",
    },

    {
      name: "Service",
      selector: (row) => (
        <>
          <div>{row.enrolments[0]?.serviceType}</div>
          <div>{row.enrolments[0]?.servicePeriod}</div>
        </>
      ),

      sortable: true,
      width: "120px",
    },

    {
      name: "Discount",

      selector: (row) => (
        <div>
          <div>{row?.paymentDiscountType ? `-${row?.paymentDiscountType}` : "--"}</div>
          <div>{row?.paymentDiscountAmount !=="0"? `-${row?.paymentDiscountAmount}` : "--"}</div>
        </div>
      ),

      sortable: true,
      width: "120px",
    },

    {
      name: "Due Date",
      selector: (row) => (
        <>
          <div>
            on{" "}
            {new Date(row.paymentDueDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
        </>
      ),

      sortable: true,
      width: "140px",
    },

    // {
    //   name: "Authorised", //means authorised
    //   selector: (row) =>
    //     row.admission.agreedServices?.isAuthorised ? "yes" : "No",

    //   sortable: true,
    //   width: "140px",
    // },

    {
      name: "Payment Date",
      selector: (row) => (
        <>
          <div>
            on{" "}
            {new Date(row.paymentEnrolment?.PAidOn).toLocaleDateString(
              "en-GB",
              {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }
            )}
          </div>
        </>
      ),

      sortable: true,
      width: "140px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {/* <button
            className="text-blue-500"
            fontSize={20}
            onClick={() =>
              navigate(`/finances/payments/paymentDetails/${row.id}`)
            }
          >
            <ImProfile className="text-2xl" />
          </button> */}
          {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() =>
                navigate(`/finances/payments/editPayment/${row.id}`)
              }
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              className="text-red-500"
              onClick={() => onDeletePaymentClicked(row.id)}
            >
              <RiDeleteBin6Line className="text-2xl" />
            </button>
          )}
        </div>
      ),
      ignoreRowClick: true,

      button: true,
      width: "120px",
    },
  ];

  // Custom header to include the row count
  const tableHeader = (
    <div>
      <h2>Payments List</h2>
      <span> {filteredPayments.length} payments</span>
    </div>
  );

  let content;
  if (isPaymentGetLoading)
    content = (
      <>
        <Finances />
        <LoadingStateIcon />
      </>
    );
  if (isPaymentGetError) {
    content = (
      <>
        <Finances />
        <p className="errmsg">{paymentGetError?.data?.message}</p>
      </>
    ); //errormessage class defined in the css, the error has data and inside we have message of error
  }

  //if (ispaymentGetSuccess){

  content = (
    <>
      <Finances />
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
        {/* Payment Month Filter */}
        <select
          value={selectedPaymentMonth}
          onChange={(e) => setSelectedPaymentMonth(e.target.value)}
          className="text-sm h-8 border border-gray-300 rounded-md px-4"
        >
          {/* Default option is the current month */}
          <option value={getCurrentMonth()}>{getCurrentMonth()}</option>

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
        {/* Service Type Filter */}
        <select
          value={selectedServiceType}
          onChange={(e) => setSelectedServiceType(e.target.value)}
          className="text-sm h-8 border border-gray-300 rounded-md px-4"
        >
          <option value="">All Services</option>
          {servicesList.map((service, index) => (
            <option key={index} value={service?.serviceType}>
              {service?.serviceType}
            </option>
          ))}
        </select>

        {/* Paymentd Filter */}
        <select
          value={discountedFilter}
          onChange={(e) => setDiscountedFilter(e.target.value)}
          className="text-sm h-8 border border-gray-300 rounded-md px-4"
        >
          <option value="">All discounts</option>
          <option value="Discounted">Discounted</option>
          <option value="Not Discounted">Not Discounted</option>
        </select>

        {/* Paid Filter */}
        <select
          value={paidFilter}
          onChange={(e) => setPaidFilter(e.target.value)}
          className="text-sm h-8 border border-gray-300 rounded-md px-4"
        >
          <option value="">All payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>
      <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
        <DataTable
          title={tableHeader}
          columns={column}
          data={filteredPayments}
          pagination
          //selectableRows
          removableRows
          pageSizeControl
          onSelectedRowsChange={handleRowSelected}
          selectableRowsHighlight
        ></DataTable>
        <div className="flex justify-end items-center space-x-4">
          <div className="flex justify-end items-center space-x-4">
            <button
              className="px-3 py-2 bg-teal-500 text-white rounded"
              onClick={() => navigate("/students/enrolments/enrolments/")}
              hidden={!canCreate}
            >
              Payment from Enrolment
            </button>
          </div>
        </div>
      </div>
      <DeletionConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
  //}
  return content;
};
export default PaymentsList;
