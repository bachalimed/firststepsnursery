import {
  useGetEnrolmentsQuery,
  useUpdateEnrolmentMutation,
  useGetEnrolmentsByYearQuery,
  useDeleteEnrolmentMutation,
} from "./enrolmentsApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import Enrolments from "../Enrolments";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import { IoShieldCheckmarkOutline, IoShieldOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import {
  selectAllEnrolmentsByYear,
  selectAllEnrolments,
} from "./enrolmentsApiSlice"; //use the memoized selector
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { setAcademicYears } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { IoAddCircleOutline } from "react-icons/io5";

import useAuth from "../../../hooks/useAuth";

import {
  setSomeEnrolments,
  setEnrolments,
  currentEnrolmentsList,
} from "./enrolmentsSlice";
import { IoDocumentAttachOutline } from "react-icons/io5";

const EnrolmentsList = () => {
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

  //console.log("Fetch enrolments for academic year:", selectedAcademicYear);
  const {
    data: enrolments, //the data is renamed enrolments
    isLoading, //monitor several situations is loading...
    isSuccess,
    isError,
    error,
  } = useGetEnrolmentsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "enrolmentsList",
    } || {},
    {
      //this param will be passed in req.params to select only enrolments for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      pollingInterval: 60000, //will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  //initialising the delete Mutation
  const [
    deleteEnrolment,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteEnrolmentMutation();

  // Function to handle the delete button click
  const onDeleteEnrolmentClicked = (id) => {
    setIdEnrolmentToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deleteEnrolment({ id: idEnrolmentToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdEnrolmentToDelete(null);
  };

  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredEnrolments, setFilteredEnrolments] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  let enrolmentsList = [];
  let filteredEnrolments = [];
  if (isSuccess) {
    //set to the state to be used for other component s and edit enrolment component
    const { entities } = enrolments;
    //we need to change into array to be read??
    enrolmentsList = Object.values(entities); //we are using entity adapter in this query
    dispatch(setEnrolments(enrolmentsList)); //timing issue to update the state and use it the same time
    filteredEnrolments = enrolmentsList?.filter((enrol) => {
      // Check if the student's name or any other field contains the search query
      const nameMatches = [
        enrol?.student?.studentName?.firstName,
        enrol?.student?.studentName?.middleName,
        enrol?.student?.studentName?.lastName,
      ].some((name) => name?.toLowerCase().includes(searchQuery.toLowerCase()));

      // Add more criteria as needed, e.g., enrolmentDate, services, etc.
      const otherMatches = Object.values(enrol)
        .flat()
        .some((val) =>
          val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );

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
          name: "Enrolment ID",
          selector: (row) => (
            <Link to={`/enrolments/enrolments/enrolmentDetails/${row.id}`}>
              {row.id}
            </Link>
          ),
          sortable: true,
          width: "200px",
        }
      : null,

    {
      name: " Student Is Active",
      selector: (row) => row.student.studentIsActive,
      cell: (row) => (
        <span>
          {row.student.studentIsActive ? (
            <IoShieldCheckmarkOutline className="text-green-500 text-2xl" />
          ) : (
            <IoShieldOutline className="text-yellow-400 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      width: "80px",
    },
    {
      name: "Sex",
      selector: (row) => row.studentSex, //changed from userSex
      cell: (row) => (
        <span>
          {row.studentSex === "Male" ? (
            <LiaMaleSolid className="text-blue-500 text-3xl" />
          ) : (
            <LiaFemaleSolid className="text-rose-500 text-3xl" />
          )}
        </span>
      ),
      sortable: true,
      removableRows: true,
      width: "70px",
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
      width: "160px",
    },
    {
      name: "Admission Service",
      selector: (row) =>
        `${row.admission.agreedServices?.feePeriod || ""} ${
          row.service?.serviceType || ""
        }`,
      sortable: true,
      width: "150px",
    },
    {
      name: "Amount",
      selector: (row) => `${row.admission.agreedServices?.feeValue}`,

      sortable: true,
      width: "100px",
    },
    {
      name: "Validated",//means authorised 
      selector: (row) => (row.admission.agreedServices?.isAuthorised ? "yes" : "No"),

      sortable: true,
      width: "120px",
    },
    {
      name: "Admission Fee Dates",
      selector: (row) => (
        <>
          <div>
            from{" "}
            {new Date(
              row.admission.agreedServices.feeStartDate
            ).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
          <div>
            {row.admission.agreedServices.feeEndDate
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
      sortable: true,
      width: "160px",
    },

    {
      name: "Enrolment Duration",
      selector: (row) =>
        `${row.enrolmentDuration || ""} ${row.enrolmentMonth || ""}`,
      sortable: true,
      width: "160px",
    },

    {
      name: "Enrolment Dates",
      selector: (row) => (
        <>
          <div>
            from{" "}
            {new Date(row.enrolmentStartDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
          <div>
            to{" "}
            {new Date(row.enrolmentEndDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
        </>
      ),
      sortable: true,
      width: "160px",
    },
    {
      name: "Invoiced",
      selector: (row) => (
        <>
          <div>
            on{" "}
            {new Date(row.enrolmentStartDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
          <div>for 110</div>
        </>
      ),

      sortable: true,
      width: "140px",
    },
    {
      name: "Paid",
      selector: (row) => (
        <>
          <div>
            on{" "}
            {new Date(row.enrolmentStartDate).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
          <div>110</div>
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
            className="text-green-500"
            fontSize={20}
            onClick={() => handleAddServiceToEnrolment(row.agreedServices)}
          >
            <IoMdAddCircleOutline className="text-2xl" />
          </button> */}
          <button
            className="text-blue-500"
            fontSize={20}
            onClick={() =>
              navigate(`/students/enrolments/enrolmentDetails/${row.id}`)
            }
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() =>
                navigate(`/students/enrolments/editEnrolment/${row.id}`)
              }
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              className="text-red-500"
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
  ];
  let content;
  if (isLoading) content = <LoadingStateIcon />;
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>; //errormessage class defined in the css, the error has data and inside we have message of error
  }
  //if (isSuccess){

  content = (
    <>
      <Enrolments />

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
          data={filteredEnrolments}
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
export default EnrolmentsList;
