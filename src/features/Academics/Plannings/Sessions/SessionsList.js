import {
  useGetSessionsByYearQuery,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
} from "./sessionsApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import Academics from "../Academics";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
//import { useGetSessionDocumentsByYearByIdQuery } from "../../../AppSettings/SessionsSet/SessionDocumentsLists/sessionDocumentsListsApiSlice"
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
// import RegisterModal from './RegisterModal'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  setAcademicYears,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import useAuth from "../../../hooks/useAuth";
import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import { IoShieldCheckmarkOutline, IoShieldOutline } from "react-icons/io5";
import {
  setSomeSessions,
  setSessions,
  currentSessionsList,
} from "./sessionsSlice";
import { IoDocumentAttachOutline } from "react-icons/io5";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
const SessionsList = () => {
  //this is for the academic year selection
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();
  const [requiredDocNumber, setRequiredDocNumber] = useState("");
  const [sessionDocNumber, setSessionDocNumber] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idSessionToDelete, setIdSessionToDelete] = useState(null); // State to track which document to delete

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const {
    data: sessions, //the data is renamed sessions
    isLoading: isSessionsLoading,
    isSuccess: isSessionsSuccess,
    isError: isSessionsError,
    error: sessionsError,
  } = useGetSessionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "sessionsList",
    } || {},
    {
      //pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //initialising the delete Mutation
  const [
    deleteSession,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteSessionMutation();

  // Function to handle the delete button click
  const onDeleteSessionClicked = (id) => {
    setIdSessionToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deleteSession({ id: idSessionToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdSessionToDelete(null);
  };

  //this ensures teh selected year is chosen before running hte useeffect it is working perfectly to dispaptch the selected year
  // useEffect(() => {
  //   if (selectedAcademicYear?.title) {
  //     setSelectedYear(selectedAcademicYear?.title);
  //     //console.log('Selected year updated:', selectedAcademicYear?.title)
  //   }
  // }, [selectedAcademicYear]);
  //console.log('selectedAcademicYear',selectedAcademicYear)

  // const myStu = useSelector(state=> state.session)
  // console.log(myStu, 'mystu')

  //const allSessions = useSelector(selectAllSessions)// not the same cache list we re looking for this is from getsessions query and not getsessionbyyear wuery

  //console.log('allSessions from the state by year',allSessions)
  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredSessions, setFilteredSessions] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  let sessionsList = [];
  let filteredSessions = [];
  if (isSessionsSuccess) {
    //set to the state to be used for other component s and edit session component

    const { entities } = sessions;

    //we need to change into array to be read??
    sessionsList = Object.values(entities); //we are using entity adapter in this query
    //console.log(sessionsList,'sessionsList')
    dispatch(setSessions(sessionsList)); //timing issue to update the state and use it the same time

    //the serach result data
    filteredSessions = sessionsList?.filter((item) => {
      //the nested objects need extra logic to separate them
      const firstNameMatch = item?.userFullName?.userFirstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const middleNameMatch = item?.userFullName?.userMiddleName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const lastNameMatch = item?.userFullName?.userLastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      //console.log('filteredSessions in the success', item)
      return (
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        firstNameMatch ||
        middleNameMatch ||
        lastNameMatch
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

  const [
    updateSession,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateSessionMutation(); //it will not execute the mutation nownow but when called
  const [sessionObject, setSessionObject] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  //console.log(academicYears)
  // Handler for registering selected row,
  const [sessionYears, setSessionYears] = useState([]);
  const handleRegisterSelected = () => {
    //we already allowed only one to be selected in the button options
    //console.log('Selected Rows to detail:', selectedRows)

    setSessionObject(selectedRows[0]);
    //console.log(sessionObject, "sessionObject");
    //const {sessionYears}= (sessionObject)

    setSessionYears(sessionObject.sessionYears);
    //console.log("session years and id", sessionYears);
    setIsRegisterModalOpen(true);

    //setSelectedRows([]); // Clear selection after process
  };
  //console.log(filteredSessions, "filteredSessions");
  // This is called when saving the updated session years from the modal
  const onUpdateSessionClicked = async (updatedYears) => {
    console.log("Updated sessionYears from modal:", updatedYears);

    const updatedSessionObject = {
      ...sessionObject,
      sessionYears: updatedYears, // Merge updated sessionYears
    };

    console.log("Saving updated session:", updatedSessionObject);

    try {
      await updateSession(updatedSessionObject); // Save updated session to backend
      console.log("Session updated successfully");
    } catch (sessionsError) {
      console.log("sessionsError saving session:", sessionsError);
    }

    setIsRegisterModalOpen(false); // Close modal
  };

  //   const [sessionYears, setSessionYears] = useState([])
  // //adds to the previous entries in arrays for gardien, schools...
  //       const onSessionYearsChanged = (e, selectedYear) => {
  //         if (e.target.checked) {
  //           // Add the selectedYear to sessionYears if it's checked
  //           setSessionYears([...sessionYears, selectedYear]);
  //         } else {
  //           // Remove the selectedYear from sessionYears if it's unchecked
  //           setSessionYears(sessionYears.filter(year => year !== selectedYear))
  //         }
  //       }

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },
    //show this column only if user is a parent and not session

    isAdmin && {
      name: "ID",
      selector: (row) => (
        <div>
          <Link to={`/admin/users/userManagement/userDetails/${row.id}`}>
            <div>User {row.id} </div>
          </Link>
          <Link to={`/hr/sessions/sessionDetails/${row.id}`}>
            {" "}
            {/* the session details use the user Id and not sessionId */}{" "}
            {row.sessionId && <div>Session {row.sessionId} </div>}
          </Link>
        </div>
      ),

      sortable: true,
      width: "240px",
    },
    //  (isAdmin)&&{
    // name: "Session ID",
    // selector:row=>( <Link to={`/hr/sessions/sessionDetails/${row.sessionId}`} >{row.sessionId} </Link> ),
    // sortable:true,
    // width:'200px'
    //  },
    {
      name: "Active",
      selector: (row) => row.sessionData?.sessionIsActive,
      cell: (row) => (
        <span>
          {row.sessionData?.sessionIsActive ? (
            <IoShieldCheckmarkOutline className="text-green-500 text-2xl" />
          ) : (
            <IoShieldOutline className="text-amber-300 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      width: "80px",
    },
    {
      name: "Session Name",
      selector: (row) =>
        `${row.userFullName?.userFirstName || ""} ${
          row.userFullName?.userMiddleName || ""
        } ${row.userFullName?.userLastName || ""}`,
      sortable: true,
      width: "200px",
      cell: (row) => (
        <Link to={`/hr/sessions/sessionDetails/${row.id}`}>
          {row.userFullName?.userFirstName} {row.userFullName?.userMiddleName}{" "}
          {row.userFullName?.userLastName}
        </Link>
      ),
    },
    {
      name: "Sex",
      selector: (row) => row.userSex, //changed from userSex
      cell: (row) => (
        <span>
          {row.userSex === "Male" ? (
            <LiaMaleSolid className="text-sky-700 text-3xl" />
          ) : (
            <LiaFemaleSolid className="text-red-600 text-3xl" />
          )}
        </span>
      ),
      sortable: true,
      removableRows: true,
      width: "70px",
    },

    // {name: "DOB",
    //   selector:row=>new Date(row.userDob).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }),

    //   sortable:true,
    //   width:'100px'
    // },

    {
      name: "Years",
      selector: (row) => (
        <div>
          {(row?.sessionData?.sessionYears).map((year) => (
            <div key={year.academicYear}>{year.academicYear}</div>
          ))}
        </div>
      ),
      sortable: true,
      removableRows: true,
      width: "110px",
    },

    {
      name: "Position",
      selector: (row) =>
        row.sessionData?.sessionCurrentEmployment?.position || "",

      cell: (row) => (
        <div>
          <div>{row.sessionData?.sessionCurrentEmployment?.contractType}</div>
          <div>{row.sessionData?.sessionCurrentEmployment?.position}</div>
        </div>
      ),
      sortable: true,
      width: "110px",
    },

    {
      name: "Roles",
      selector: (row) => (
        <div>
          {(row?.userRoles).map((role) => (
            <div key={role}>{role}</div>
          ))}
        </div>
      ),
      sortable: true,
      removableRows: true,
      width: "130px",
    },

    {
      name: "Package",
      selector: (row) => (
        <div>
          <div>{`Basic:  ${row.sessionData?.sessionCurrentEmployment?.salaryPackage?.basic} ${row.sessionData?.sessionCurrentEmployment?.salaryPackage?.payment}`}</div>
          {row.sessionData?.sessionCurrentEmployment?.salaryPackage?.cnss && (
            <div>{`cnss: ${row.sessionData?.sessionCurrentEmployment?.salaryPackage?.cnss}`}</div>
          )}
          {row.sessionData?.sessionCurrentEmployment?.salaryPackage?.other && (
            <div>{`other: ${row.sessionData?.sessionCurrentEmployment?.salaryPackage?.other}`}</div>
          )}
        </div>
      ),
      sortable: true,
      removableRows: true,
      width: "150px",
    },

    {
      name: "Documents",
      selector: (row) => (
        <Link to={`/hr/sessions/sessionDocumentsList/${row.id}`}>
          {" "}
          <IoDocumentAttachOutline className="text-slate-800 text-2xl" />
        </Link>
      ),
      sortable: true,
      removableRows: true,
      width: "120px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          <button
            aria-label="edit session"
            className="text-sky-700"
            fontSize={20}
            onClick={() => navigate(`/hr/sessions/sessionDetails/${row.id}`)}
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
              aria-label="delete session"
              className="text-amber300"
              onClick={() => navigate(`/hr/sessions/editSession/${row.id}`)}
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              className="text-red-600"
              onClick={() => onDeleteSessionClicked(row.id)}
            >
              <RiDeleteBin6Line className="text-2xl" />
            </button>
          )}
        </div>
      ),
      ignoreRowClick: true,

      button: true,
    },
  ].filter(Boolean); // Filter out falsy values like `false` or `undefined`
  let content;
  if (isSessionsLoading)
    content = (
      <p>
        <LoadingStateIcon />
      </p>
    );

  content = (
    <>
      <Academics />

      <div className="relative h-10 mr-2 ">
        <HiOutlineSearch
          fontSize={20}
          className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
          aria-label="search sessions"
        />
        <input
          aria-label="search sessions"
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="text-sm focus:outline-none active:outline-none mt-1 h-8 w-[12rem] border border-gray-300 rounded-md px-4 pl-11 pr-4"
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
      <div className=" dataTableContainer">
        <div>
          <DataTable
            columns={column}
            data={filteredSessions}
            pagination
            selectableRows
            removableRows
            pageSizeControl
            onSelectedRowsChange={handleRowSelected}
            selectableRowsHighlight
            customStyles={{
              table: {
                style: {
                  tableLayout: "auto", // Allow dynamic resizing of columns
                  width: "100%",
                },
              },
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
            className=" px-4 py-2 bg-green-600 text-white rounded"
            onClick={handleRegisterSelected}
            disabled={selectedRows.length !== 1} // Disable if no rows are selected
            hidden={!canCreate}
          >
            Register
          </button>

          <button
            className="px-3 py-2 bg-amber-300 text-white rounded"
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
        sessionYears={sessionYears}
        academicYears={academicYears}
        onSave={onUpdateSessionClicked}
      /> */}
    </>
  );
};
return content;

export default SessionsList;
