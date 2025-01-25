import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { PiStudent } from "react-icons/pi";
import { BsConeStriped } from "react-icons/bs";

import {
  useGetNotificationsByYearQuery,
  useDeleteNotificationMutation,
} from "./notificationsApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../Components/LoadingStateIcon";
import DeletionConfirmModal from "../../Components/Shared/Modals/DeletionConfirmModal";
import useAuth from "../../hooks/useAuth";
import { IoShieldOutline } from "react-icons/io5";
import Notifications from "./Notifications";

const NotificationsList = () => {
  useEffect(() => {
    document.title = "Notifications List";
  });
  const navigate = useNavigate();
  const {
    userId,
    isAdmin,
    canDelete,
    canView,
    canCreate,
    isDirector,

    isManager,
    isAcademic,
  } = useAuth();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId);
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  );
  const [selectedRows, setSelectedRows] = useState([]);
  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedObject, setSelectedObject] = useState("");
  const [selectedYear, setSelectedYear] = useState(selectedAcademicYear?.title);
  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  //Handler for selecting rows
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
    //console.log('selectedRows', selectedRows)
  };
  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    isSuccess: isNotificationsSuccess,
    refetch,
  } = useGetNotificationsByYearQuery(
    {
      userId,
      isAdmin,
      isDirector,
      isManager,
      selectedYear,
      selectedDate: dateFilter,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const [
    deleteNotification,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteNotificationMutation();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const [ids, setIds] = useState([]);
  // Function to handle the delete button click
  const onDeleteNotificationClicked = (id) => {
    selectedRows.length === 0
      ? setIds([id])
      : setIds(selectedRows.map((row) => row.id));

    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteNotification({
        userId: userId,
        ids: ids,
        isAdmin: isAdmin,
      });
      setIsDeleteModalOpen(false);
      setSelectedRows([]); // Clear selected rows
      refetch();
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

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdToDelete(null);
  };

  let filteredNotifications = [];
  if (isNotificationsSuccess) {
    filteredNotifications = Object.values(notifications.entities).filter(
      (notification) => {
        const matchesSearch =
          notification.notificationTitle
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          notification.notificationContent
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesType =
          !selectedType || notification.notificationType === selectedType;

        return matchesSearch && matchesType;
      }
    );

    // Ensure that for non-privileged users, filteredNotifications is an empty array if no match is found
    if (
      !(isAdmin || isManager || isDirector) &&
      filteredNotifications.length === 0
    ) {
      filteredNotifications = [];
    }
  }

  const columns = [
    {
      name: "#",
      cell: (row, index) => index + 1,
      sortable: false,
      width: "50px",
    },
    {
      name: "Date",
      selector: (row) => new Date(row.notificationDate).toLocaleDateString(),
      sortable: true,
      width: "110px",
    },
    {
      name: "Type",
      selector: (row) => row.notificationType,
      sortable: true,
      width: "100px",
    },
    {
      name: "Title",
      selector: (row) => row.notificationTitle,
      sortable: true,
      width: "150px",
    },
    {
      name: "Content",
      selector: (row) => row.notificationExcerpt,
      sortable: true,
      wrap: true,
      width: "300px",
    },

    isAdmin && {
      name: "To Users",
      cell: (row) => (
        <div>
          {row.notificationToUsers?.map((userId) => (
            <div key={userId}>{userId}</div>
          ))}
        </div>
      ),
      sortable: true,
      wrap: true,
      width: "300px",
    },

    // {
    //   name: "Destination",//we be replaced by phone number?
    //   selector: (row) => row.notificationTo,
    //   sortable: true,
    // },

    {
      name: "Go to",
      cell: (row) => (
        <div className="space-x-2">
          {row.notificationType === "Payment" && (
            <button
              className="text-green-600"
              aria-label="notification Details"
              fontSize={20}
              onClick={() => navigate(`/finances/payments/paymentsList/`)}
              hidden={!canView}
            >
              <GiReceiveMoney className="text-2xl" />
            </button>
          )}
          {row.notificationType === "Admission" && (
            <button
              className="text-sky-600"
              aria-label="notification Details"
              fontSize={20}
              onClick={() => navigate(`/students/admissions/admissions/`)}
              hidden={!canView}
            >
              <PiStudent className="text-2xl" />
            </button>
          )}
          {row.notificationType === "Expense" && (
            <button
              className="text-red-500"
              aria-label="notification Details"
              fontSize={20}
              onClick={() => navigate(`/finances/expenses/expensesList/`)}
              hidden={!canView}
            >
              <GiPayMoney className="text-2xl" />
            </button>
          )}
          {row.notificationType === "Leave" && (
            <button
              className="text-amber-500"
              aria-label="notification Details"
              fontSize={20}
              onClick={() => navigate(`/hr/leaves/leavesList/`)}
              hidden={!canView}
            >
              <BsConeStriped className="text-2xl" />
            </button>
          )}
          {!isDelLoading && (
            <button
              className="text-red-600"
              onClick={() => {
                onDeleteNotificationClicked(row.id);
                setIsDeleteModalOpen(true);
              }}
              // hidden={!canDelete} anyone can delete his own notifiations
              disabled={selectedRows?.length > 0}
            >
              {" "}
              <RiDeleteBin6Line className="text-2xl" />
            </button>
          )}
        </div>
      ),
      button: true,
    },
  ].filter(Boolean);

  // Custom header to include the row count
  const tableHeader = (
    <h2>
      Assignments List:
      <span> {filteredNotifications?.length} Notifications</span>
    </h2>
  );
  let content;
  if (isNotificationsLoading)
    content = (
      <>
        <Notifications />
        <LoadingStateIcon />
      </>
    );
  content = (
    <>
      <Notifications />
      <div className="flex space-x-2 items-center ml-3">
        {/* Search Bar */}

        <div className="relative h-10 mr-2 ">
          <HiOutlineSearch
            fontSize={20}
            className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
            aria-label="search animators"
          />{" "}
          <input
            aria-label="search notifications"
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search notifications..."
            className="w-full pl-10 pr-3 py-2 border rounded"
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
        {/* object Filter Dropdown */}

        {/* <label htmlFor="objectFilter" className="formInputLabel">
          <select
            aria-label="objectFilter"
            id="objectFilter"
            value={selectedObject}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Types</option>
            <option value="Payment">Payment</option>
            <option value="Admission">Admission</option>
            <option value="Expense">Expense</option>
            <option value="Leave">Leave</option>
          </select>
        </label> */}
        {/* type Filter Dropdown */}

        <label htmlFor="typeFilter" className="formInputLabel">
          <select
            aria-label="typeFilter"
            id="typeFilter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Types</option>
            <option value="Payment">Payment</option>
            <option value="Admission">Admission</option>
            <option value="Expense">Expense</option>
            <option value="Leave">Leave</option>
          </select>
        </label>
        {/* date Filter  */}
        <label htmlFor="dateFilter" className="formInputLabel">
          <input
            id="dateFilter"
            type="date"
            value={dateFilter || ""}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </label>
      </div>
      <div className="dataTableContainer">
        <div>
          <DataTable
            title={tableHeader}
            columns={columns}
            data={filteredNotifications}
            pagination
            removableRows
            selectableRows
            selectableRowsHighlight
            // onSelectedRowsChange={handleRowSelected}
            onSelectedRowsChange={(state) =>
              setSelectedRows(state.selectedRows)
            }
            pageSizeControl
            customStyles={{
              table: {
                style: {
                  tableLayout: "auto", // Allow dynamic resizing of columns
                  width: "100%",
                },
              },
              headCells: {
                style: {
                  justifyContent: "center",
                  textAlign: "center",
                  color: "black",
                  fontSize: "14px",
                },
              },
              cells: {
                style: {
                  color: "black",
                  fontSize: "14px",
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
          />
        </div>

        {/* Center the Buttons */}
        {(isAdmin || isDirector || isManager || isAcademic) && (
          <button
            className={`delete-button  `}
            onClick={onDeleteNotificationClicked}
            hidden={!canCreate}
            disabled={selectedRows?.length === 0}
          >
            Delete {selectedRows?.length} notifications
          </button>
        )}

        <DeletionConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setSelectedRows([]); // Clear selected rows
            handleCloseDeleteModal();
          }}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </>
  );
  return content;
};

export default NotificationsList;
