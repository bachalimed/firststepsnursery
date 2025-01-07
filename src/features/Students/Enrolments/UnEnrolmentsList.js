import { HiOutlineSearch } from "react-icons/hi";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import Students from "../Students";
import DataTable from "react-data-table-component";
import { IoShieldCheckmarkOutline, IoShieldOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import {  useState,useEffect } from "react";
import { useGetAdmissionsByYearQuery } from "../Admissions/admissionsApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { MONTHS } from "../../../config/Months";

const UnEnrolmentsList = () => {
  useEffect(() => {
    document.title = "Unenrolment List";
  });
  //this is for the academic year selection
  const navigate = useNavigate();
  const { canCreate } = useAuth();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  // const academicYears = useSelector(selectAllAcademicYears);

  //function to return curent month for month selection
  const getCurrentMonth = () => {
    const currentMonthIndex = new Date().getMonth(); // Get current month (0-11)
    return MONTHS[currentMonthIndex]; // Return the month name with the first letter capitalized
  };

  //console.log("Fetch enrolments for academic year:", selectedAcademicYear);
  const {
    data: admissions, //the data is renamed admissions
    isLoading: isAdmissionsLoading,
    isSuccess: isAdmissionsSuccess,
  } = useGetAdmissionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "noEnrolments",
      endpointName: "UnenrolmentsList",
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
  } = useGetServicesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "UnenrolmentsList",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  // State to hold selected rows
  // const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredEnrolments, setFilteredEnrolments] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  let admissionsList = [];
  let filteredAdmissions = [];

  const [selectedServiceType, setSelectedServiceType] = useState(""); // service type from servicesList
  const [selectedFeeMonth, setSelectedFeeMonth] = useState(getCurrentMonth()); // enrolment month
  const servicesList = isServicesSuccess
    ? Object.values(services.entities)
    : [];
  if (isAdmissionsSuccess) {
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
  // // Handler for selecting rows
  // const handleRowSelected = (state) => {
  //   setSelectedRows(state.selectedRows);
  //   //console.log('selectedRows', selectedRows)
  // };

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },
    //show this column only if user is a parent and not employee

    // isAdmin && {
    //   name: "student ID",
    //   selector: (row) => row?.student?._id,

    //   sortable: true,
    //   width: "200px",
    // },
    {
      name: " Active",
      selector: (row) => row?.student?.studentIsActive,
      cell: (row) => (
        <span>
          {row?.student?.studentIsActive ? (
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
      name: "Student Name",
      selector: (row) =>
        row?.student?.studentName?.firstName +
        " " +
        row?.student?.studentName?.middleName +
        " " +
        row?.student?.studentName?.lastName,
      sortable: true,
      width: "180px",
    },
    {
      name: "Service",
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
      name: "Months",
      selector: (row) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {row?.agreedServices.map((feeObj, index) => (
            <div key={index}>
              {feeObj?.feeMonths?.length > 0
                ? `${feeObj.feeMonths.length} - ${feeObj.feeMonths.join(", ")}`
                : "---"}
              {index < row.agreedServices.length - 1 && (
                <hr className="my-2 border-gray-300" />
              )}
            </div>
          ))}
        </div>
      ),
      cell: (row) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          {row?.agreedServices.map((feeObj, index) => (
            <div key={index}>
              {feeObj?.feeMonths?.length > 0
                ? `${feeObj.feeMonths.length} - ${feeObj.feeMonths.join(", ")}`
                : "---"}
              {index < row.agreedServices.length - 1 && (
                <hr className="my-2 border-gray-300" />
              )}
            </div>
          ))}
        </div>
      ),
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      sortable: true,
      width: "230px",
    },

    // {
    //   name: "Authorised", //means authorised
    //   selector: (row) =>
    //     row.admission.agreedServices?.isAuthorised ? "yes" : "No",

    //   sortable: true,
    //   width: "140px",
    // },

    // {
    //   name: "Actions",
    //   cell: (row) => (
    //     <div className="space-x-1">
    //       {/* <button
    //         className="text-green-500"
    //         fontSize={20}
    //         onClick={() => handleAddServiceToEnrolment(row.agreedServices)}
    //       >
    //         <IoMdAddCircleOutline className="text-2xl" />
    //       </button> */}

    //       {canCreate ? (
    //         <button
    //           aria-label="new Enrolment"
    //           className="text-green-500"
    //           onClick={() => navigate("/students/enrolments/newEnrolment/")}
    //         >
    //           <IoAddCircleOutline className="text-2xl" />
    //         </button>
    //       ) : null}
    //     </div>
    //   ),
    //   ignoreRowClick: true,
    //   button: true,
    //   width: "120px",
    // },
  ].filter(Boolean); // Filter out falsy values like `false` or `undefined`

  // Custom header to include the row count
  const tableHeader = (
    <h2>
      Unenrolled students List:
      <span> {filteredAdmissions?.length} students</span>
    </h2>
  );

  let content;
  if (isAdmissionsLoading || isServicesLoading)
    content = (
      <>
        <Students />
        <LoadingStateIcon />
      </>
    );
  // if (isAdmissionsSuccess && isServicesSuccess)
    content = (
      <>
        <Students />
        <div className="flex space-x-2 items-center ml-3">
          {/* Search Bar */}
          <div className="relative h-10 mr-2 ">
            <HiOutlineSearch
              fontSize={20}
              className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
              aria-label="search unenrolements"
            />
            <input
              aria-label="search unenrolements"
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
          {/* Enrolment Month Filter */}
          <label htmlFor="monthFilter" className="formInputLabel">
            <select
              aria-label="monthFilter"
              id="monthFilter"
              value={selectedFeeMonth}
              onChange={(e) => setSelectedFeeMonth(e.target.value)}
              className="text-sm h-8 border border-gray-300  px-4"
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
        </div>
        <div className="dataTableContainer">
          <div>
            <DataTable
              title={tableHeader}
              columns={column}
              data={filteredAdmissions}
              pagination
              //selectableRows
              removableRows
              pageSizeControl
              //onSelectedRowsChange={handleRowSelected}
              // selectableRowsHighlight
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

          <button
            className="add-button"
            onClick={() => navigate("/students/enrolments/newEnrolment/")}
            hidden={!canCreate}
          >
            New Enrolment
          </button>
        </div>
      </>
    );

  return content;
};
export default UnEnrolmentsList;
