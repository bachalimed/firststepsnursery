import {
  useGetSectionsByYearQuery,
} from "./sectionsApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import Academics from "../Academics";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
//import RegisterModal from "./RegisterModal";

const SchoolSectionsList = () => {
  useEffect(()=>{document.title="School Sections List"})


  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object

  const {
    data: sections, //the data is renamed sections
    isLoading: isSectionsLoading,
    isSuccess: isSectionsSuccess,
    // isError: isSectionsError,
    // error: sectionsError,
  } = useGetSectionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "forSchoolSections", // this will arrange the data by school
      endpointName: "schoolSectionsList",
    } || {},
    {
      //pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredSchoolSections, setFilteredSchoolSections] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  const [currentSectionsFilter, setCurrentSectionsFilter] = useState(false);
  let schoolSectionsList = [];
  let filteredSchoolSections = [];
  if (isSectionsSuccess) {
    //set to the state to be used for other component s and edit section component

    const { entities } = sections;

    //we need to change into array to be read??
    schoolSectionsList = Object.values(entities); //we are using entity adapter in this query
    //dispatch(setSections(schoolSectionsList)); //timing issue to update the state and use it the same time

    //the serach result data
    // Filter sections based on search query, including student names
    filteredSchoolSections = schoolSectionsList?.filter((school) => {
      // Check sectionTo validity for the current school if filtering is active
      const sectionToIsValid =
        !currentSectionsFilter ||
        school.students?.some(
          (student) =>
            student.sectionTo !== undefined && student.sectionTo !== null
        );

      // Check if the school's name matches the search query
      const schoolNameMatches = school?.schoolName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Check if any student in the school matches the search query
      const studentMatches = school.students?.some((student) => {
        const firstNameMatch = student?.studentName?.firstName
          ?.toLowerCase()
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
  //console.log(filteredSchoolSections, "filteredSchoolSections");
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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
      width: "220px",
    },

    {
      name: "Section Label",
      selector: (row) => (
        <div>
          {row.students.map((student) => (
            <div key={student._id}>{student.sectionLabel}</div>
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
      style: {
        justifyContent: "left",
        textAlign: "left",
      },
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
  ].filter(Boolean); // Filter out falsy values like `false` or `undefined`
  // Custom header to include the row count
  const tableHeader = (
    <h2>
      Sections list:
      <span> {filteredSchoolSections?.length} sections</span>
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
  // if (isSectionsSuccess)
    content = (
      <>
        <Academics />
        <div className="flex space-x-2 items-center ml-3">
          <div className="relative h-10 mr-2 ">
            <HiOutlineSearch
              fontSize={20}
              className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
              aria-label="search sections"
            />
            <input
              aria-label="search sections"
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="serachQuery"
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
              data={filteredSchoolSections}
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
        </div>
      </>
    );

  return content;
};
export default SchoolSectionsList;
