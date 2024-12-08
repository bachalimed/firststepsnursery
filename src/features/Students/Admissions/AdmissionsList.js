import {
  useGetAdmissionsQuery,
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
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { IoFlagSharp, IoFlagOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import useAuth from "../../../hooks/useAuth";
import { setAdmissions } from "./admissionsSlice";
import { useOutletContext } from "react-router-dom";


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
    isLoading: isAdmissionLoading, 
    isSuccess: isAdmissionSuccess,
    isError: isAdmissionError,
    error: admissionError,
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
      const response= await deleteAdmission({ id: idAdmissionToDelete });
    setIsDeleteModalOpen(false); // Close the modal
    if (response.data && response.data.message) {
      // Success response
      triggerBanner(response.data.message, "success");

    } else if (response?.error && response?.error?.data && response?.error?.data?.message) {
      // Error response
      triggerBanner(response.error.data.message, "error");
    } else {
      // In case of unexpected response format
      triggerBanner("Unexpected response from server.", "error");
    }
  } catch (error) {
    triggerBanner("Failed to delete admission. Please try again.", "error");

    console.error("Error deleting:", error);
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
  if (isAdmissionSuccess) {
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

  // Handler for duplicating selected rows,
  const handleDuplicateSelected = () => {
    //console.log('Selected Rows to duplicate:', selectedRows);
    // Add  delete logic here (e.g., dispatching a Redux action or calling an API)
    //ensure only one can be selected: the last one
    const toDuplicate = selectedRows[-1];

    setSelectedRows([]); // Clear selection after delete
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
  const handleRegisterSelected = () => {
    //we already allowed only one to be selected in the button options
    //console.log('Selected Rows to detail:', selectedRows)

    setAdmissionObject(selectedRows[0]);
    //console.log(admissionObject, "admissionObject");
    //const {admissionYears}= (admissionObject)

    setAdmissionYears(admissionObject.admissionYears);
    //console.log("admission years and id", admissionYears);
    setIsRegisterModalOpen(true);

    //setSelectedRows([]); // Clear selection after process
  };

  const handleUpdateAdmission = (admission, index, agreedService) => {
    console.log(admission, "admissionnnnnnnnnnn");

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
          name: "ID",
          selector: (row) => (
            <Link
              to={`/admissions/admissionsParents/admissionDetails/${row.id}`}
            >
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
        row?.student?.studentName.firstName +
        " " +
        row?.student?.studentName?.middleName +
        " " +
        row?.student?.studentName?.lastName,
      sortable: true,
      width: "180px",
    },

    {
      name: "Admission Date",
      selector: (row) =>
        new Date(row?.admissionDate).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),

      sortable: true,
      width: "140px",
    },

    {
      name: "Admission & Services",

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
      width: "90px",
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
      name: "Agreed Fees",
      selector: (row) => (
        <div>
          {row?.agreedServices.map((feeObj, index) => {
            const anchorValue =
              feeObj?.service?.serviceAnchor[feeObj.feePeriod];
            const feeValue = feeObj?.feeValue;

            // Determine the text color based on the comparison
            let textColorClass = "text-red-500"; // Default is black
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
      width: "120px",
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

      sortable: true,
      width: "90px",
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

      sortable: true,
      width: "110px",
    },
    isManager && {
      name: "Authorise Fees",
      selector: (row) => (
        <div>
          {row?.agreedServices.map((feeObj, index) => (
            <div key={index}>
              <button
                key={index}
                className={`${
                  feeObj?.isAuthorised ? "text-green-200" : "text-red-500"
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
      //       className={`${row?.agreedServices.every(service => service?.isAuthorised) ? 'text-gray-400' : 'text-red-500'}`}
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
      width: "120px",
    },
    // (isManager && {
    //   name: "Authorise Fees",

    //   cell: (row) => (
    //     <div className="space-x-1">
    //       <button
    //         className={`${row?.agreedServices.every(service => service?.isAuthorised) ? 'text-gray-400' : 'text-red-500'}`}
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
      name: "Fee start",

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
      name: "Fee Months",

      selector: (row) => (
        <div>
          {row?.agreedServices.map((feeObj, index) =>
            feeObj?.feeMonths ? <div>{feeObj?.feeMonths} </div> : <div>---</div>
          )}
        </div>
      ),

      sortable: true,
      width: "120px",
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
            className="text-blue-500"
            fontSize={20}
            onClick={() =>
              navigate(`/students/admissions/admissionDetails/${row.id}`)
            }
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() =>
                navigate(`/students/admissions/editAdmission/${row.id}`)
              }
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              className="text-red-500"
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
  ];


   // Custom header to include the row count
   const tableHeader = (
    <div>
      <h2>Admissions List: 
      <span> {filteredAdmissions.length} admissions</span></h2>
    </div>
  );
  
  
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
      <p className="errmsg">
        <Students /> {admissionError?.data?.message}
      </p>
    ); //errormessage class defined in the css, the error has data and inside we have message of error
  }
  if (isAdmissionSuccess) {
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
          {/* feeMonths Filter Dropdown */}
          {/* Month Filter Dropdown */}
          <select
            onChange={handleMonthFilterChange}
            value={monthFilter}
            className="text-sm h-8 border border-gray-300 rounded-md px-4"
          >
            <option value="">All Months</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
          </select>
          {/* Service Type filter dropdown */}
          <select
            onChange={handleServiceTypeFilterChange}
            value={serviceTypeFilter}
            className="text-sm h-8 border border-gray-300 rounded-md px-4"
          >
            <option value="">All Services</option>
            {/* Assuming serviceList contains unique serviceType values */}
            {servicesList.map((service) => (
              <option key={service.id} value={service.serviceType}>
                {service.serviceType}
              </option>
            ))}
          </select>

          <select
            value={isFlaggedFilter}
            onChange={(e) => setIsFlaggedFilter(e.target.value)}
            className="text-sm h-8 border border-gray-300 rounded-md px-4"
          >
            <option value="">Flag Status</option>
            <option value="flagged">Flagged</option>
            <option value="notflagged">Not Flagged</option>
          </select>

          <select
            value={isAuthorisedFilter}
            onChange={(e) => setIsAuthorisedFilter(e.target.value)}
            className="text-sm h-8 border border-gray-300 rounded-md px-4"
          >
            <option value="">Authorisation Status</option>
            <option value="authorised">Authorised</option>
            <option value="notauthorised">Not Authorised</option>
          </select>
        </div>

        <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
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
            <button
              className="add-button"
              onClick={() => navigate("/students/admissions/newAdmission/")}
              hidden={!canCreate}
            >
              New Admission
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
  }
  return content;
};
export default AdmissionsList;
