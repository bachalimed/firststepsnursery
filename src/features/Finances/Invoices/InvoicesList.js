import {
  useGetInvoicesByYearQuery,
  useDeleteInvoiceMutation,
} from "./invoicesApiSlice";
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
import { MdOutlineAddBox } from "react-icons/md";
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MONTHS } from "../../../config/Months";
import useAuth from "../../../hooks/useAuth";

import { MdPaid, MdOutlinePaid } from "react-icons/md";
const InvoicesList = () => {
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
  const [idInvoiceToDelete, setIdInvoiceToDelete] = useState(null); // State to track which document to delete

  //function to return curent month for month selection
  const getCurrentMonth = () => {
    const currentMonthIndex = new Date().getMonth(); // Get current month (0-11)
    return MONTHS[currentMonthIndex]; // Return the month name with the first letter capitalized
  };
  //console.log("Fetch invoices for academic year:", selectedAcademicYear);
  const {
    data: invoices, //the data is renamed invoices
    isLoading: isInvoiceGetLoading, //monitor several situations is loading...
    isSuccess: isInvoiceGetSuccess,
    isError: isInvoiceGetError,
    error: invoiceGetError,
  } = useGetInvoicesByYearQuery(
    {
      selectedMonth: getCurrentMonth(),
      selectedYear: selectedAcademicYear?.title,
      endpointName: "InvoicesList",
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
      endpointName: "InvoicesList",
    } || {},
    {
     
      refetchOnFocus: true, 
      refetchOnMountOrArgChange: true, 
    }
  );
  //initialising the delete Mutation
  const [
    deleteInvoice,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteInvoiceMutation();

  // Function to handle the delete button click
  const onDeleteInvoiceClicked = (id) => {
    setIdInvoiceToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deleteInvoice({ id: idInvoiceToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdInvoiceToDelete(null);
  };
  const servicesList = isServicesSuccess
    ? Object.values(services.entities)
    : [];
  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredInvoices, setFilteredInvoices] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  let invoicesList = [];
  let filteredInvoices = [];

  const [discountedFilter, setDiscountedFilter] = useState(""); // "invoiced" or "uninvoiced"

  const [paidFilter, setPaidFilter] = useState(""); // "paid" or "unpaid"
  const [selectedServiceType, setSelectedServiceType] = useState(""); // service type from servicesList
  const [selectedInvoiceMonth, setSelectedInvoiceMonth] = useState(
    getCurrentMonth()
  ); // invoice month

  if (isInvoiceGetSuccess) {
    //set to the state to be used for other component s and edit invoice component
    const { entities } = invoices;
    //we need to change into array to be read??
    invoicesList = Object.values(entities); //we are using entity adapter in this query
    //dispatch(setInvoices(invoicesList)); //timing issue to update the state and use it the same time

    filteredInvoices = invoicesList.filter((invoi) => {
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
          ? parseFloat(invoi.invoiceDiscountAmount) !== 0
          : parseFloat(invoi.invoiceDiscountAmount) === 0);

      const meetsPaidCriteria =
        !paidFilter ||
        (paidFilter === "paid"
          ? invoi.invoiceIsFullyPaid
          : !invoi.invoiceIsFullyPaid);
      const meetsServiceTypeCriteria =
        !selectedServiceType ||
        invoi.enrolments[0]?.serviceType === selectedServiceType;
      const meetsInvoiceMonthCriteria =
        !selectedInvoiceMonth || invoi.invoiceMonth === selectedInvoiceMonth;

      return (
        (nameMatches || otherMatches) &&
        meetsDiscountedCriteria &&
        meetsPaidCriteria &&
        meetsServiceTypeCriteria &&
        meetsInvoiceMonthCriteria
      );
    });
  }
  console.log(filteredInvoices, "filteredInvoices");
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
          name: "Invoice ID",
          selector: (row) => (
            <Link to={`/invoices/invoices/invoiceDetails/${row.id}`}>
              {row.id}
            </Link>
          ),
          sortable: true,
          width: "200px",
        }
      : null,
    {
      name: "Month",
      selector: (row) => row.invoiceMonth,
      sortable: true,
      width: "100px",
    },
    {
      name: " Paid",
      selector: (row) => row?.invoiceIsFullyPaid,
      cell: (row) => (
        <span>
          {row?.invoiceIsFullyPaid ? (
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
      name: "Invoiced", //means authorised
      selector: (row) => <div>{row?.invoiceAmount} </div>,
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
          <div>
            {row?.invoiceDiscountType ? `-${row?.invoiceDiscountType}` : "--"}
          </div>
          <div>
            {row?.invoiceDiscountAmount !== "0"
              ? `-${row?.invoiceDiscountAmount}`
              : "--"}
          </div>
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
            {new Date(row.invoiceDueDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
        </>
      ),

      sortable: true,
      width: "130px",
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
            {row?.invoicePayment?.paymentDate ? (
              <>
                {new Date(row.invoicePayment.paymentDate).toLocaleDateString(
                  "en-GB",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }
                )}
              </>
            ) : (
              "--"
            )}
          </div>
        </>
      ),

      sortable: true,
      width: "130px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {/* {! row?.invoiceIsFullyPaid&& <button
            className="text-teal-500"
            fontSize={20}
            onClick={() =>
              navigate(`/finances/payments/newPayment/${row.id}`)
            }
              >
             <MdOutlineAddBox className="text-2xl" />
          </button>} */}
          {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() =>
                navigate(`/finances/invoices/editInvoice/${row.id}`)
              }
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              className="text-red-500"
              onClick={() => onDeleteInvoiceClicked(row.id)}
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
        Invoices List:
        <span> {filteredInvoices.length} invoices</span>
      </h2>
    </div>
  );

  let content;
  if (isInvoiceGetLoading)
    content = (
      <>
        <Finances />
        <LoadingStateIcon />
      </>
    );
  if (isInvoiceGetError) {
    content = (
      <>
        <Finances />
        <p className="errmsg">{invoiceGetError?.data?.message}</p>
      </>
    ); //errormessage class defined in the css, the error has data and inside we have message of error
  }

  //if (isinvoiceGetSuccess){

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
        {/* Invoice Month Filter */}
        <select
          value={selectedInvoiceMonth}
          onChange={(e) => setSelectedInvoiceMonth(e.target.value)}
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

        {/* Invoiced Filter */}
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
          data={filteredInvoices}
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
              className="px-3 py-2 bg-teal-500 text-white rounded"
              onClick={() => navigate("/students/enrolments/enrolments/")}
              hidden={!canCreate}
            >
              Invoice from Enrolment
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
export default InvoicesList;
