import {
  useUpdateAdmissionMutation,
  useGetAdmissionsByYearQuery,
  useDeleteAdmissionMutation,
} from "./admissionsApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import Students from "../Students";
import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import { IoFlagSharp } from "react-icons/io5";
import {  useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import useAuth from "../../../hooks/useAuth";
import { setAdmissions } from "./admissionsSlice";
import { useOutletContext, useNavigate } from "react-router-dom";
import { MONTHS } from "../../../config/Months";
// import { CurrencySymbol } from "../../../config/Constants";
const AdmissionsList = () => {
  //this is for the academic year selection
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userId, canEdit, isAdmin, isManager, canDelete, canCreate, status2 } =
    useAuth();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idAdmissionToDelete, setIdAdmissionToDelete] = useState(null); // State to track which document to delete

  //console.log("Fetch admissions for academic year:", selectedAcademicYear);
  const {
    data: admissions, //the data is renamed admissions
    isLoading: isAdmissionsLoading,
    isSuccess: isAdmissionsSuccess,
    isError: isAdmissionsError,
    error: admissionsError,
  } = useGetAdmissionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "admissionsList",
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
      endpointName: "admissionsList",
    } || {},
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  //initialising the delete Mutation
  const [
    deleteAdmission,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteAdmissionMutation();
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  // Function to handle the delete button click
  const onDeleteAdmissionClicked = (id) => {
    setIdAdmissionToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteAdmission({ id: idAdmissionToDelete });
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
        triggerBanner(delerror?.data?.message, "error");
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
    setIdAdmissionToDelete(null);
  };
  const servicesList = isServicesSuccess
    ? Object.values(services.entities)
    : [];
  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredAdmissions, setFilteredAdmissions] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  let admissionsList = [];
  let filteredAdmissions = [];
  const [monthFilter, setMonthFilter] = useState(""); // Filter for fee month
  const [serviceTypeFilter, setServiceTypeFilter] = useState(""); // Filter for service type
  const [isFlaggedFilter, setIsFlaggedFilter] = useState(false); // State to manage the flagged filter
  const [isAuthorisedFilter, setIsAuthorisedFilter] = useState(false); // Authorised filter state
  if (isAdmissionsSuccess) {
    //set to the state to be used for other component s and edit admission component

    const { entities } = admissions;

    //we need to change into array to be read??
    admissionsList = Object.values(entities); //we are using entity adapter in this query
    dispatch(setAdmissions(admissionsList)); //timing issue to update the state and use it the same time

    // Apply filters for search, month, and service type with both conditions required
    filteredAdmissions = admissionsList.filter((item) => {
      const nameMatches = [
        item?.student?.studentName?.firstName,
        item?.student?.studentName?.middleName,
        item?.student?.studentName?.lastName,
      ].some((name) => name?.toLowerCase().includes(searchQuery.toLowerCase()));

      const otherMatches = Object.values(item)
        .flat()
        .some((val) =>
          val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );

      const bothFiltersMatch = item.agreedServices.some(
        (service) =>
          (!monthFilter || service.feeMonths?.includes(monthFilter)) &&
          (!serviceTypeFilter ||
            service.service?.serviceType === serviceTypeFilter)
      );

      const isFlaggedMatch =
        isFlaggedFilter ||
        (isFlaggedFilter === "flagged"
          ? item.agreedServices.some((service) => service.isFlagged === true)
          : isFlaggedFilter === "notflagged"
          ? item.agreedServices.every((service) => service.isFlagged !== true)
          : true);

      const isAuthorisedMatch =
        //!isAuthorisedFilter ||
        isAuthorisedFilter === "authorised"
          ? item.agreedServices.some((service) => service.isAuthorised === true)
          : isAuthorisedFilter === "notauthorised"
          ? item.agreedServices.some((service) => service.isAuthorised !== true)
          : true;

      // Both isFlaggedMatch and isAuthorisedMatch must be true for the admission to be included
      return (
        (nameMatches || otherMatches) &&
        bothFiltersMatch &&
        isFlaggedMatch &&
        isAuthorisedMatch
      );
    });
  }

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleMonthFilterChange = (e) => setMonthFilter(e.target.value);

  const handleServiceTypeFilterChange = (e) =>
    setServiceTypeFilter(e.target.value);
  // Handler for selecting rows
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
    //console.log('selectedRows', selectedRows)
  };

  const [
    updateAdmission,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateAdmissionMutation(); //it will not execute the mutation nownow but when called
  const [admissionObject, setAdmissionObject] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  //console.log(academicYears)
  // Handler for registering selected row,
  const [admissionYears, setAdmissionYears] = useState([]);

  const handleUpdateAdmission = (admission, index, agreedService) => {
    //console.log(admission, "admissionnnnnnnnnnn");

    // Create a new admission object to avoid mutating the original
    const updatedAdmission = {
      ...admission,
      admissionId: admission.id,
      admissionOperator: userId,
      student: admission.student._id,
      agreedServices: admission.agreedServices.map(
        (service, idx) =>
          // Update only the agreedService at the specific index
          idx === index
            ? {
                ...service, // Copy existing service properties
                isAuthorised: true, // Set isAuthorised to true
                authorisedBy: userId, // Set authorisedBy to userId
              }
            : service // Keep other services unchanged
      ),
    };

    // Call the update mutation with the new admission object
    updateAdmission(updatedAdmission)
      .unwrap() // Handle the promise returned by the mutation
      .then(() => {
        // Optionally show a success message or perform other actions
        console.log("Admission updated successfully");
      })
      .catch((error) => {
        // Handle errors if the update fails
        console.error("Failed to update admission:", error);
      });
    if (isUpdateError) {
      // In case of unexpected response format
      triggerBanner(updateError?.data?.message, "error");
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
    //       name: "ID",
    //       selector: (row) => (
    //         <Link
    //           to={`/admissions/admissionsParents/admissionDetails/${row.id}`}
    //         >
    //           {row.id}
    //         </Link>
    //       ),
    //       sortable: true,
    //       width: "200px",
    //     }
    //   : null,

    {
      name: "Student Name",
      selector: (row) =>
        row?.student?.studentName.firstName +
        " " +
        row?.student?.studentName?.middleName +
        " " +
        row?.student?.studentName?.lastName,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      sortable: true,
      width: "190px",
    },

    {
      name: "Date",
      selector: (row) =>
        new Date(row?.admissionDate).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),

      sortable: true,
      width: "110px",
    },

    {
      name: "Services",

      selector: (row) => (
        <div>
          {row?.agreedServices.map((feeObj, index) => (
            <div key={index}>
              {" "}
              {feeObj?.feePeriod} {feeObj?.service?.serviceType}{" "}
            </div>
          ))}
        </div>
      ),
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      sortable: true,
      removableRows: true,
      width: "180px",
    },
    {
      name: "Anchor",

      selector: (row) => (
        <div>
          {row?.agreedServices.map((feeObj, index) => (
            <div key={index}>
              {feeObj?.service?.serviceAnchor[feeObj.feePeriod]}
            </div>
          ))}
        </div>
      ),
      sortable: true,
      removableRows: true,
      width: "100px",
    },
    // {
    //   name: "Agreed Fees",

    //   selector: (row) => (
    //     <div>
    //       {row.agreedServices.map((feeObj, index) => (
    //         <div key={index}>{feeObj?.feeValue} </div>
    //       ))}
    //     </div>
    //   ),
    //   sortable: true,
    //   removableRows: true,
    //   width: "120px",
    // },
    {
      name: "Agreed",
      selector: (row) => (
        <div>
          {row?.agreedServices.map((feeObj, index) => {
            const anchorValue =
              feeObj?.service?.serviceAnchor[feeObj.feePeriod];
            const feeValue = feeObj?.feeValue;

            // Determine the text color based on the comparison
            let textColorClass = "text-red-600"; // Default is black
            if (feeObj.isAuthorised || feeValue >= anchorValue) {
              textColorClass = "text-green-800"; // Green if greater than anchor
            }

            return (
              <div key={index} className={textColorClass}>
                {feeValue}
              </div>
            );
          })}
        </div>
      ),
      sortable: true,
      removableRows: true,
      width: "100px",
    },
    {
      name: "Flagged",
      selector: (row) => (
        <div>
          {row?.agreedServices.map((feeObj, index) => (
            <div key={index}>{feeObj?.isFlagged ? "Yes" : "No"}</div>
          ))}
        </div>
      ),
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      sortable: true,
      width: "100px",
    },
    {
      name: "Authorised",
      selector: (row) => (
        <div>
          {row?.agreedServices.map((feeObj, index) => (
            <div key={index}>{feeObj?.isAuthorised ? "Yes" : "No"}</div>
          ))}
        </div>
      ),
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      sortable: true,
      width: "120px",
    },
    isManager && {
      name: "Authorise",
      selector: (row) => (
        <div>
          {row?.agreedServices.map((feeObj, index) => (
            <div key={index}>
              <button
                aria-label={`authorise-service${index}`}
                key={index}
                className={`${
                  feeObj?.isAuthorised ? "text-green-200" : "text-red-600"
                }`}
                fontSize={20}
                onClick={() => handleUpdateAdmission(row, index, feeObj)} // Open the modal with the selected admission
                disabled={feeObj?.isAuthorised} // Disable if  authorised
              >
                {feeObj?.isAuthorised ? (
                  <IoFlagSharp className="text-1xl" />
                ) : (
                  <IoFlagSharp className="text-1xl" />
                )}
              </button>
            </div>
          ))}
        </div>
      ),

      // cell: (row) => (
      //   <div className="space-x-1">
      //     <button
      //       className={`${row?.agreedServices.every(service => service?.isAuthorised) ? 'text-gray-400' : 'text-red-600'}`}
      //       fontSize={20}
      //       onClick={() => handleUpdateAdmission(row)} // Open the modal with the selected admission
      //       disabled={row?.agreedServices.every(service => service?.isAuthorised)} // Disable if all services are authorised
      //     >
      //       <IoFlagOutline  className="text-2xl" />
      //     </button>
      //   </div>
      // ),
      ignoreRowClick: true,
      button: true,
      width: "90px",
    },
    // (isManager && {
    //   name: "Authorise Fees",

    //   cell: (row) => (
    //     <div className="space-x-1">
    //       <button
    //         className={`${row?.agreedServices.every(service => service?.isAuthorised) ? 'text-gray-400' : 'text-red-600'}`}
    //         fontSize={20}
    //         onClick={() => handleUpdateAdmission(row)} // Open the modal with the selected admission
    //         disabled={row?.agreedServices.every(service => service?.isAuthorised)} // Disable if all services are authorised
    //       >
    //         <IoFlagOutline  className="text-2xl" />
    //       </button>
    //     </div>
    //   ),
    //   ignoreRowClick: true,
    //   button: true,
    //   width: "120px",

    // }),

    {
      name: "Start",

      selector: (row) => (
        <div>
          {row?.agreedServices.map((feeObj, index) => (
            <div key={index}>
              {new Date(feeObj?.feeStartDate).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </div>
          ))}
        </div>
      ),

      sortable: true,
      width: "120px",
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

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {/* <button
            className="text-green-500"
            fontSize={20}
            onClick={() => handleAddServiceToAdmission(row.agreedServices)}
          >
            <IoMdAddCircleOutline className="text-2xl" />
          </button> */}
          <button
            aria-label="admission Details"
            className="text-sky-700"
            fontSize={20}
            onClick={() =>
              navigate(`/students/admissions/admissionDetails/${row.id}`)
            }
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
              aria-label="edit admission"
              className="text-amber-300"
              disabled={!isManager || !isAdmin}
              onClick={() =>
                navigate(`/students/admissions/editAdmission/${row.id}`)
              }
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              aria-label="delet admission"
              className="text-red-600"
              disabled={!isManager || !isAdmin}
              onClick={() => onDeleteAdmissionClicked(row.id)}
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
      Admissions List:
      <span> {filteredAdmissions.length} admissions</span>
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
  if (isAdmissionsSuccess && isServicesSuccess)
    content = (
      <>
        <Students />
        <div className="flex space-x-2 items-center ml-3">
          {/* Search Bar */}
          <div className="relative h-10 mr-2 ">
            <HiOutlineSearch
              fontSize={20}
              className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
              aria-label="search admissions"
            />
            <input
              aria-label="search admissions"
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
          {/* feeMonths Filter Dropdown */}
          {/* Month Filter Dropdown */}
          <label htmlFor="monthFilter" className="formInputLabel">
            <select
              aria-label="monthFilter"
              id="monthFilter"
              onChange={handleMonthFilterChange}
              value={monthFilter}
              className="text-sm h-8 border border-gray-300  px-4"
            >
              <option value="">All Months</option>
              {MONTHS.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </label>
          {/* Service Type filter dropdown */}
          <label htmlFor="serviceTypeFilter" className="formInputLabel">
            <select
              aria-label="serviceTypeFilter"
              id="serviceTypeFilter"
              onChange={handleServiceTypeFilterChange}
              value={serviceTypeFilter}
              className="text-sm h-8 border border-gray-300  px-4"
            >
              <option value="">All Services</option>
              {/* Assuming serviceList contains unique serviceType values */}
              {servicesList.map((service) => (
                <option key={service.id} value={service.serviceType}>
                  {service.serviceType}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="flaggedFilter" className="formInputLabel">
            <select
              aria-label="flaggedFilter"
              id="flaggedFilter"
              value={isFlaggedFilter}
              onChange={(e) => setIsFlaggedFilter(e.target.value)}
              className="text-sm h-8 border border-gray-300  px-4"
            >
              <option value="">Flag Status</option>
              <option value="flagged">Flagged</option>
              <option value="notflagged">Not Flagged</option>
            </select>
          </label>

          <label htmlFor="authorisedFilter" className="formInputLabel">
            <select
              aria-label="authorisedFilter"
              id="authorisedFilter"
              value={isAuthorisedFilter}
              onChange={(e) => setIsAuthorisedFilter(e.target.value)}
              className="text-sm h-8 border border-gray-300  px-4"
            >
              <option value="">Authorisation Status</option>
              <option value="authorised">Authorised</option>
              <option value="notauthorised">Not Authorised</option>
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
              // selectableRows
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

          {/* <div className="cancelSavebuttonsDiv"> */}
          <button
            className="add-button"
            onClick={() => navigate("/students/admissions/newAdmission/")}
            hidden={!canCreate}
          >
            New Admission
          </button>
          {/* </div> */}
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
export default AdmissionsList;
