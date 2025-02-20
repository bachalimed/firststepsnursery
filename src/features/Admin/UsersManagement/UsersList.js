import { useGetUsersQuery, useDeleteUserMutation } from "./usersApiSlice";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import { LuKeyRound } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import UsersManagement from "../UsersManagement";
import { HiOutlineSearch } from "react-icons/hi";
import { FiEdit, FiDelete } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ImProfile } from "react-icons/im";
import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import { IoShieldCheckmarkOutline, IoShieldOutline } from "react-icons/io5";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { ROLES } from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
import { useOutletContext } from "react-router-dom";
const UsersList = () => {
  useEffect(() => {
    document.title = "Users List";
  });
  //initialise state variables and hooks
  const navigate = useNavigate();
  //const dispatch = useDispatch();
  const { canEdit, canDelete, canView, canAdd, canCreate, isParent, status2 } =
    useAuth();

  //import users using RTK query
  const {
    data: users, //deconstructing data into users
    isLoading: isUsersLoading,
    isSuccess: isUsersSuccess,
    // isError: isUsersError,
    // error: usersError,
    refetch,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000, //will refetch data every 60seconds
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true, //refetch when we remount the component
  });

  const [
    deleteUser,
    {
       isSuccess: isDelSuccess,
      // isLoading: isDelLoading,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteUserMutation();
  useEffect(() => {
    if (isDelSuccess) {
      refetch();
    }
  }, [isDelSuccess]);
  // State for search query and selected filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserRoles, setSelectedUserRoles] = useState([]);
  const [selectedUserActions, setSelectedUserActions] = useState([]);

  //normally we will remove the prefetch since we wont need all users for any login and we import rtk here
  //get the users fromthe state
  //const allUsers = useSelector(state => selectAllUsers(state))

  //the serach result data
  let usersList;
  let filteredUsers = [];
  if (isUsersSuccess) {
    const { entities } = users;
    usersList = Object.values(entities);

    // dispatch(setUsers(usersList)); //timing issue to update the state and use it the same time

    // Filtering Logic
    filteredUsers = usersList?.filter((item) => {
      // Basic name search
      const firstNameMatch = item.userFullName.userFirstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const middleNameMatch = item.userFullName.userMiddleName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const lastNameMatch = item.userFullName.userLastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Checking if any value in the item matches the search query
      const generalMatch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Implement filters by userRoles and userActions
      const userRolesFilter =
        selectedUserRoles.length === 0 ||
        item.userRoles.some((role) => selectedUserRoles.includes(role));

      const userActionsFilter =
        selectedUserActions.length === 0 ||
        item.userAllowedActions.some((action) =>
          selectedUserActions.includes(action)
        );

      return (
        (generalMatch || firstNameMatch || middleNameMatch || lastNameMatch) &&
        userRolesFilter &&
        userActionsFilter
      );
    });
  }
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleRoleChange = (e) => setSelectedUserRoles(e.target.value);
  const handleActionChange = (e) => setSelectedUserActions(e.target.value);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idUserToDelete, setIdUserToDelete] = useState(null); // State to track which document to delete
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  // Function to handle the delete button click
  const onDeleteUserClicked = (id) => {
    setIdUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteUser({ id: idUserToDelete });
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
    setIdUserToDelete(null);
  };

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "0px",
    },
    //show this column only if user is a parent and not employee

    {
      name: "Active",
      selector: (row) => row.userIsActive,
      cell: (row) => (
        <span>
          {row.userIsActive ? (
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
      name: "Sex",
      selector: (row) => row.userSex,
      cell: (row) => (
        <span>
          {row.userSex === "Male" ? (
            <LiaMaleSolid className="text-sky-700 text-2xl" />
          ) : (
            <LiaFemaleSolid className="text-red-600 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      width: "80px",
    },
    {
      name: "Password",
      selector: (row) => row?.isForgotPassword,
      cell: (row) => (
        <span>
          {row?.isForgotPassword === true ? (
            <LuKeyRound className="text-red-700 text-2xl" />
          ) : (
            <LuKeyRound className="text-green-600 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      width: "110px",
    },
    {
      name: "ID",
      selector: (row) => row._id, // Use _id for sorting

      cell: (row) => (
        <div>
          <Link to={`/admin/usersManagement/userDetails/${row._id}`}>
            <div>User {row._id}</div>
          </Link>
          {row.employeeId && (
            <Link to={`/hr/employees/employeeDetails/${row._id}`}>
              <div>Emp {row.employeeId}</div>
            </Link>
          )}
          {row.familyId && (
            <Link to={`/students/studentsParents/familyDetails/${row._id}`}>
              <div>Fam {row.familyId}</div>
            </Link>
          )}
        </div>
      ),
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      sortable: true,
      width: "260px",
    },
    {
      name: "Username",
      selector: (row) => (
        <Link to={`/admin/usersManagement/userDetails/${row._id}`}>
          {row.username}
        </Link>
      ),
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "130px",
      // sortFunction: (rowA, rowB) => {
      //   const usernameA = rowA.username.toLowerCase();
      //   const usernameB = rowB.username.toLowerCase();

      //   if (usernameA < usernameB) {
      //     return -1;
      //   }
      //   if (usernameA > usernameB) {
      //     return 1;
      //   }
      //   return 0;
      // },
    },
    {
      name: "CIN",
      selector: (row) => row?.cin || "",
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "100px",
      // sortFunction: (rowA, rowB) => {
      //   const usernameA = rowA.username.toLowerCase();
      //   const usernameB = rowB.username.toLowerCase();

      //   if (usernameA < usernameB) {
      //     return -1;
      //   }
      //   if (usernameA > usernameB) {
      //     return 1;
      //   }
      //   return 0;
      // },
    },
    // {
    //   name: "Full Name",
    //   selector: (row) => (
    //     <Link to={`/admin/usersManagement/userDetails/${row._id}`}>

    //       {row.userFullName.userFirstName} {row.userFullName.userMiddleName} {row.userFullName.userLastName}
    //     </Link>
    //   ),
    //   sortable: true,
    //   width: "210px",
    // },

    {
      name: "Full Name",
      selector: (row) => (
        <Link to={`/admin/usersManagement/userDetails/${row._id}`}>
          {row.userFullName.userFirstName} {row.userFullName.userMiddleName}{" "}
          {row.userFullName.userLastName}
        </Link>
      ),
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "210px",
      // sortFunction: (rowA, rowB) => {
      //   const fullNameA =
      //     `${rowA.userFullName.userFirstName} ${rowA.userFullName.userMiddleName} ${rowA.userFullName.userLastName}`.toLowerCase();
      //   const fullNameB =
      //     `${rowB.userFullName.userFirstName} ${rowB.userFullName.userMiddleName} ${rowB.userFullName.userLastName}`.toLowerCase();

      //   if (fullNameA < fullNameB) {
      //     return -1;
      //   }
      //   if (fullNameA > fullNameB) {
      //     return 1;
      //   }
      //   return 0;
      // },
    },
    // {
    //   name: "DOB",
    //   selector: (row) =>
    //     new Date(row.userDob).toLocaleString("en-US", {
    //       day: "numeric",
    //       month: "numeric",
    //       year: "numeric",
    //     }),
    //   width: "100px",
    //   sortable: true,
    // },

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
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "130px",
    },
    {
      name: "Actions",
      selector: (row) => (
        <div>
          {(row?.userAllowedActions).map((action) => (
            <div key={action}>{action}</div>
          ))}
        </div>
      ),
      sortable: true,
      removableRows: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
      width: "120px",
    },

    {
      name: "Manage",
      cell: (row) => (
        <div className="space-x-1">
          <button
            aria-label="userDetails"
            className="text-sky-700"
            fontSize={20}
            onClick={() =>
              navigate(`/admin/usersManagement/userDetails/${row._id}`)
            }
            hidden={!canView}
          >
            <ImProfile fontSize={20} />
          </button>
          {/* /////////////////////condition is canEdit and not ! of it */}

          <button
            aria-label="edit user"
            className="text-amber-300"
            onClick={() => navigate(`/admin/usersManagement/${row._id}/`)}
            hidden={!canEdit}
          >
            <FiEdit fontSize={20} />
          </button>

          <button
            aria-label="delete user"
            className="text-red-600"
            onClick={() => onDeleteUserClicked(row._id)}
            hidden={!canDelete}
          >
            <RiDeleteBin6Line fontSize={20} />
          </button>
        </div>
      ),
      ignoreRowClick: true,

      button: true,
    },
  ].filter(Boolean); // Filter out falsy values like `false` or `undefined`

  // Custom header to include the row count
  const tableHeader = (
    <h2>
      Users List:
      <span> {filteredUsers.length} users</span>
    </h2>
  );

  let content;

  if (isUsersLoading)
    content = (
      <>
        <UsersManagement />
        <LoadingStateIcon />
      </>
    );
  // if (isUsersSuccess)
  content = (
    <>
      <UsersManagement />
      <div className="flex space-x-2 items-center ml-3">
        {/* Search Bar */}
        <div className="relative h-10 mr-2 ">
          <HiOutlineSearch
            fontSize={20}
            className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
            aria-label="search users"
          />
          <input
            aria-label="search users"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="serachQuery"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange({ target: { value: "" } })} // Clear search
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="clear search"
            >
              &times;
            </button>
          )}
        </div>
        {/* User Roles Filter */}
        <label htmlFor="userRolesFilter" className="formInputLabel">
          <select
            id="userRolesFilter"
            value={selectedUserRoles}
            onChange={handleRoleChange}
            className="text-sm h-8 border border-gray-300  px-4"
          >
            <option value="">All Roles</option>
            {Object.values(ROLES).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        {/* User Actions Filter */}
        <label htmlFor="userActionsFilter" className="formInputLabel">
          <select
            id="userActionsFilter"
            value={selectedUserActions}
            onChange={handleActionChange}
            className="text-sm h-8 border border-gray-300  px-4"
          >
            <option value="">All Actions</option>
            {Object.values(ACTIONS).map((action) => (
              <option key={action} value={action}>
                {action}
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
            data={filteredUsers}
            pagination
            //selectableRows
            removableRows
            pageSizeControl
            // onSelectedRowsChange={handleRowSelected}
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
          onClick={() => navigate("/admin/usersManagement/newUser/")}
          // disabled={selectedRows.length !== 1} // Disable if no rows are selected
        >
          New User
        </button>

        {/* <button
              className="px-3 py-2 bg-amber-300 text-white rounded"
              onClick={handleDuplicateSelected}
              disabled={selectedRows.length !== 1} // Disable if no rows are selected
              hidden={!canCreate}
            >
              Duplicate Selected
            </button> */}
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

export default UsersList;
