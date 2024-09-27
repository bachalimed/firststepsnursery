import React from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { useGetFamiliesByYearQuery } from "./familiesApiSlice";
import { setSomeFamilies, setFamilies } from "./familiesSlice";
import StudentsParents from "../../StudentsParents";
import DataTable from "react-data-table-component";
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteFamilyMutation } from "./familiesApiSlice";
import { FiEdit, FiDelete } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineFamilyRestroom } from "react-icons/md";

import useAuth from "../../../../hooks/useAuth";
import { ImProfile } from "react-icons/im";
import { useDispatch } from "react-redux";
import { useSelectedAcademicYear } from "../../../../hooks/useSelectedAcademicYears";

const FamiliesList = () => {
  //this is for the academic year selection
  const selectedAcademicYear = useSelectedAcademicYear();
  const [selectedYear, setSelectedYear] = useState("");
  const Navigate = useNavigate();
  const Dispatch = useDispatch();

  //get several things from the query
  const {
    data: families, //the data is renamed families
    isLoading: isFamilyLoading, //monitor several situations
    isSuccess: isFamilySuccess,
    isError: isFamilyError,
    error: familyError,
  } = useGetFamiliesByYearQuery(
    { selectedYear: selectedYear, endpointName: "families" } || {},
    {
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  //this ensures teh selected year is chosen before running hte useeffect it is working perfectly to dispaptch the selected year
  useEffect(() => {
    if (selectedAcademicYear?.title) {
      setSelectedYear(selectedAcademicYear.title);
      //console.log('Selected year updated:', selectedAcademicYear.title)
    }
  }, [selectedAcademicYear]);

  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  let familiesList = [];
  let filteredFamilies = [];
  if (isFamilySuccess) {
    //set to the state to be used for other component s and edit student component

    const { entities } = families;
    //we need to change into array to be read??
    familiesList = Object.values(entities); //we are using entity adapter in this query
    Dispatch(setFamilies(familiesList)); //timing issue to update the state and use it the same time
    //console.log(entities)
    //the serach result data
    filteredFamilies = familiesList?.filter((item) => {
      //the nested objects need extra logic to separate them
      const fatherFirstNameMatch = item?.father?.userFullName?.userFirstName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const fatherMiddleNameMatch = item?.father?.userFullName?.userMiddleName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const fatherLastNameMatch = item?.father?.userFullName?.userLastName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const dobMatch = item?.userProfile?.userDob
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const motherFirstNameMatch = item?.mother?.userFullName?.userFirstName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const motherMiddleNameMatch = item?.mother?.userFullName?.userMiddleName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const motherLastNameMatch = item?.mother?.userFullName?.userLastName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      //console.log('filteredStudents in the success', item)
      return (
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        fatherFirstNameMatch ||
        fatherMiddleNameMatch ||
        fatherLastNameMatch ||
        dobMatch ||
        motherFirstNameMatch ||
        motherMiddleNameMatch ||
        motherLastNameMatch
      );
    });
  }

  const { canEdit, canDelete, canCreate, status2, isAdmin } = useAuth();

  const [
    deleteFamily,
    { isFamilySuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteFamilyMutation();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handler for selecting rows
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
    //console.log('selectedRows', selectedRows)
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idFamilyToDelete, setIdFamilyToDelete] = useState(null);
  const onDeleteFamilyClicked = (id) => {
    setIdFamilyToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deleteFamily({ id: idFamilyToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };
  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdFamilyToDelete(null);
  };

  // Handler for duplicating selected rows,
  const handleDuplicateSelected = () => {
    //console.log('Selected Rows to duplicate:', selectedRows);
    // Add  delete logic here (e.g., dispatching a Redux action or calling an API)
    //ensure only one can be selected: the last one
    const toDuplicate = selectedRows[-1];

    setSelectedRows([]); // Clear selection after delete
  };

  // Handler for duplicating selected rows,
  const handleDetailsSelected = () => {
    //console.log('Selected Rows to detail:', selectedRows)
    // Add  delete logic here (e.g., dispatching a Redux action or calling an API)
    //ensure only one can be selected: the last one
    const toDuplicate = selectedRows[-1];

    setSelectedRows([]); // Clear selection after delete
  };

  const errContent =
    (isFamilyError?.data?.message || isDelError?.data?.message) ?? "";
  //define the content to be conditionally rendered

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },

    {
      name: "Name",
      selector: (row) => (
        <div>
          <Link to={`/students/studentsParents/familyDetails/${row._id}`}>
            <div>
              {row.father?.userFullName.userFirstName +
                " " +
                row.father?.userFullName.userMiddleName +
                " " +
                row.father?.userFullName.userLastName}
            </div>
            <div>
              {row.mother?.userFullName.userFirstName +
                " " +
                row.mother?.userFullName.userMiddleName +
                " " +
                row.mother?.userFullName.userLastName}
            </div>
          </Link>
        </div>
      ),
      sortable: true,
      width: "210px",
    },

    {
      name: "DOB",
      selector: (row) => (
        <div>
          <div>
            {" "}
            {new Date(row.father?.userDob).toLocaleString("en-US", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </div>
          <div>
            {new Date(row.mother?.userDob).toLocaleString("en-US", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: "Situation",
      selector: (row) => (row.familySituation ? "Joint" : "Separated"),
      sortable: true,
      width: "100px",
    },

    {
      name: "Phone",
      selector: (row) => (
        <div>
          <div> {row.father?.userContact?.primaryPhone}</div>
          <div> {row.mother?.userContact?.primaryPhone}</div>
        </div>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: "Address",
      selector: (row) => (
        <div>
          <div>
            <div>
              {" "}
              {row.father?.userAddress?.house} {row.father?.userAddress?.street}
            </div>
            <div>
              {row.father?.userAddress?.area}
              {row.father?.userAddress?.postCode}
            </div>
            <div> {row.father?.userAddress?.city}</div>
          </div>
          {row.familySituation !== "Joint" && (
            <div>
              <div>
                {" "}
                {row.mother?.userAddress?.house}{" "}
                {row.mother?.userAddress?.street}
              </div>
              <div>
                {row.mother?.userAddress?.area}
                {row.mother?.userAddress?.postCode}
              </div>
              <div> {row.mother?.userAddress?.city}</div>
            </div>
          )}
        </div>
      ),
      sortable: true,
      width: "100px",
    },

    {
      name: "Children",
      selector: (row) => (
        <div>
          {row.children.map((child) => (
            <Link key={child?.child?._id} to={`/students/studentsParents/studentDetails/${child?.child?._id}`}>
              <div>
                {child?.child?.studentName?.firstName}{" "}
                {child?.child?.studentName?.middleName}{" "}
                {child?.child?.studentName?.lastName}
              </div>
            </Link>
          ))}
        </div>
      ),

      sortable: true,
      width: "180px",
    },

    {
      name: "Manage",
      cell: (row) => (
        <div className="space-x-1">
          <button
            className="text-blue-500"
            fontSize={20}
            onClick={() =>
              Navigate(`/students/studentsParents/familyDetails/${row.id}`)
            }
          >
            <ImProfile className="text-2xl" />
          </button>
          {/* /////////////////////condition is canEdit and not ! of it */}
          {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() =>
                Navigate(`/students/studentsParents/editFamily/${row.id}`)
              }
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {isAdmin && canDelete ? (
            <button
              className="text-red-500"
              onClick={() => onDeleteFamilyClicked(row._id)}
            >
              <RiDeleteBin6Line className="text-2xl" />
            </button>
          ) : null}
        </div>
      ),
      ignoreRowClick: true,

      button: true,
    },
  ];
  let content;

  if (isFamilyLoading) content = <p>Loading...</p>;

  if (isFamilyError | isDelError) {
    content = <p className="errmsg">error msg {Error?.data?.message}</p>; //errormessage class defined in the css, the error has data and inside we have message of error
  }

  //if (isFamilySuccess||isDelSuccess) {

  //console.log('filtered and success', filteredFamilies)

  content = (
    <>
      <StudentsParents />
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
        {/* <div>
    <input type="text" placeholder="search" onChange={handleFilter}/>
   </div> */}

        <DataTable
          columns={column}
          data={filteredFamilies}
          pagination
          selectableRows
          removableRows
          pageSizeControl
        ></DataTable>
        <div className="flex justify-end items-center space-x-4">
          <button
            className=" px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleDetailsSelected}
            disabled={selectedRows.length !== 1} // Disable if no rows are selected
          >
            User bla bla
          </button>

          <button
            className="px-3 py-2 bg-yellow-400 text-white rounded"
            onClick={handleDuplicateSelected}
            disabled={selectedRows.length !== 1} // Disable if no rows are selected
            // hidden={!canCreate}
          >
            Duplicate bla bla
          </button>
          {/* <button 
              className="px-3 py-2 bg-yellow-400 text-white rounded"
              onClick={handleAddChildren}
              disabled={selectedRows.length !== 1} // Disable if no rows are selected
        // hidden={!canCreate}
              >
              Add Child
          </button> */}
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
export default FamiliesList;
