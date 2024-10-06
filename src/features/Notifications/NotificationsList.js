import {
  useGetNotificationsByYearQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} from "./notificationsApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import Notifications from "../Notifications";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
//import { useGetNotificationDocumentsByYearByIdQuery } from "../../../AppSettings/NotificationsSet/NotificationDocumentsLists/notificationDocumentsListsApiSlice"
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
  setSomeNotifications,
  setNotifications,
  currentNotificationsList,
} from "./notificationsSlice";
import { IoDocumentAttachOutline } from "react-icons/io5";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";

const NotificationsList = () => {
  //this is for the academic year selection
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();
  const [requiredDocNumber, setRequiredDocNumber] = useState("");
  const [notificationDocNumber, setNotificationDocNumber] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idNotificationToDelete, setIdNotificationToDelete] = useState(null); // State to track which document to delete

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const {
    data: notifications, //the data is renamed notifications
    isLoading: isNotificationsLoading, //monitor several situations is loading...
    isSuccess: isNotificationsSuccess,
    isError: isNotificationsError,
    error: notificationsError,
  } = useGetNotificationsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "notificationsList",
    } || {},
    {
      //this param will be passed in req.params to select only notifications for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  //initialising the delete Mutation
  const [
    deleteNotification,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteNotificationMutation();

  // Function to handle the delete button click
  const onDeleteNotificationClicked = (id) => {
    setIdNotificationToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deleteNotification({ id: idNotificationToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdNotificationToDelete(null);
  };

  //this ensures teh selected year is chosen before running hte useeffect it is working perfectly to dispaptch the selected year
  // useEffect(() => {
  //   if (selectedAcademicYear?.title) {
  //     setSelectedYear(selectedAcademicYear.title);
  //     //console.log('Selected year updated:', selectedAcademicYear.title)
  //   }
  // }, [selectedAcademicYear]);
  //console.log('selectedAcademicYear',selectedAcademicYear)

  // const myStu = useSelector(state=> state.notification)
  // console.log(myStu, 'mystu')

  //const allNotifications = useSelector(selectAllNotifications)// not the same cache list we re looking for this is from getnotifications query and not getnotificationbyyear wuery

  //console.log('allNotifications from the state by year',allNotifications)
  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredNotifications, setFilteredNotifications] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  let notificationsList = [];
  let filteredNotifications = [];
  if (isNotificationsSuccess) {
    //set to the state to be used for other component s and edit notification component

    const { entities } = notifications;

    //we need to change into array to be read??
    notificationsList = Object.values(entities); //we are using entity adapter in this query
    //console.log(notificationsList,'notificationsList')
    dispatch(setNotifications(notificationsList)); //timing issue to update the state and use it the same time

    //the serach result data
    filteredNotifications = notificationsList?.filter((item) => {
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
      //console.log('filteredNotifications in the success', item)
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
    updateNotification,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateNotificationMutation(); //it will not execute the mutation nownow but when called
  const [notificationObject, setNotificationObject] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  //console.log(academicYears)
  // Handler for registering selected row,
  const [notificationYears, setNotificationYears] = useState([]);
  const handleRegisterSelected = () => {
    //we already allowed only one to be selected in the button options
    //console.log('Selected Rows to detail:', selectedRows)

    setNotificationObject(selectedRows[0]);
    //console.log(notificationObject, "notificationObject");
    //const {notificationYears}= (notificationObject)

    setNotificationYears(notificationObject.notificationYears);
    //console.log("notification years and id", notificationYears);
    setIsRegisterModalOpen(true);

    //setSelectedRows([]); // Clear selection after process
  };
  //console.log(filteredNotifications, "filteredNotifications");
  // This is called when saving the updated notification years from the modal
  const onUpdateNotificationClicked = async (updatedYears) => {
    console.log("Updated notificationYears from modal:", updatedYears);

    const updatedNotificationObject = {
      ...notificationObject,
      notificationYears: updatedYears, // Merge updated notificationYears
    };

    console.log("Saving updated notification:", updatedNotificationObject);

    try {
      await updateNotification(updatedNotificationObject); // Save updated notification to backend
      console.log("Notification updated successfully");
    } catch (notificationsError) {
      console.log("notificationsError saving notification:", notificationsError);
    }

    setIsRegisterModalOpen(false); // Close modal
  };

  //   const [notificationYears, setNotificationYears] = useState([])
  // //adds to the previous entries in arrays for gardien, schools...
  //       const onNotificationYearsChanged = (e, selectedYear) => {
  //         if (e.target.checked) {
  //           // Add the selectedYear to notificationYears if it's checked
  //           setNotificationYears([...notificationYears, selectedYear]);
  //         } else {
  //           // Remove the selectedYear from notificationYears if it's unchecked
  //           setNotificationYears(notificationYears.filter(year => year !== selectedYear))
  //         }
  //       }

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },
    //show this column only if user is a parent and not notification

    isAdmin && {
      name: "ID",
      selector: (row) => (
        <div>
          <Link to={`/admin/users/userManagement/userDetails/${row.id}`}>
            <div>User {row.id} </div>
          </Link>
          <Link to={`/hr/notifications/notificationDetails/${row.id}`}>
            {" "}
            {/* the notification details use the user Id and not notificationId */}{" "}
            {row.notificationId && <div>Notification {row.notificationId} </div>}
          </Link>
        </div>
      ),

      sortable: true,
      width: "240px",
    },
    //  (isAdmin)&&{
    // name: "Notification ID",
    // selector:row=>( <Link to={`/hr/notifications/notificationDetails/${row.notificationId}`} >{row.notificationId} </Link> ),
    // sortable:true,
    // width:'200px'
    //  },
    {
      name: "Active",
      selector: (row) => row.notificationData?.notificationIsActive,
      cell: (row) => (
        <span>
          {row.notificationData?.notificationIsActive ? (
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
      name: "Notification Name",
      selector: (row) =>
        `${row.userFullName?.userFirstName || ""} ${
          row.userFullName?.userMiddleName || ""
        } ${row.userFullName?.userLastName || ""}`,
      sortable: true,
      width: "200px",
      cell: (row) => (
        <Link to={`/hr/notifications/notificationDetails/${row.id}`}>
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

    // {name: "DOB",
    //   selector:row=>new Date(row.userDob).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }),

    //   sortable:true,
    //   width:'100px'
    // },

    {
      name: "Years",
      selector: (row) => (
        <div>
          {(row?.notificationData?.notificationYears).map((year) => (
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
        row.notificationData?.notificationCurrentEmployment?.position || "",

      cell: (row) => (
        <div>
          <div>{row.notificationData?.notificationCurrentEmployment?.contractType}</div>
          <div>{row.notificationData?.notificationCurrentEmployment?.position}</div>
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
          <div>{`Basic:  ${row.notificationData?.notificationCurrentEmployment?.salaryPackage?.basic} ${row.notificationData?.notificationCurrentEmployment?.salaryPackage?.payment}`}</div>
          {row.notificationData?.notificationCurrentEmployment?.salaryPackage?.cnss && (
            <div>{`cnss: ${row.notificationData?.notificationCurrentEmployment?.salaryPackage?.cnss}`}</div>
          )}
          {row.notificationData?.notificationCurrentEmployment?.salaryPackage
            ?.other && (
            <div>{`other: ${row.notificationData?.notificationCurrentEmployment?.salaryPackage?.other}`}</div>
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
        <Link to={`/hr/notifications/notificationDocumentsList/${row.id}`}>
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
            className="text-blue-500"
            fontSize={20}
            onClick={() => navigate(`/hr/notifications/notificationDetails/${row.id}`)}
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() => navigate(`/hr/notifications/editNotification/${row.id}`)}
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              className="text-red-500"
              onClick={() => onDeleteNotificationClicked(row.id)}
            >
              <RiDeleteBin6Line className="text-2xl" />
            </button>
          )}
        </div>
      ),
      ignoreRowClick: true,

      button: true,
    },
  ];
  let content;
  if (isNotificationsLoading) content = <p>Loading...</p>;
  if (isNotificationsError) {
    content = <p className="errmsg">{notificationsError?.data?.message}</p>; //errormessage class defined in the css, the error has data and inside we have message of error
  }
  //if (isNotificationsSuccess){

  content = (
    <>
      <Notifications />

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
          data={filteredNotifications}
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
        notificationYears={notificationYears}
        academicYears={academicYears}
        onSave={onUpdateNotificationClicked}
      /> */}
    </>
  );
  //}
  return content;
};
export default NotificationsList;
