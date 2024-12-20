import React from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { useGetFamiliesByYearQuery } from "./familiesApiSlice";
import { setSomeFamilies, setFamilies } from "./familiesSlice";
import Students from "../../Students";
import DataTable from "react-data-table-component";
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteFamilyMutation } from "./familiesApiSlice";
import { FiEdit, FiDelete } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineFamilyRestroom } from "react-icons/md";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import useAuth from "../../../../hooks/useAuth";
import { ImProfile } from "react-icons/im";
import { useDispatch } from "react-redux";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import { useOutletContext } from "react-router-dom";

const FamiliesList = () => {
  //this is for the academic year selection

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  // useEffect(() => {
  //     if (selectedAcademicYearId) {
  //         // Fetch the students for the selected academic year, if required
  //         console.log('Fetch students for academic year Id:', selectedAcademicYearId);
  //     }
  // }, [selectedAcademicYearId]);

  const navigate = useNavigate();
  const Dispatch = useDispatch();

  //get several things from the query
  const {
    data: families, //the data is renamed families
    isLoading: isFamiliesLoading, //monitor several situations
    isSuccess: isFamiliesSuccess,
    isError: isFamiliesError,
    error: familiesError,
  } = useGetFamiliesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "FamiliesList",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  // //this ensures teh selected year is chosen before running hte useeffect it is working perfectly to dispaptch the selected year
  // useEffect(() => {
  //   if (selectedAcademicYear?.title) {
  //     setSelectedYear(selectedAcademicYear?.title);
  //     //console.log('Selected year updated:', selectedAcademicYear?.title)
  //   }
  // }, [selectedAcademicYear]);

  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  let familiesList = [];
  let filteredFamilies = [];
  if (isFamiliesSuccess) {
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

      const motherFirstNameMatch = item?.mother?.userFullName?.userFirstName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const motherMiddleNameMatch = item?.mother?.userFullName?.userMiddleName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const motherLastNameMatch = item?.mother?.userFullName?.userLastName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const childNameMatch = item?.children?.some((child) => {
        const childFirstNameMatch = child?.child?.studentName?.firstName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const childMiddleNameMatch = child?.child?.studentName?.middleName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const childLastNameMatch = child?.child?.studentName?.lastName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

        return (
          childFirstNameMatch || childMiddleNameMatch || childLastNameMatch
        );
      });

      // Check if any top-level values match the search
      const topLevelMatch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );

      return (
        topLevelMatch ||
        fatherFirstNameMatch ||
        fatherMiddleNameMatch ||
        fatherLastNameMatch ||
        motherFirstNameMatch ||
        motherMiddleNameMatch ||
        motherLastNameMatch ||
        childNameMatch
      );
    });
  }

  const { canEdit, canDelete, canCreate, status2, isAdmin } = useAuth();

  const [
    deleteFamily,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteFamilyMutation();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handler for selecting rows
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
    //console.log('selectedRows', selectedRows)
  };
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idFamilyToDelete, setIdFamilyToDelete] = useState(null);
  const onDeleteFamilyClicked = (id) => {
    console.log(id, "idtodelete");
    setIdFamilyToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteFamily({ id: idFamilyToDelete });
      setIsDeleteModalOpen(false); // Close the modal
      if ( response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      }
      else if (response?.data?.message ) {
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

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "40px",
    },
    isAdmin && {
      name: "Family ID",
      selector: (row) => row.id,
      sortable: true,
      width: "210px",
    },

    {
      name: "Name",
      selector: (row) => (
        <div>
          <Link to={`/students/studentsParents/familyDetails/${row._id}`}>
            <div>
              <strong>
                {row.father?.userFullName.userFirstName +
                  " " +
                  row.father?.userFullName.userMiddleName +
                  " " +
                  row.father?.userFullName.userLastName}
              </strong>
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
      width: "180px",
    },
    {
      name: "Children",
      selector: (row) => (
        <div>
          {row.children.map((child) => (
            <Link
              key={child?.child?._id}
              to={`/students/studentsParents/studentDetails/${child?.child?._id}`}
            >
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
      name: "grade",
      selector: (row) => (
        <div>
          {row.children.map((child) => (
            <div>{child?.child?.studentYears[0]?.grade}</div>
          ))}
        </div>
      ),

      sortable: true,
      width: "80px",
    },

    {
      name: "DOB",
      selector: (row) => (
        <div>
          <div>
            {" "}
            {new Date(row.father?.userDob).toLocaleString("en-GB", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </div>
          <div>
            {new Date(row.mother?.userDob).toLocaleString("en-GB", {
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
      selector: (row) => row.familySituation,
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
      width: "120px",
    },
    {
      name: "Address",
      selector: (row) => (
        <div>
          <div>
            <div>{row.father?.userAddress?.house}</div>
            <div>{row.father?.userAddress?.street}</div>
            <div>
              {row.father?.userAddress?.area}{" "}
              {row.father?.userAddress?.postCode}
            </div>
            <div> {row.father?.userAddress?.city}</div>
          </div>
          {row.familySituation !== "Joint" && ( //will not show mother's address if family is joint
            <div>
              <div> {row.mother?.userAddress?.house}</div>
              <div>{row.mother?.userAddress?.street}</div>
              <div>
                {row.mother?.userAddress?.area}{" "}
                {row.mother?.userAddress?.postCode}
              </div>
              <div> {row.mother?.userAddress?.city}</div>
            </div>
          )}
        </div>
      ),
      sortable: true,
      width: "170px",
    },

    {
      name: "Manage",
      cell: (row) => (
        <div className="space-x-1">
          <button
            className="text-sky-700"
            fontSize={20}
            onClick={() =>
              navigate(`/students/studentsParents/familyDetails/${row.id}`)
            }
          >
            <ImProfile className="text-2xl" />
          </button>
          {/* /////////////////////condition is canEdit and not ! of it */}
          {canEdit ? (
            <button
              className="text-amber-300"
              onClick={() =>
                navigate(`/students/studentsParents/editFamily/${row.id}`)
              }
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {isAdmin && canDelete ? (
            <button
              className="text-red-600"
              onClick={() => onDeleteFamilyClicked(row.id)}
            >
              <RiDeleteBin6Line className="text-2xl" />
            </button>
          ) : null}
        </div>
      ),
      ignoreRowClick: true,

      button: true,
    },
  ].filter(Boolean); // Filter out falsy values like `false` or `undefined`

  // Custom header to include the row count
  const tableHeader = (
   
      <h2>
        Families List:
        <span> {filteredFamilies.length} families</span>
      </h2>
  
  );

  let content;

  if (isFamiliesLoading)
    content = (
      <>
        <Students />
        <LoadingStateIcon />
      </>
    );


    //console.log('filtered and success', filteredFamilies)

    content = (
      <>
        <Students />
        <div className="relative h-10 mr-2 ">
          <HiOutlineSearch
            fontSize={20}
            className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="text-sm focus:outline-none active:outline-none mt-1 h-8 w-[24rem] border border-gray-300  px-4 pl-11 pr-4"
          />
        </div>
        <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
          {/* <div>
    <input type="text" placeholder="search" onChange={handleFilter}/>
   </div> */}

          <DataTable
            title={tableHeader}
            columns={column}
            data={filteredFamilies}
            pagination
            // selectableRows
            removableRows
            pageSizeControl
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
            }}
          ></DataTable>
          <div className="cancelSavebuttonsDiv">
            <button
              className="add-button"
              onClick={() => navigate("/students/studentsParents/newFamily/")}
              hidden={!canCreate}
            >
              New Family
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
  
  return content;
};
export default FamiliesList;
