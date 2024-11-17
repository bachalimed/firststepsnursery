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
     
      pollingInterval: 60000, 
      refetchOnFocus: true, 
      refetchOnMountOrArgChange: true, 
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
     
      refetchOnFocus: true, 
      refetchOnMountOrArgChange: true,
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

  const PaymentTypes = ["Cash", "Cheque", "Bank Transfer", "Online Payment"];
  const [selectedPaymentType, setSelectedPaymentType] = useState(""); // "paid" or "unpaid"

  const [selectedPaymentMonth, setSelectedPaymentMonth] = useState(
    getCurrentMonth()
  ); // payment month

  if (isPaymentGetSuccess) {
    //set to the state to be used for other component s and edit payment component
    const { entities } = payments;
    //we need to change into array to be read??
    paymentsList = Object.values(entities); //we are using entity adapter in this query
    //dispatch(setPayments(paymentsList)); //timing issue to update the state and use it the same time

   filteredPayments = paymentsList.filter((paymnt) => {
      // Normalize the search query
      const normalizedSearchQuery = searchQuery.toLowerCase();
    
      // Check if the student's name contains the search query
      const nameMatches = [
        paymnt?.paymentStudent?.studentName?.firstName,
        paymnt?.paymentStudent?.studentName?.middleName,
        paymnt?.paymentStudent?.studentName?.lastName,
      ].some((name) => name?.toLowerCase().includes(normalizedSearchQuery));
    
      // Check if any other field in the payment object contains the search query
      const otherMatches = Object.values(paymnt)
        .flat()
        .some((val) =>
          val?.toString().toLowerCase().includes(normalizedSearchQuery)
        );
    
      // Check if the payment type matches the selected payment type
      const meetsPaymentTypeCriteria =
        !selectedPaymentType || paymnt.paymentType === selectedPaymentType;
    
      // Check if any of the payment's invoices have the selected payment month
      const meetsPaymentMonthCriteria =
        !selectedPaymentMonth ||
        paymnt.paymentInvoices.some(
          (invoice) => invoice.invoiceMonth === selectedPaymentMonth
        );
    
      // Return true if all criteria are met
      return (
        (nameMatches || otherMatches) &&
        meetsPaymentTypeCriteria &&
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
      name: "Student Name",
      selector: (row) =>
        row?.paymentStudent?.studentName?.firstName +
        " " +
        row?.paymentStudent?.studentName?.middleName +
        " " +
        row?.paymentStudent?.studentName?.lastName,
      sortable: true,
      width: "160px",
    },
    {
      name: "Payment Details",
      selector: (row) => `${row?.paymentAmount} ${row?.paymentType}`,
      sortable: true,
      width: "150px",
    },
    {
      name: "Invoice Month",
      sortable: true,
      width: "140px",
      cell: (row) => (
        <div>
          {row.paymentInvoices.map((invoice) => (
            <div key={invoice?._id}>{invoice?.invoiceMonth}</div>
          ))}
        </div>
      ),
    },

   

    {
      name: " Authorised",
      cell: (row) => (
        <div>
          {row.paymentInvoices.map((invoice) => (
            <div key={invoice?._id}>{invoice?.invoiceAuthorisedAmount}</div>
          ))}
        </div>
      ),
      sortable: true,
      width: "120px",
    },
    {
      name: " Discount",
      cell: (row) => (
        <div>
          {row.paymentInvoices.map((invoice) => (
            <div key={invoice?._id}>{invoice?.invoiceDiscountAmount}</div>
          ))}
        </div>
      ),
      sortable: true,
      width: "100px",
    },

    {
      name: "Due Date",
      cell: (row) => (
        <div>
          {row.paymentInvoices.map((invoice) => (
            <div key={invoice?._id}>
              {new Date(invoice?.invoiceDueDate).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </div>
          ))}
        </div>
      ),

      sortable: true,
      width: "110px",
    },

    {
      name: "Payment Date",
      cell: (row) => (
        <div>
          {new Date(row.paymentDate).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      ),

      sortable: true,
      width: "110px",
    },
    {
      name: "Payment Note",
      selector: (row) => row?.paymentNote,
      cell: (row) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {row?.paymentNote}
        </div>
      ),
      sortable: true,
      width: "150px",
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
          {/* {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() =>
                navigate(`/finances/payments/editPayment/${row.id}`)
              }
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null} */}
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
      <h2>
        Payments List: <span> {filteredPayments.length} payments</span>
      </h2>
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

  <option value="">All Months</option>
  <option value="">{getCurrentMonth()}</option>

  {/* Render the rest of the months, excluding the current month */}
  {MONTHS.map((month, index) => {
    if (month !== getCurrentMonth()) {
      return (
        <option key={index} value={month}>
          {month}
        </option>
      );
    }
    return null; // Ensure there's no option for the current month if it's already included
  })}
</select>

{/* Service Type Filter */}
<select
  value={selectedPaymentType}
  onChange={(e) => setSelectedPaymentType(e.target.value)}
  className="text-sm h-8 border border-gray-300 rounded-md px-4"
>
  {/* Option for all payment types */}
  <option value="">All Types</option>

  {/* Render available payment types */}
  {PaymentTypes.map((paym, index) => (
    <option key={index} value={paym}>
      {paym}
    </option>
  ))}
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
          <div className="flex justify-end items-center space-x-4">
            <button
              className="px-3 py-2 bg-green-500 text-white rounded"
              onClick={() => navigate("/finances/payments/newPayment/")}
              hidden={!canCreate}
            >
              Add Payment
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
