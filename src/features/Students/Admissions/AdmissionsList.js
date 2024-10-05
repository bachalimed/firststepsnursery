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
import Admissions from "../Admissions";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { IoMdAddCircleOutline } from "react-icons/io";
import AddServiceToAdmissionModal from "./AddServiceToAdmissionModal";
import { useSelector } from "react-redux";
import {
  selectAllAdmissionsByYear,
  selectAllAdmissions,
} from "./admissionsApiSlice"; //use the memoized selector
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
import RegisterModal from "./AdmissionModal";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { setAcademicYears } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { IoAddCircleOutline } from "react-icons/io5";

import useAuth from "../../../hooks/useAuth";

import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import {
  setSomeAdmissions,
  setAdmissions,
  currentAdmissionsList,
} from "./admissionsSlice";
import { IoDocumentAttachOutline } from "react-icons/io5";

const AdmissionsList = () => {
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
  const [idAdmissionToDelete, setIdAdmissionToDelete] = useState(null); // State to track which document to delete

  //console.log("Fetch admissions for academic year:", selectedAcademicYear);
  const {
    data: admissions, //the data is renamed admissions
    isLoading, //monitor several situations is loading...
    isSuccess,
    isError,
    error,
  } = useGetAdmissionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "admissionsList",
    } || {},
    {
      //this param will be passed in req.params to select only admissions for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      pollingInterval: 60000, //will refetch data every 60seconds
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

  // Function to handle the delete button click
  const onDeleteAdmissionClicked = (id) => {
    setIdAdmissionToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deleteAdmission({ id: idAdmissionToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdAdmissionToDelete(null);
  };

  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredAdmissions, setFilteredAdmissions] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  let admissionsList = [];
  let filteredAdmissions = [];
  if (isSuccess) {
    //set to the state to be used for other component s and edit admission component

    const { entities } = admissions;

    //we need to change into array to be read??
    admissionsList = Object.values(entities); //we are using entity adapter in this query
    dispatch(setAdmissions(admissionsList)); //timing issue to update the state and use it the same time
    filteredAdmissions = admissionsList?.filter((item) => {
      // Check if the student's name or any other field contains the search query
      const nameMatches = [
        item?.student?.studentName?.firstName,
        item?.student?.studentName?.middleName,
        item?.student?.studentName?.lastName,
      ].some((name) => name?.toLowerCase().includes(searchQuery.toLowerCase()));
    
      // Add more criteria as needed, e.g., admissionDate, services, etc.
      const otherMatches = Object.values(item)
        .flat()
        .some((val) => val?.toString().toLowerCase().includes(searchQuery.toLowerCase()));
    
      return nameMatches || otherMatches;
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

  // const [agreedServices, setAgreedServices] = useState([]);
  // const handleAddServiceToAdmission = () => {
  //   setAgreedServices([...agreedServices, newService]);
  // };
  

  //   const [admissionYears, setAdmissionYears] = useState([])
  // //adds to the previous entries in arrays for gardien, schools...
  //       const onAdmissionYearsChanged = (e, selectedYear) => {
  //         if (e.target.checked) {
  //           // Add the selectedYear to admissionYears if it's checked
  //           setAdmissionYears([...admissionYears, selectedYear]);
  //         } else {
  //           // Remove the selectedYear from admissionYears if it's unchecked
  //           setAdmissionYears(admissionYears.filter(year => year !== selectedYear))
  //         }
  //       }

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
        row.student.studentName.firstName +
        " " +
        row.student.studentName?.middleName +
        " " +
        row.student.studentName?.lastName,
      sortable: true,
      width: "180px",
    },

    {
      name: "Admission Date",
      selector: (row) =>
        new Date(row.admissionDate).toLocaleDateString("en-GB", {
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
          {row.agreedServices.map((feeObj, index) => (
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
          {row.agreedServices.map((feeObj, index) => (
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
          {row.agreedServices.map((feeObj, index) => {
            const anchorValue =
              feeObj?.service?.serviceAnchor[feeObj.feePeriod];
            const feeValue = feeObj?.feeValue;

            // Determine the text color based on the comparison
            let textColorClass = "text-black"; // Default is black
            if (feeValue < anchorValue) {
              textColorClass = "text-red-500"; // Red if less than anchor
            } else if (feeValue > anchorValue) {
              textColorClass = "text-green-500"; // Green if greater than anchor
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
          {row.agreedServices.map((feeObj, index) => (
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
          {row.agreedServices.map((feeObj, index) => (
            <div key={index}>{feeObj?.authorisedBy ? "Yes" : "No"}</div>
          ))}
        </div>
      ),

      sortable: true,
      width: "120px",
    },
    {
      name: "Fee start",
      
      
      selector: (row) => (
        <div>
          {row.agreedServices.map((feeObj, index) => (
            <div key={index}>{new Date(feeObj?.feeStartDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }) }</div>
          ))}
        </div>
      ),

      sortable: true,
      width: "120px",
    },
    {
      name: "Fee start",
      
      
      selector: (row) => (
        <div>
          {row.agreedServices.map((feeObj, index) => (
           (feeObj?.feeEndDate)? <div key={index}>{new Date(feeObj?.feeEndDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }) }</div> : <div>---</div>
          ))}
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
  let content;
  if (isLoading) content = <LoadingStateIcon />;
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>; //errormessage class defined in the css, the error has data and inside we have message of error
  }
  //if (isSuccess){

  content = (
    <>
      <Admissions />

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
            onClick={handleRegisterSelected}
            disabled={selectedRows.length !== 1} // Disable if no rows are selected
            hidden={!canCreate}
          >
            Register
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
      <DeletionConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
      {/* <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        admissionYears={admissionYears}
        admissionObject={admissionObject}
        setAdmissionObject={setAdmissionObject}
        setAdmissionYears={setAdmissionYears}
        academicYears={academicYears}
        onSave={onUpdateAdmissionClicked}
      /> */}
      {/* <AddServiceToAdmissionModal
        availableServices={servicesList}
        agreedServices={agreedServices}
        setAgreedServices={setAgreedServices}
        onAddService={handleAddServiceToAdmission}
        anchor={anchor}
      /> */}
    </>
  );
  //}
  return content;
};
export default AdmissionsList;
