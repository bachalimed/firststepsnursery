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

const SchoolSectionsList = () => {
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
      criteria: "forSchoolSections", // this will arrange the data by school
      endpointName: "schoolSectionsList",
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
  //const [filteredSchoolSections, setFilteredSchoolSections] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  const [currentSectionsFilter, setCurrentSectionsFilter] = useState(false);
  let schoolSectionsList = [];
  let filteredSchoolSections = [];
  if (isSuccess) {
    //set to the state to be used for other component s and edit section component

    const { entities } = sections;

    //we need to change into array to be read??
    schoolSectionsList = Object.values(entities); //we are using entity adapter in this query
    //dispatch(setSections(schoolSectionsList)); //timing issue to update the state and use it the same time

    //the serach result data
    // Filter sections based on search query, including student names
    filteredSchoolSections = schoolSectionsList?.filter((school) => {
      // Check sectionTo validity for the current school if filtering is active
      const sectionToIsValid = !currentSectionsFilter || 
        school.students?.some(student => student.sectionTo !== undefined && student.sectionTo !== null);
    
      // Check if the school's name matches the search query
      const schoolNameMatches = school.schoolName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    
      // Check if any student in the school matches the search query
      const studentMatches = school.students?.some((student) => {
        const firstNameMatch = student?.studentName?.firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const middleNameMatch = student?.studentName?.middleName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const lastNameMatch = student?.studentName?.lastName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
    
        // Check additional fields like section label, classroom label, etc.
        const sectionLabelMatch = student?.sectionLabel
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const classroomLabelMatch = student?.classroomLabel
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
    
        // Return true if any student fields match the search query
        return (
          firstNameMatch ||
          middleNameMatch ||
          lastNameMatch ||
          sectionLabelMatch ||
          classroomLabelMatch
        );
      });
    
      // Return true if either the school name or any student fields match the search query, and sectionTo is valid for the current school
      return (schoolNameMatches || studentMatches) && sectionToIsValid;
    });

  }
console.log(filteredSchoolSections,'filteredSchoolSections')
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
      name: "School Name",
      selector: (row) => row?.schoolName,
      sortable: true,
      width: "150px",
     
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
      name: "Count",
      selector: (row) => row?.students.length,
      sortable: true,
      width: "80px",
    },
    {
      name: "Section Label",
      selector: (row) => (
        <div>
          {row.students.map((student) => (
            <div key={student._id}>
              {student.sectionLabel} 
            </div>
          ))}
        </div>
      ),
      sortable: true,
      width: "120px",
    },
    {
      name: "Classroom",
      selector: (row) => (
        <div>
          {row.students.map((student) => (
            <div key={student._id}>
              {student.classroomNumber} {student.classroomLabel}
            </div>
          ))}
        </div>
      ),
      sortable: true,
      width: "180px",
    },
    

    // {
    //   name: "Section Formed",
    //   selector: (row) => (
    //     <div>
    //       {row.students.map((student) => (
    //         <div key={student._id}>
    //           Fr{" "}
    //           {new Date(student.sectionFrom).toLocaleDateString("en-GB", {
    //             year: "numeric",
    //             month: "2-digit",
    //             day: "2-digit",
    //           })}{" "}
    //           To{" "}
    //           {student.sectionTo
    //             ? new Date(student.sectionTo).toLocaleDateString("en-GB", {
    //                 year: "numeric",
    //                 month: "2-digit",
    //                 day: "2-digit",
    //               })
    //             : "present"}
    //         </div>
    //       ))}
    //     </div>
    //   ),

    //   sortable: true,
    //   width: "220px",
    // },
  ];
    // Custom header to include the row count
    const tableHeader = (
      <div>
        <h2>Users List: 
        <span> {filteredSchoolSections.length} users</span></h2>
      </div>
    );
  let content;
  if (isLoading) content = <LoadingStateIcon />;
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>; //errormessage class defined in the css, the error has data and inside we have message of error
  }
  //if (isSuccess){

  content = (
    <>
      <Academics />
      <div className="flex space-x-2 items-center">
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
          data={filteredSchoolSections}
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
                justifyContent: 'center', // Align headers to the center
                textAlign: 'center', // Center header text
              },
            },
            // cells: {
            //   style: {
            //     justifyContent: 'center', // Center cell content
            //     textAlign: 'center',
            //   },
            // },
          }}
        ></DataTable>
      </div>
    </>
  );
  //}
  return content;
};
export default SchoolSectionsList;
