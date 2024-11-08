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
import Sections from "../Sections";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";

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
    isLoading, //monitor several situations is loading...
    isSuccess,
    isError,
    error,
  } = useGetSectionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "withAnimators",
      endpointName: "sectionsList",
    } || {},
    {
      //this param will be passed in req.params to select only sections for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000, //will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
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
  let sectionsList = [];
  let filteredSections = [];
  if (isSuccess) {
    //set to the state to be used for other component s and edit section component

    const { entities } = sections;

    //we need to change into array to be read??
    sectionsList = Object.values(entities); //we are using entity adapter in this query
    //dispatch(setSections(sectionsList)); //timing issue to update the state and use it the same time

    //the serach result data
    // Filter sections based on search query, including student names
    filteredSections = sectionsList?.filter((section) => {
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
        const schoolNameMatch = student?.studentEducation?.attendedSchool?.schoolName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
    
        return firstNameMatch || middleNameMatch || lastNameMatch || schoolNameMatch;
      });
    
      // Return true if either the section fields or student names/education match the search query
      return sectionMatches || studentMatches;
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

  // This is called when saving the updated section years from the modal
  const onUpdateSectionClicked = async (updatedYears) => {
    //console.log("Updated sectionYears from modal:", updatedYears);

    const updatedSectionObject = {
      ...sectionObject,
      sectionYears: updatedYears, // Merge updated sectionYears
    };

    //console.log("Saving updated section:", updatedSectionObject);

    try {
      await updateSection(updatedSectionObject); // Save updated section to backend
      console.log("Section updated successfully");
    } catch (error) {
      console.log("Error saving section:", error);
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
            {new Date(row.sectionTo).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
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
            className="text-blue-500"
            fontSize={20}
            onClick={() =>
              navigate(`/sections/sectionsParents/sectionDetails/${row.id}`)
            }
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() =>
                navigate(`/sections/sectionsParents/editSection/${row.id}`)
              }
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {/* {canDelete && (
              <button
                className="text-red-500"
                onClick={() => onDeleteSectionClicked(row.id)}
              >
                <RiDeleteBin6Line className="text-2xl" />
              </button>
            )} */}
        </div>
      ),
      ignoreRowClick: true,

      button: true,
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
      <Sections />

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
          data={filteredSections}
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
            onClick={() => navigate("/academics/sections/newSection/")}
            disabled={selectedRows.length !== 1} // Disable if no rows are selected
            hidden={!canCreate}
          >
            New Section
          </button>

          <button
            className="px-3 py-2 bg-yellow-400 text-white rounded"
            onClick={handleRegisterSelected}
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
  //}
  return content;
};
export default NurserySectionsList;
