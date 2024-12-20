import {
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
import DataTable from "react-data-table-component";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import DeletionConfirmModal from "../../../Components/Shared/Modals/DeletionConfirmModal";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import useAuth from "../../../hooks/useAuth";

const NurserySectionsList = () => {
  //this is for the academic year selection
  const navigate = useNavigate();

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
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

  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");

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
      if (response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      } else if (response?.data?.message) {
        // Success response
        triggerBanner(response?.data?.message, "success");
      } else if (response?.error?.data?.message) {
        // Error response
        triggerBanner(response?.error?.data?.message, "error");
      } else if (isUpdateError) {
        // In case of unexpected response format
        triggerBanner(updateError?.data?.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner(error?.data?.message, "error");
    }
    setIsRegisterModalOpen(false); // Close modal
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
      if (response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      } else if (response?.data?.message) {
        // Success response
        triggerBanner(response?.data?.message, "success");
      } else if (response?.error?.data?.message) {
        // Error response
        triggerBanner(response?.error?.data?.message, "error");
      } else if (isDelSectionError) {
        // In case of unexpected response format
        triggerBanner(delSectionError?.data?.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner(error?.data?.message, "error");
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
      width: "40px",
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
      width: "90px",
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
      width: "90px",
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
      style: {
        justifyContent: "left",
        textAlign: "left",
      
      },
      
      sortable: true,
      width: "230px",
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
      style: {
        justifyContent: "left",
        textAlign: "left",
      
      },
      sortable: true,
      width: "160px",
    },
    {
      name: "Animator",
      selector: (row) =>
        `${row?.sectionAnimator?.userFullName?.userFirstName} ${row?.sectionAnimator?.userFullName?.userMiddleName} ${row?.sectionAnimator?.userFullName?.userLastName}`.trim(),
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      
      },
      width: "230",
    },
    {
      name: "Type",
      selector: (row) => row?.sectionType,
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      
      },
      width: "110px",
    },

    {
      name: "Classroom",
      selector: (row) =>
        row?.sectionLocation?.classroomNumber +
        " " +
        row?.sectionLocation?.classroomLabel,
      sortable: true,
      style: {
        justifyContent: "left",
        textAlign: "left",
      
      },
      width: "160px",
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
      style: {
        justifyContent: "left",
        textAlign: "left",
      
      },
      sortable: true,
      width: "150px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          <button
            aria-label="section details"
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
              aria-label="edit section"
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
              aria-label="delete section"
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
  if (isSectionsLoading)
    content = (
      <>
        <Academics />
        <LoadingStateIcon />
      </>
    );

  content = (
    <>
      <Academics />
      <div className="flex space-x-2 items-center ml-3 ">
        <div className="relative h-10 mr-2 ">
          <HiOutlineSearch
            fontSize={20}
            className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
          />
          <input
            aria-label="searchFilter"
            id="searchFilter"
            name="searchFilter"
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="text-sm focus:outline-none active:outline-none mt-1 h-8 w-[24rem] border border-gray-300  px-4 pl-11 pr-4"
          />
        </div>
        <button
          aria-label="current section filter"
          onClick={() => setCurrentSectionsFilter((prev) => !prev)}
          className="text-sm h-8 border border-gray-300  px-4"
        >
          {currentSectionsFilter
            ? "Current Sections Shown"
            : "All Sections Shown"}
        </button>
      </div>

      <div className="dataTableContainer">
        <div>
          <DataTable
            title={tableHeader}
            columns={column}
            data={filteredSections}
            pagination
            //selectableRows
            removableRows
            pageSizeControl
            //onSelectedRowsChange={handleRowSelected}
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

  return content;
};
export default NurserySectionsList;
