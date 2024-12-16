import {
  useGetSectionsQuery,
  useUpdateSectionMutation,
  useGetSectionsByYearQuery,
  useDeleteSectionMutation,
} from "./sectionsApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import RegisterModal from "./RegisterModal";
import Academics from "../Academics";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllSectionsByYear, selectAllSections } from "./sectionsApiSlice"; //use the memoized selector
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
//import RegisterModal from "./RegisterModal";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { setAcademicYears } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";

import useAuth from "../../../hooks/useAuth";

import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import {
  setSomeSections,
  setSections,
  currentSectionsList,
} from "./sectionsSlice";
import { IoDocumentAttachOutline } from "react-icons/io5";

const NurserySectionsList = () => {
  //this is for the academic year selection
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  // useEffect(() => {
  //     if (selectedAcademicYearId) {
  //         // Fetch the sections for the selected academic year, if required
  //         console.log('Fetch sections for academic year Id:', selectedAcademicYearId);
  //     }
  // }, [selectedAcademicYearId]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idSectionToDelete, setIdSectionToDelete] = useState(null); // State to track which document to delete

  //console.log("Fetch sections for academic year:", selectedAcademicYear);
  const {
    data: sections, //the data is renamed sections
    isLoading: isSectionsLoading,
    isSuccess: isSectionsSuccess,
    isError: isSectionsError,
    error: sectionsError,
  } = useGetSectionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "withAnimators",
      endpointName: "NurserySectionsList",
    } || {},
    {
      //pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //const allSections = useSelector(selectAllSections)// not the same cache list we re looking for this is from getsections query and not getsectionbyyear wuery

  //console.log('allSections from the state by year',allSections)
  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredSections, setFilteredSections] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  const [currentSectionsFilter, setCurrentSectionsFilter] = useState(false);
  let sectionsList = [];
  let filteredSections = [];
  if (isSectionsSuccess) {
    //set to the state to be used for other component s and edit section component

    const { entities } = sections;

    //we need to change into array to be read??
    sectionsList = Object.values(entities); //we are using entity adapter in this query
    //dispatch(setSections(sectionsList)); //timing issue to update the state and use it the same time

    //the serach result data
    // Filter sections based on search query, including student names
    filteredSections = sectionsList?.filter((section) => {
      // Apply filter for sectionTo if needed
      const sectionToIsValid =
        !currentSectionsFilter ||
        section.sectionTo === undefined ||
        section.sectionTo === null;

      // Check section fields for search query
      const sectionMatches = Object.values(section).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Check student details for search query
      const studentMatches = section.students?.some((student) => {
        const firstNameMatch = student?.studentName?.firstName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const middleNameMatch = student?.studentName?.middleName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const lastNameMatch = student?.studentName?.lastName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

        // Check studentEducation.attendedSchool.schoolName
        const schoolNameMatch =
          student?.studentEducation?.attendedSchool?.schoolName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());

        return (
          firstNameMatch || middleNameMatch || lastNameMatch || schoolNameMatch
        );
      });

      // Return true if section matches search query, student matches search query, and sectionTo is valid
      return (sectionMatches || studentMatches) && sectionToIsValid;
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
    updateSection,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateSectionMutation(); //it will not execute the mutation nownow but when called
  const [sectionObject, setSectionObject] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  //console.log(academicYears)
  // Handler for registering selected row,
  const [sectionYears, setSectionYears] = useState([]);
  const handleRegisterSelected = () => {
    //we already allowed only one to be selected in the button options
    //console.log('Selected Rows to detail:', selectedRows)

    setSectionObject(selectedRows[0]);
    //console.log(sectionObject, "sectionObject");
    //const {sectionYears}= (sectionObject)

    setSectionYears(sectionObject.sectionYears);
    //console.log("section years and id", sectionYears);
    setIsRegisterModalOpen(true);

    //setSelectedRows([]); // Clear selection after process
  };
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  // This is called when saving the updated section years from the modal
  const onUpdateSectionClicked = async (updatedYears) => {
    //console.log("Updated sectionYears from modal:", updatedYears);

    const updatedSectionObject = {
      ...sectionObject,
      sectionYears: updatedYears, // Merge updated sectionYears
    };

    //console.log("Saving updated section:", updatedSectionObject);

    try {
      const response = await updateSection(updatedSectionObject); // Save updated section to backend
      console.log("Section updated successfully");
     if ((response.data && response.data.message) || response?.message) {
        // Success response
        triggerBanner(response?.data?.message || response?.message, "success");
      } else if (
        response?.error &&
        response?.error?.data &&
        response?.error?.data?.message
      ) {
        // Error response
        triggerBanner(response.error.data.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner("Failed to update section. Please try again.", "error");

      console.error("Error saving:", error);
    }

    setIsRegisterModalOpen(false); // Close modal
  };

  //const [sectionYears, setSectionYears] = useState([])
  //adds to the previous entries in arrays for gardien, schools...
  const onSectionYearsChanged = (e, selectedYear) => {
    if (e.target.checked) {
      // Add the selectedYear to sectionYears if it's checked
      setSectionYears([...sectionYears, selectedYear]);
    } else {
      // Remove the selectedYear from sectionYears if it's unchecked
      setSectionYears(sectionYears.filter((year) => year !== selectedYear));
    }
  };

  //initialising the delete Mutation
  const [
    deleteSection,
    {
      isLoading: isDelSectionLoading,
      isSuccess: isDelSectionSuccess,
      isError: isDelSectionError,
      error: delSectionError,
    },
  ] = useDeleteSectionMutation();

  // Function to handle the delete button click
  const onDeleteStudentClicked = (id) => {
    setIdSectionToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteSection({ id: idSectionToDelete });
     if ((response.data && response.data.message) || response?.message) {
        // Success response
        triggerBanner(response?.data?.message || response?.message, "success");
      } else if (
        response?.error &&
        response?.error?.data &&
        response?.error?.data?.message
      ) {
        // Error response
        triggerBanner(response.error.data.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner("Failed to delete section. Please try again.", "error");

      console.error("Error saving:", error);
    }
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdSectionToDelete(null);
  };

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },
    //show this column only if user is a parent and not employee

    // isAdmin && {
    //   name: "ID",
    //   selector: (row) => (
    //     <Link to={`/sections/sectionsParents/sectionDetails/${row.id}`}>
    //       {row.id}{" "}
    //     </Link>
    //   ),
    //   sortable: true,
    //   width: "200px",
    // },

    {
      name: "Label",
      selector: (row) => row?.sectionLabel,
      sortable: true,
      width: "120px",
      cell: (row) => (
        <Link to={`/sections/sectionDetails/${row.id}`}>
          {row?.sectionLabel}
        </Link>
      ),
    },
    {
      name: "Count",
      selector: (row) => row?.students.length,
      sortable: true,
      width: "80px",
    },
    {
      name: "Students",
      selector: (row) => (
        <div>
          {row.students.map((student) => (
            <div key={student._id}>
              {student?.studentName?.firstName}{" "}
              {student?.studentName?.middleName}{" "}
              {student?.studentName?.lastName}
            </div>
          ))}
        </div>
      ),
      sortable: true,
      width: "220px",
    },
    {
      name: "School",
      selector: (row) => (
        <div>
          {row.students.map((student) => (
            <div key={student._id}>
              {student?.studentEducation?.attendedSchool?.schoolName || ""}
            </div>
          ))}
        </div>
      ),
      sortable: true,
      width: "150px",
    },
    {
      name: "Animator",
      selector: (row) =>
        `${row?.sectionAnimator?.userFullName?.userFirstName} ${row?.sectionAnimator?.userFullName?.userMiddleName} ${row?.sectionAnimator?.userFullName?.userLastName}`.trim(),
      sortable: true,
      width: "190px",
    },
    {
      name: "Type",
      selector: (row) => row?.sectionType,
      sortable: true,
      width: "100px",
    },

    {
      name: "Classroom",
      selector: (row) =>
        row?.sectionLocation?.classroomNumber +
        " " +
        row?.sectionLocation?.classroomLabel,
      sortable: true,
      width: "180px",
    },

    {
      name: "Section Formed",
      selector: (row) => (
        <div>
          <div>
            Fr{" "}
            {new Date(row.sectionFrom).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
          <div>
            To{" "}
            {row.sectionTo
              ? new Date(row.sectionTo).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "present"}
          </div>
        </div>
      ),
      sortable: true,
      width: "180px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          <button
            className="text-sky-700"
            fontSize={20}
            onClick={() =>
              navigate(`/academics/sections/SectionDetails/${row.id}`)
            }
          >
            <ImProfile className="text-2xl" />
          </button>
          {!row.sectionTo && canEdit ? (
            <button
              className="text-amber-300"
              onClick={() =>
                navigate(`/academics/sections/editSection/${row.id}`)
              }
              hidden={!canEdit}
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}

          {canDelete && (
            <button
              className="text-red-600"
              onClick={() => onDeleteStudentClicked(row.id)}
              hidden={!canDelete}
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
  // Custom header to include the row count
  const tableHeader = (
   
      <h2>
        Sections List:
        <span> {filteredSections.length} sections</span>
      </h2>
  
  );

  let content;
  if (isSectionsLoading) content = <LoadingStateIcon />;
  if (isSectionsError) {
    content = (
      <>
        <Academics />
        <div className="error-bar">{sectionsError?.data?.message}</div>
      </>
    );
  }
  if (isSectionsSuccess) {
    content = (
      <>
        <Academics />
        <div className="flex space-x-2 items-center ml-3">
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
          <button
            onClick={() => setCurrentSectionsFilter((prev) => !prev)}
            className="ml-2 p-2 bg-gray-200 rounded hover:text-blue-600"
          >
            {currentSectionsFilter
              ? "Current Sections Shown"
              : "All Sections Shown"}
          </button>
        </div>

        <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
          <DataTable
            title={tableHeader}
            columns={column}
            data={filteredSections}
            pagination
            selectableRows
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
              cells: {
                style: {
                  justifyContent: 'center', // Center cell content
                  textAlign: 'center',
                },
              },
            }}
          ></DataTable>
          <div className="flex justify-end items-center space-x-4">
            {isAdmin && (
              <button
                className="add-button"
                onClick={() => navigate("/academics/sections/newSection/")}
                //disabled={selectedRows.length !== 1} // Disable if no rows are selected
                hidden={!canCreate}
              >
                New Section
              </button>
            )}
          </div>
        </div>
        <DeletionConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          sectionYears={sectionYears}
          sectionObject={sectionObject}
          setSectionObject={setSectionObject}
          setSectionYears={setSectionYears}
          academicYears={academicYears}
          onSave={onUpdateSectionClicked}
        />
      </>
    );
  }
  return content;
};
export default NurserySectionsList;
