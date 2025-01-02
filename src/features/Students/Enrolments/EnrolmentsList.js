import {
  useGetEnrolmentsByYearQuery,
  useDeleteEnrolmentMutation,
} from "./enrolmentsApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import { useAddNewInvoiceMutation } from "../../Finances/Invoices/invoicesApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import Students from "../Students";
import DataTable from "react-data-table-component";
import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import { IoShieldCheckmarkOutline, IoShieldOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import useAuth from "../../../hooks/useAuth";
import { MONTHS } from "../../../config/Months";
import { useOutletContext } from "react-router-dom";

const EnrolmentsList = () => {
  //this is for the academic year selection
  const navigate = useNavigate();

  const { userId, canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();
  const [selectedRows, setSelectedRows] = useState([]);
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idEnrolmentToDelete, setIdEnrolmentToDelete] = useState(null); // State to track which document to delete
  const [invoicedFilter, setInvoicedFilter] = useState(""); // "invoiced" or "notInvoiced"
  const [paidFilter, setPaidFilter] = useState(""); // "paid" or "unpaid"
  const [selectedServiceType, setSelectedServiceType] = useState(""); // service type from servicesList
  const [selectedEnrolmentMonth, setSelectedEnrolmentMonth] = useState(""); // enrolment month

  //function to return curent month for month selection
  const getCurrentMonth = () => {
    const currentMonthIndex = new Date().getMonth(); // Get current month (0-11)
    return MONTHS[currentMonthIndex]; // Return the month name with the first letter capitalized
  };
  //console.log("Fetch enrolments for academic year:", selectedAcademicYear);
  const {
    data: enrolments, //the data is renamed enrolments
    isLoading: isEnrolmentsLoading,
    isSuccess: isEnrolmentsSuccess,
    isError: isEnrolmentsError,
    error: enrolmentsError,
  } = useGetEnrolmentsByYearQuery(
    {
      // selectedMonth: getCurrentMonth(),
      selectedMonth: selectedEnrolmentMonth
        ? selectedEnrolmentMonth
        : getCurrentMonth(),
      selectedYear: selectedAcademicYear?.title,
      endpointName: "EnrolmentsList",
    } || {},
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  // Redux mutation for adding the attended school
  const [
    addNewInvoice,
    {
      isLoading: isAddLoading,
      isError: isAddError,
      error: addError,
      isSuccess: isAddSuccess,
    },
  ] = useAddNewInvoiceMutation();

  const {
    data: services,
    isLoading: isServicesLoading,
    isSuccess: isServicesSuccess,
    isError: isServicesError,
    error: servicesError,
  } = useGetServicesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "EnrolmentsList",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const { triggerBanner } = useOutletContext(); // Access banner trigger
  //initialising the delete Mutation
  const [
    deleteEnrolment,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteEnrolmentMutation();

  // Function to handle the delete button click
  const onDeleteEnrolmentClicked = (id) => {
    setIdEnrolmentToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteEnrolment({ id: idEnrolmentToDelete });
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
    setIdEnrolmentToDelete(null);
  };
  const servicesList = isServicesSuccess
    ? Object.values(services.entities)
    : [];

  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  let enrolmentsList = [];
  let filteredEnrolments = [];

  if (isEnrolmentsSuccess) {
    //set to the state to be used for other component s and edit enrolment component
    const { entities } = enrolments;
    //we need to change into array to be read??
    enrolmentsList = Object.values(entities); //we are using entity adapter in this query
    //dispatch(setEnrolments(enrolmentsList)); //timing issue to update the state and use it the same time

    filteredEnrolments = enrolmentsList.filter((enrol) => {
      // Check if the student's name or any other field contains the search query
      const nameMatches = [
        enrol?.student?.studentName?.firstName,
        enrol?.student?.studentName?.middleName,
        enrol?.student?.studentName?.lastName,
      ].some((name) => name?.toLowerCase().includes(searchQuery.toLowerCase()));

      const otherMatches = Object.values(enrol)
        .flat()
        .some((val) =>
          val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Apply all filters with AND logic

      const meetsInvoicedCriteria =
        !invoicedFilter ||
        (invoicedFilter === "invoiced"
          ? enrol.enrolmentInvoice
          : !enrol.enrolmentInvoice);
      const meetsPaidCriteria =
        !paidFilter || (paidFilter === "paid" ? enrol.isPaid : !enrol.isPaid);
      const meetsServiceTypeCriteria =
        !selectedServiceType ||
        enrol.service.serviceType === selectedServiceType;
      const meetsEnrolmentMonthCriteria =
        !selectedEnrolmentMonth ||
        enrol.enrolmentMonth === selectedEnrolmentMonth;

      return (
        (nameMatches || otherMatches) &&
        meetsInvoicedCriteria &&
        meetsPaidCriteria &&
        meetsServiceTypeCriteria &&
        meetsEnrolmentMonthCriteria
      );
    });
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Effect to clear the selection after successful addition
  useEffect(() => {
    if (isAddSuccess) {
      // Clear the selected rows in the state
      setSelectedRows([]);

      // console.log("Rows unselected after successful addition");
    }
  }, [isAddSuccess]);

  // Handler for selecting rows
  // Handler for selecting rows
  const handleRowSelected = (state) => {
    // Update state with the newly selected rows
    setSelectedRows(state.selectedRows);
    // console.log("selectedRows:", state.selectedRows);
  };

  // Handler for generating an invoice
  const handleGenerateInvoice = async () => {
    // // check if any finalfee is <authorised fee and remove the object from formdata
    // const filteredRows = selectedRows.filter(
    //   (row) => row.serviceFinalFee >= row.serviceAuthorisedFee
    // );
    // if (selectedRows.length !== filteredRows.length) {
    //   alert("Some enrolments were not processed because their final fee is not authorised.");
    // }
    try {
      const response = await addNewInvoice({
        formData: selectedRows,
        operator: userId,
      });
      if (response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      } else if (response?.data?.message) {
        // Success response
        triggerBanner(response?.data?.message, "success");
      } else if (response?.error?.data?.message) {
        // Error response
        triggerBanner(response?.error?.data?.message, "error");
      } else if (isAddError) {
        // In case of unexpected response format
        triggerBanner(addError?.data?.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner(error?.data?.message, "error");
    }
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
    //       name: "Enrolment ID",
    //       selector: (row) => (
    //         <Link to={`/enrolments/enrolments/enrolmentDetails/${row.id}`}>
    //           {row.id}
    //         </Link>
    //       ),
    //       sortable: true,
    //       width: "200px",
    //     }
    //   : null,

    {
      name: " Active",
      selector: (row) => row.student.studentIsActive,
      cell: (row) => (
        <span>
          {row.student.studentIsActive ? (
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
      name: "Sex",
      selector: (row) => row?.student?.studentSex, //changed from userSex
      cell: (row) => (
        <span>
          {row?.student?.studentSex == "Female" ? (
            <LiaFemaleSolid className="text-red-600 text-2xl" />
          ) : (
            <LiaMaleSolid className="text-sky-700 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      removableRows: true,
      width: "80px",
    },
    {
      name: "Student Name",
      selector: (row) =>
        row.student.studentName.firstName +
        " " +
        row.student.studentName?.middleName +
        " " +
        row.student.studentName?.lastName,
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "200px",
    },
    {
      name: "Admission Service",
      selector: (row) =>
        `${row.admission.agreedServices?.feePeriod || ""} ${
          row.service?.serviceType || ""
        }`,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      sortable: true,
      width: "180px",
    },
    {
      name: "Amount",
      selector: (row) => (
        <span
          style={{
            color:
              row?.serviceFinalFee < row?.serviceAuthorisedFee //means final fee edited
                ? "red"
                : "black",
          }}
        >
          {row?.serviceFinalFee}
        </span>
      ),
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      sortable: true,
      width: "100px",
    },
    {
      name: "Authorised", //means authorised
      selector: (row) => (
        <span
          style={{
            color:
              row?.serviceFinalFee < row?.serviceAuthorisedFee //means final fee edited
                ? "red"
                : "black",
          }}
        >
          {`${row?.serviceAuthorisedFee} / ${
            row?.admission?.agreedServices?.isAuthorised ? "Yes" : "No"
          }`}{" "}
        </span>
      ),

      sortable: true,
      width: "120px",
    },
    {
      name: "Comment", //means authorised
      selector: (row) => row?.enrolmentNote,

      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {row?.enrolmentNote}
        </div>
      ),
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "150px",
    },
    // {
    //   name: "Authorised", //means authorised
    //   selector: (row) =>
    //     row.admission.agreedServices?.isAuthorised ? "yes" : "No",

    //   sortable: true,
    //   width: "140px",
    // },

    {
      name: "Fee Dates",
      selector: (row) => (
        <>
          <div>
            fr{" "}
            {new Date(
              row.admission.agreedServices?.feeStartDate
            ).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
          <div>
            {row.admission.agreedServices?.feeEndDate
              ? new Date(
                  row.admission.agreedServices.feeEndDate
                ).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "to Present"}
          </div>
        </>
      ),
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      sortable: true,
      width: "130px",
    },

    {
      name: "Month",
      selector: (row) =>
        `${row.enrolmentDuration || ""} ${row.enrolmentMonth || ""}`,
      sortable: true,
      width: "100px",
    },

    // {
    //   name: "Enrolment Dates",
    //   selector: (row) => (
    //     <>
    //       <div>
    //         from{" "}
    //         {new Date(row.enrolmentStartDate).toLocaleDateString("en-GB", {
    //           year: "numeric",
    //           month: "2-digit",
    //           day: "2-digit",
    //         })}
    //       </div>
    //       <div>
    //         to{" "}
    //         {new Date(row.enrolmentEndDate).toLocaleDateString("en-GB", {
    //           year: "numeric",
    //           month: "2-digit",
    //           day: "2-digit",
    //         })}
    //       </div>
    //     </>
    //   ),
    //   sortable: true,
    //   width: "160px",
    // },
    {
      name: "Invoiced",
      selector: (row) => (
        <>
          <div>
            {row?.enrolmentInvoice?.invoiceIssueDate
              ? `on ${new Date(
                  row.enrolmentInvoice.invoiceIssueDate
                ).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}`
              : "No"}
          </div>
          <div>
            {" "}
            {row?.enrolmentInvoice?.invoiceIssueDate
              ? `for ${row?.enrolmentInvoice?.invoiceAmount} $ /${row?.enrolmentInvoice?.invoiceAuthorisedAmount} `
              : ""}
          </div>
        </>
      ),
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      sortable: true,
      width: "130px",
    },
    {
      name: "Paid",
      selector: (row) => (
        <>
          <div>
            {" "}
            {row?.enrolmentInvoice?.invoicePayment
              ? `${row?.enrolmentInvoice?.invoicePayment?.paymentAmount} `
              : ""}
          </div>
          <div>
            {row?.enrolmentInvoice?.invoicePayment
              ? `on ${new Date(
                  row.enrolmentInvoice.invoicePayment?.paymentDate
                ).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}`
              : "No"}
          </div>
        </>
      ),
      style: {
        justifyContent: "left",
        textAlign: "left",
      },

      sortable: true,
      width: "130px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {/* <button
            className="text-green-500"
            fontSize={20}
            onClick={() => handleAddServiceToEnrolment(row.agreedServices)}
          >
            <IoMdAddCircleOutline className="text-2xl" />
          </button> */}
          <button
            aria-label="enrolment Details"
            className="text-sky-700"
            fontSize={20}
            onClick={() =>
              navigate(`/students/enrolments/enrolmentDetails/${row.id}`)
            }
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
              aria-label="edit enrolment"
              className="text-amber-300"
              onClick={() =>
                navigate(`/students/enrolments/editEnrolment/${row.id}`)
              }
              hidden={row?.enrolmentInvoice?.invoiceAmount} //no editing for already invoiced enrolments
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              aria-label="delete enrolment"
              className="text-red-600"
              onClick={() => onDeleteEnrolmentClicked(row.id)}
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
      Enrolments List:
      <span> {filteredEnrolments.length} enrolments</span>
    </h2>
  );

  let content;
  if (isEnrolmentsLoading || isServicesLoading)
    content = (
      <>
        <Students />
        <LoadingStateIcon />
      </>
    );
  if (isServicesSuccess)
    content = (
      <>
        <Students />
        <div className="flex space-x-2 items-center ml-3">
          {/* Search Bar */}
          <div className="relative h-10 mr-2 ">
            <HiOutlineSearch
              fontSize={20}
              className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
              aria-label="search enrolments"
            />
            <input
              aria-label="search enrolments"
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
          {/* Enrolment Month Filter */}
          <label htmlFor="monthFilter" className="formInputLabel">
            <select
              aria-label="monthFilter"
              id="monthFilter"
              value={selectedEnrolmentMonth}
              onChange={(e) => setSelectedEnrolmentMonth(e.target.value)}
              className="text-sm h-8 border border-gray-300  px-4"
            >
              {/* Default option is the current month */}
              <option value={getCurrentMonth()}>{getCurrentMonth()}</option>
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
          {/* Service Type Filter */}
          <label htmlFor="serviceTypeFilter" className="formInputLabel">
            <select
              aria-label="serviceTypeFilter"
              id="serviceTypeFilter"
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              className="text-sm h-8 border border-gray-300  px-4"
            >
              <option value="">All Services</option>
              {servicesList.map((service, index) => (
                <option key={index} value={service.serviceType}>
                  {service.serviceType}
                </option>
              ))}
            </select>
          </label>

          {/* Invoiced Filter */}
          <label htmlFor="invoicedFilter" className="formInputLabel">
            <select
              aria-label="invoicedFilter"
              id="invoicedFilter"
              value={invoicedFilter}
              onChange={(e) => setInvoicedFilter(e.target.value)}
              className="text-sm h-8 border border-gray-300  px-4"
            >
              <option value="">All invoicing</option>
              <option value="invoiced">Invoiced</option>
              <option value="notInvoiced">Not Invoiced</option>
            </select>
          </label>

          {/* Paid Filter */}
          <label htmlFor="paidFilter" className="formInputLabel">
            <select
              aria-label="paidFilter"
              id="paidFilter"
              value={paidFilter}
              onChange={(e) => setPaidFilter(e.target.value)}
              className="text-sm h-8 border border-gray-300  px-4"
            >
              <option value="">All payment</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </label>
        </div>
        <div className="dataTableContainer">
          <div>
            <DataTable
              title={tableHeader}
              columns={column}
              data={filteredEnrolments}
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

          <div className="cancelSavebuttonsDiv">
            <button
              className="add-button"
              onClick={() => navigate("/students/enrolments/newEnrolment/")}
              hidden={!canCreate}
            >
              New Enrolment
            </button>
            <button
              className={`px-4 py-2 ${
                selectedRows?.length > 0 ? "add-button" : "bg-gray-300"
              } text-white rounded`}
              onClick={handleGenerateInvoice}
              hidden={!canCreate}
              disabled={selectedRows?.length > 20 || selectedRows?.length < 1}
            >
              Generate {selectedRows?.length} Invoices
            </button>
          </div>
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
export default EnrolmentsList;
