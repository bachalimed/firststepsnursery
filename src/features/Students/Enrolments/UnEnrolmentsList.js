
import { HiOutlineSearch } from "react-icons/hi";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import Students from "../Students";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";

import { IoShieldCheckmarkOutline, IoShieldOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
import { IoAddCircleOutline } from "react-icons/io5";

import {

  useGetAdmissionsByYearQuery,
  useDeleteAdmissionMutation,
} from "../Admissions/admissionsApiSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


import useAuth from "../../../hooks/useAuth";


const UnenrolmentsList = () => {
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
  const [idEnrolmentToDelete, setIdEnrolmentToDelete] = useState(null); // State to track which document to delete
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];


   //function to return curent month for month selection
   const getCurrentMonth = () => {
    const currentMonthIndex = new Date().getMonth(); // Get current month (0-11)
    return MONTHS[currentMonthIndex]; // Return the month name with the first letter capitalized
  };
  

  //console.log("Fetch enrolments for academic year:", selectedAcademicYear);
  const {
    data: admissions, //the data is renamed admissions
    isLoading: isAdmissionLoading, //monitor several situations is loading...
    isSuccess: isAdmissionSuccess,
    isError: isAdmissionError,
    error: admissionError,
  } = useGetAdmissionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "noEnrolments",
      endpointName: "UnenrolmentsList",
    } || {},
    {
      //this param will be passed in req.params to select only admissions for taht year
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
      endpointName: "UnenrolmentsList",
    } || {},
    {
      //this param will be passed in req.params to select only services for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredEnrolments, setFilteredEnrolments] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  let admissionsList = [];
  let filteredAdmissions = [];

  const [billedFilter, setBilledFilter] = useState(""); // "billed" or "unbilled"
  const [invoicedFilter, setInvoicedFilter] = useState(""); // "invoiced" or "notInvoiced"
  const [paidFilter, setPaidFilter] = useState(""); // "paid" or "unpaid"
  const [selectedServiceType, setSelectedServiceType] = useState(""); // service type from servicesList
  const [selectedFeeMonth, setSelectedFeeMonth] = useState(getCurrentMonth()); // enrolment month
  const servicesList = isServicesSuccess
    ? Object.values(services.entities)
    : [];
  if (isAdmissionSuccess) {
    //set to the state to be used for other component s and edit enrolment component
    const { entities } = admissions;
    //we need to change into array to be read??
    admissionsList = Object.values(entities); //we are using entity adapter in this query
    //dispatch(setAdmissions(admissionsList)); //timing issue to update the state and use it the same time

    filteredAdmissions = admissionsList.filter((enrol) => {
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

      // Filter by agreedServices.service.serviceType against servicesList.serviceType
      const meetsServiceTypeCriteria =
        !selectedServiceType ||
        enrol.agreedServices?.some(
          (agreedService) =>
            agreedService?.service?.serviceType === selectedServiceType
        );

      // Filter by agreedServices.feeMonths against ["January", "February", ...]
      const meetsFeeMonthCriteria =
        !selectedFeeMonth ||
        enrol.agreedServices?.some((agreedService) =>
          agreedService?.feeMonths?.includes(selectedFeeMonth)
        );

      return (
        (nameMatches || otherMatches) &&
        meetsServiceTypeCriteria &&
        meetsFeeMonthCriteria
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
          name: "student ID",
          selector: (row) => row?.student?._id,

          sortable: true,
          width: "200px",
        }
      : null,

    {
      name: " Active Student",
      selector: (row) => row?.student?.studentIsActive,
      cell: (row) => (
        <span>
          {row?.student?.studentIsActive ? (
            <IoShieldCheckmarkOutline className="text-green-500 text-2xl" />
          ) : (
            <IoShieldOutline className="text-yellow-400 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      width: "100px",
    },

    {
      name: "Student Name",
      selector: (row) =>
        row?.student?.studentName?.firstName +
        " " +
        row?.student?.studentName?.middleName +
        " " +
        row?.student?.studentName?.lastName,
      sortable: true,
      width: "160px",
    },
    {
      name: "Admission Service",
      selector: (row) => (
        <div>
          {row?.agreedServices.map((feeObj, index) => (
            <div key={index}>{feeObj?.service?.serviceType}</div>
          ))}
        </div>
      ),

      sortable: true,
      width: "150px",
    },
    {
      name: "Admission Month",
      selector: (row) => (
        <div>
          {row?.agreedServices.map((feeObj, index) => (
            <div key={index}>{feeObj?.feeMonths}</div>
          ))}
        </div>
      ),
      sortable: true,
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

          {canCreate ? (
            <button
              className="text-yellow-400"
              onClick={() => navigate("/students/enrolments/newEnrolment/")}
            >
              <IoAddCircleOutline className="text-2xl" />
            </button>
          ) : null}
        </div>
      ),
      ignoreRowClick: true,

      button: true,
      width: "120px",
    },
  ];
  let content;
  if (isAdmissionLoading)
    content = (
      <>
        <Students />
        <LoadingStateIcon />
      </>
    );
  if (isAdmissionError) {
    content = (
      <>
        <Students />
        <p className="errmsg">{admissionError?.data?.message}</p>
      </>
    ); //errormessage class defined in the css, the error has data and inside we have message of error
  }
  //if (isenrolmentGetSuccess){

  content = (
    <>
      <Students />
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
        {/* Enrolment Month Filter */}
        <select
          value={selectedFeeMonth}
          onChange={(e) => setSelectedFeeMonth(e.target.value)}
          className="text-sm h-8 border border-gray-300 rounded-md px-4"
        >
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
        {/* Service Type Filter */}
        <select
          value={selectedServiceType}
          onChange={(e) => setSelectedServiceType(e.target.value)}
          className="text-sm h-8 border border-gray-300 rounded-md px-4"
        >
          <option value="">All Services</option>
          {servicesList.map((service, index) => (
            <option key={index} value={service.serviceType}>
              {service.serviceType}
            </option>
          ))}
        </select>
      </div>
      <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
        <DataTable
          columns={column}
          data={filteredAdmissions}
          pagination
          selectableRows
          removableRows
          pageSizeControl
          onSelectedRowsChange={handleRowSelected}
          selectableRowsHighlight
        ></DataTable>
        <div className="flex justify-end items-center space-x-4">
          <button
            className=" px-4 py-2 bg-green-500 text-white rounded"
            disabled={selectedRows.length !== 1} // Disable if no rows are selected
            hidden={!canCreate}
          >
            tobechanged
          </button>

          <button
            className="px-3 py-2 bg-yellow-400 text-white rounded"
            onClick={handleDuplicateSelected}
            disabled={selectedRows.length !== 1} // Disable if no rows are selected
            hidden={!canCreate}
          >
            Re-hhh
          </button>

          {isAdmin && (
            <button
              className="px-3 py-2 bg-gray-400 text-white rounded"
              onClick={handleDuplicateSelected}
              disabled={selectedRows.length !== 1} // Disable if no rows are selected
              hidden={!canCreate}
            >
              All
            </button>
          )}
        </div>
      </div>
    </>
  );
  //}
  return content;
};
export default UnenrolmentsList;
