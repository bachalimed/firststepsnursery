import {
  useGetPaymentsByYearQuery,
  useDeletePaymentMutation,
} from "./paymentsApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  //selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import Finances from "../Finances";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
//import { Link } from "react-router-dom";
import { useNavigate, useOutletContext } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import useAuth from "../../../hooks/useAuth";
import { MONTHS } from "../../../config/Months";
import { FiPrinter } from "react-icons/fi";
import PaymentDocument from "./PaymentDocument";
const PaymentsList = () => {
  useEffect(() => {
    document.title = "Payments List";
  });
  //this is for the academic year selection
  const navigate = useNavigate();

  const { isAdmin, canDelete, canCreate, isManager } = useAuth();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  //const academicYears = useSelector(selectAllAcademicYears);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idPaymentToDelete, setIdPaymentToDelete] = useState(null); // State to track which document to delete
  const PaymentTypes = ["Cash", "Cheque", "Bank Transfer", "Online Payment"];
  const [selectedPaymentType, setSelectedPaymentType] = useState(""); // "paid" or "unpaid"
  const { triggerBanner } = useOutletContext(); // Access banner trigger

  //function to return curent month for month selection
  const getCurrentMonth = () => {
    const currentMonthIndex = new Date().getMonth(); // Get current month (0-11)
    return MONTHS[currentMonthIndex]; // Return the month name with the first letter capitalized
  };
  const [selectedPaymentMonth, setSelectedPaymentMonth] = useState(""
   // getCurrentMonth()
  ); // payment month
  //console.log("Fetch payments for academic year:", selectedAcademicYear);
  const {
    data: payments, //the data is renamed payments
    isLoading: isPaymentsLoading,
    isSuccess: isPaymentsSuccess,
    // isError: isPaymentsError,
    // error: paymentsError,
    refetch,
  } = useGetPaymentsByYearQuery(
    {
      // selectedMonth: selectedPaymentMonth
      //   ? selectedPaymentMonth
      //   : getCurrentMonth(),
      selectedYear: selectedAcademicYear?.title,
      endpointName: "PaymentsList",
    } || {},
    {
      pollingInterval: 60000,
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
      error: delError,
    },
  ] = useDeletePaymentMutation();
  useEffect(() => {
    if (isDelSuccess) {
      refetch();
    }
  }, [refetch, isDelSuccess]);
  // Function to handle the delete button click
  const onDeletePaymentClicked = (id) => {
    setIdPaymentToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deletePayment({ id: idPaymentToDelete });
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
    setIdPaymentToDelete(null);
  };

  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  //const [filteredPayments, setFilteredPayments] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  let paymentsList = [];
  let filteredPayments = [];

  if (isPaymentsSuccess) {
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
        paymnt.paymentInvoices?.some(
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

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  //console.log(filteredPayments,'filteredPayments')
  const handleFetchPayment = (paymentId) => {
    const payment = filteredPayments.filter(
      (payment) => payment.id === paymentId
    );

    // console.log(payment[0], "payment");
    setPaymentData(payment[0]);
    setIsPreviewOpen(true);
  };
  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },
    //show this column only if user is a parent and not employee

    // isAdmin
    //   ? {
    //       name: "Payment ID",
    //       selector: (row) => (
    //         <Link to={`/payments/payments/paymentDetails/${row.id}`}>
    //           {row.id}
    //         </Link>
    //       ),
    //       sortable: true,
    //       width: "200px",
    //     }
    //   : null,
    {
      name: "Student Name",
      selector: (row) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            textAlign: "left",
          }}
          className={
            row?.paymentStudent?.studentIsActive ? "text-black" : "text-red-600"
          }
        >
          {row?.paymentStudent?.studentName?.firstName || ""}{" "}
          {row?.paymentStudent?.studentName?.middleName || ""}{" "}
          {row?.paymentStudent?.studentName?.lastName || ""}{" "}
          {row?.paymentStudent?.studentIsActive ? "" : "(Inactive)"}
        </div>
      ),
      style: {
        justifyContent: "left",
        textAlign: "left", // Aligns the header and cell content properly
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "Details",
      selector: (row) => `${row?.paymentAmount} ${row?.paymentType}`,
      sortable: true,
      width: "120px",
    },
    {
      name: "Invoice Month",

      cell: (row) => (
        <div>
          {row.paymentInvoices.map((invoice) => (
            <div key={invoice?._id}>{invoice?.invoiceMonth}</div>
          ))}
        </div>
      ),
      sortable: true,
      width: "140px",
      style: {
        justifyContent: "left",
        textAlign: "left", // Aligns the header and cell content properly
      },
    },

    {
      name: " Authorised",
      cell: (row) => (
        <div>
          {row.paymentInvoices.map((invoice) => (
            <div key={invoice?._id}>
              {" "}
              {invoice?.invoiceEnrolment?.serviceType}{" "}
              {invoice?.invoiceAuthorisedAmount}
            </div>
          ))}
        </div>
      ),
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left", // Aligns the header and cell content properly
      },
      width: "150px",
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
      width: "110px",
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
      name: "Pay Date",
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
      width: "120px",
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
          <button
            className="text-teal-500"
            fontSize={20}
            onClick={() => handleFetchPayment(row.id)}
          >
            <FiPrinter className="text-2xl" />
          </button>
          {/* <button
            className="text-sky-700"
            fontSize={20}
            onClick={() =>
              navigate(`/finances/payments/paymentDetails/${row.id}`)
            }
          >
            <ImProfile className="text-2xl" />
          </button> */}
          {/* {canEdit ? (
            <button
              className="text-amber-300"
              onClick={() =>
                navigate(`/finances/payments/editPayment/${row.id}`)
              }
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null} */}
          {canDelete &&
            !isDelLoading &&
            row?.paymentDate &&
            row?.paymentDate === "" && (
              <button
                aria-label="delete payment"
                className="text-red-600"
                onClick={() => onDeletePaymentClicked(row.id)}
                hidden={!isManager || !isAdmin}
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
  ].filter(Boolean); // Filter out falsy values like `false` or `undefined`

  // Custom header to include the row count
  const tableHeader = (
    <h2>
      Payments List: <span> {filteredPayments.length} payments</span>
    </h2>
  );

  let content;
  if (isPaymentsLoading)
    content = (
      <>
        <Finances />
        <LoadingStateIcon />
      </>
    );

  //ispaymentsuccesspaymentsin the filter will prevent other filter choices if failed
  content = (
    <>
      <Finances />
      <div className="flex space-x-2 items-center ml-3">
        {/* Search Bar */}
        <div className="relative h-10 mr-2 ">
          <HiOutlineSearch
            aria-label="search payments"
            fontSize={20}
            className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
          />
          <input
            aria-label="search payments"
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
        {/* Payment Month Filter */}
        <label htmlFor="monthFilter" className="formInputLabel">
          <select
            aria-label="monthFilter"
            id="monthFilter"
            value={selectedPaymentMonth}
            onChange={(e) => setSelectedPaymentMonth(e.target.value)}
            className="text-sm h-8 border border-gray-300  px-4"
          >
            {/* Default option is the current month */}

            {/* <option value="">{getCurrentMonth()}</option> */}
            <option value="">All Months</option>

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
        </label>

        {/* Payment Type Filter */}
        <label htmlFor="paymentTypeFilter" className="formInputLabel">
          <select
            aria-label="paymentTypeFilter"
            id="paymentTypeFilter"
            value={selectedPaymentType}
            onChange={(e) => setSelectedPaymentType(e.target.value)}
            className="text-sm h-8 border border-gray-300  px-4"
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
        </label>
      </div>
      <div className="dataTableContainer">
        <div>
          <DataTable
            title={tableHeader}
            columns={column}
            data={filteredPayments}
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
          onClick={() => navigate("/finances/payments/newPayment/")}
          hidden={!canCreate}
        >
          New Payment
        </button>
        {/* </div> */}
      </div>
      <DeletionConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />{" "}
      {isPreviewOpen && paymentData && (
        <PaymentDocument
          paymentData={paymentData}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </>
  );

  return content;
};
export default PaymentsList;
