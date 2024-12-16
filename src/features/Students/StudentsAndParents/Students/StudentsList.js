import {
  useUpdateStudentMutation,
  useGetStudentsByYearQuery,
  useDeleteStudentMutation,
} from "./studentsApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import { IoShieldCheckmark, IoShieldCheckmarkOutline,IoDocumentAttachOutline } from "react-icons/io5";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import RegisterModal from "./RegisterModal";
import Students from "../../Students";
import { useDispatch,useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { useState } from "react";
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";
//import RegisterModal from "./RegisterModal";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useGetAttendedSchoolsQuery } from "../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import useAuth from "../../../../hooks/useAuth";
import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import { setStudents } from "./studentsSlice";

import { gradeOptions } from "../../../../config/Constants";

const StudentsList = () => {
  //this is for the academic year selection
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //variables to be used for authorisation
  const { canEdit, canView, canDelete, canCreate,isEmployee ,isParent,isContentManager,isAnimator,isAcademic,isFinance,isHR,isDesk , isDirector ,isManager , isAdmin  } = useAuth();
  
  //filter states
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSchoolName, setSelectedSchoolName] = useState("");
  //selected academicYears
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idStudentToDelete, setIdStudentToDelete] = useState(null); // State to track which document to delete
  //query the students
  const {
    data: students, //the data is renamed students
    isLoading: isStudentsLoading,
    isSuccess: isStudentsSuccess,
    isError: isStudentsError,
    error: studentsError,
  } = useGetStudentsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "studentsList",
    } || {},
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const {
    data: attendedSchoolsList,
    isLoading: isSchoolsLoading,
    isSuccess: isSchoolsSuccess,
    isError: isSchoolsError,
    error: schoolsError,
  } = useGetAttendedSchoolsQuery({ endpointName: "StudentsList" } || {}, {
    //pollingInterval: 60000
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  //initialising the delete Mutation
  const [
    deleteStudent,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteStudentMutation();

  // Function to handle the delete button click
  const onDeleteStudentClicked = (id) => {
    setIdStudentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteStudent({ id: idStudentToDelete });
      setIsDeleteModalOpen(false); // Close the modal
      //console.log(response,'response')

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
      triggerBanner("Failed to delete student. Please try again.", "error");

      console.error("Error deleting:", error);
    }
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdStudentToDelete(null);
  };
  //console.log(students,'stduents')

  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");

  let studentsList = [];
  let filteredStudents = [];

  const attendedSchools = isSchoolsSuccess
    ? Object.values(attendedSchoolsList.entities)
    : [];
  if (isStudentsSuccess) {
    const { entities } = students;

    studentsList = Object.values(entities);
    dispatch(setStudents(studentsList)); //timing issue to update the state and use it the same time

    // Apply filters to the students list
    filteredStudents = studentsList.filter((student) => {
      // Search filter
      const matchesSearch =
        student.studentName?.firstName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        student.studentName?.middleName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        student.studentName?.lastName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Grade filter
      const matchesGrade = selectedGrade
        ? student.studentYears.some(
            (year) =>
              year.academicYear === selectedAcademicYear.title &&
              year.grade === selectedGrade
          )
        : true;

      // School filter
      const matchesSchool = selectedSchoolName
        ? student.studentEducation.some(
            (education) =>
              education.schoolYear === selectedAcademicYear.title &&
              education.attendedSchool?.schoolName === selectedSchoolName
          )
        : true;

      return matchesSearch && matchesGrade && matchesSchool;
    });
  }
  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleGradeChange = (e) => setSelectedGrade(e.target.value);
  const handleSchoolChange = (e) => setSelectedSchoolName(e.target.value);
  // UI component for grade filter dropdown

  // Handler for selecting rows
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
    //console.log('selectedRows', selectedRows)
  };
  //update to be used on registering student
  const [
    updateStudent,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateStudentMutation(); //it will not execute the mutation nownow but when called
  const [studentObject, setStudentObject] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Handler for registering selected row,
  const [studentYears, setStudentYears] = useState([]);
  const handleRegisterSelected = () => {
    //we already allowed only one to be selected in the button options
    setStudentObject(selectedRows[0]);
    setStudentYears(studentObject.studentYears);
    //console.log("student years and id", studentYears);
    setIsRegisterModalOpen(true);
    //setSelectedRows([]); // Clear selection after process
  };

  // This is called when saving the updated student years from the modal
  const onUpdateStudentClicked = async (updatedYears) => {
    const updatedStudentObject = {
      ...studentObject,
      studentYears: updatedYears, // Merge updated studentYears
    };

    try {
      const response = await updateStudent(updatedStudentObject); // Save updated student to backend
      //console.log(response,'response')
      // console.log(updateError,'updateError')
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
      triggerBanner("Failed to update student. Please try again.", "error");

      console.error("Error saving:", error);
    }
    setIsRegisterModalOpen(false); // Close modal
  };

  const column = [
    {
      name: "#",
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
      
    },
    {
      name: "Active",
      selector: (row) => row.studentIsActive,
      cell: (row) => (
        <span>
          {row.studentIsActive ? (
            <IoShieldCheckmark className="text-green-500 text-2xl" />
          ) : (
            <IoShieldCheckmarkOutline className="text-red-600 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      removableRows: true,
      width: "80px",
    },
    isAdmin && {
      name: "ID",
      selector: (row) =>    row.id,
      sortable: true,
      width: "210px",
    },

    {
      name: "Student Name",
      selector: (row) =>
        row.studentName?.firstName +
        " " +
        row.studentName?.middleName +
        " " +
        row.studentName?.lastName,
      sortable: true,
      width: "180px",
      cell: (row) => (
        <Link to={`/students/studentsParents/studentDetails/${row.id}`}>
          {row.studentName?.firstName +
            " " +
            row.studentName?.middleName +
            " " +
            row.studentName?.lastName}
        </Link>
      ),
    },
    {
      name: "Sex",
      selector: (row) => row.studentSex, //changed from userSex
      cell: (row) => (
        <span>
          {row.studentSex === "Male" ? (
            <LiaMaleSolid className="text-sky-700 text-3xl" />
          ) : (
            <LiaFemaleSolid className="text-red-600 text-3xl" />
          )}
        </span>
      ),
      sortable: true,
      removableRows: true,
      width: "70px",
    },
    {
      name: "Grade",
      selector: (row) => {
        // Find the student year where academicYear matches selectedAcademicYear
        const studentYearForSelectedYear = row.studentYears.find(
          (year) => year.academicYear === selectedAcademicYear.title
        );

        // Get the grade from the found student year
        const gradeForSelectedYear = studentYearForSelectedYear?.grade;

        // Return the grade or a fallback value if not found
        return gradeForSelectedYear || "N/A"; // Display 'N/A' if no grade is found
      },
      sortable: true,
      width: "80px",
    },

    {
      name: "School",
      selector: (row) => {
        const studentYearForSelectedYear = row.studentEducation.find(
          (year) => year.schoolYear === selectedAcademicYear.title
        );
        const schoolForSelectedYear =
          studentYearForSelectedYear?.attendedSchool.schoolName;

        // Return the grade or a fallback value if not found
        return schoolForSelectedYear || "N/A";
      },

      sortable: true,
      width: "160px",
    },
    {
      name: "DOB",
      selector: (row) =>
        new Date(row.studentDob).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),

      sortable: true,
      width: "100px",
    },

    {
      name: "Admissions",

      selector: (row) => (
        <div>
          {row.studentYears.map((year) => (
            <Link to={`/students/admissions/admissionDetails/${row.id}`}>
              {" "}
              <div key={year.academicYear}>{year.academicYear}</div>
            </Link>
          ))}
        </div>
      ),
      sortable: true,
      removableRows: true,
      width: "110px",
    },
    (isAcademic|| isDesk ||isDirector||isManager || isAdmin) &&{
      name: "Documents",
      selector: (row) => (
        <Link to={`/students/studentsParents/studentDocumentsList/${row.id}`} aria-label="students documents">
          {" "}
          <IoDocumentAttachOutline className="text-fuchsia-500 text-2xl" />
        </Link>
      ),
      sortable: true,
      removableRows: true,
      width: "120px",
    },

    (isAcademic|| isDesk ||isDirector||isManager || isAdmin) &&{
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          <button
            className="text-sky-700"
            aria-label="student Details"
            fontSize={20}
            onClick={() =>
              navigate(`/students/studentsParents/studentDetails/${row.id}`)
            }
            hidden={!canView}
          >
            <ImProfile className="text-2xl" />
          </button>
         
            <button
              className="text-amber-300"
              aria-label="edit student"
              onClick={() =>
                navigate(`/students/studentsParents/editStudent/${row.id}`)
              }
              hidden={!canEdit}
            >
              <FiEdit className="text-2xl" />
            </button>
         
          {!isDelLoading && (
            <button
              className="text-red-600"
              aria-label="delete student"
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
        Students List:
        <span> {filteredStudents.length} students</span>
      </h2>
    
  );

  //console.log(filteredStudents, "filteredStudents");
  let content;
  if (isStudentsLoading)
    content = (
      <>
        <Students />
        <LoadingStateIcon />
      </>
    );
  if (isStudentsError || isSchoolsError) {
    content = (
      <>
        <Students />
        <div className="error-bar">
          {studentsError?.data?.message && <p>{studentsError.data.message}</p>}
          {schoolsError?.data?.message && <p>{schoolsError.data.message}</p>}
        </div>
      </>
    );
  }
  if (isStudentsSuccess || filteredStudents?.length > 0) {
    content = (
      <>
        <Students />
        <div className="flex space-x-2 items-center">
          {/* Search Bar */}
          <div className="relative h-10 mr-2 ">
            <HiOutlineSearch
              fontSize={20}
              className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
              aria-label="search students"
            />
            <input
            aria-label="search students"
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="text-sm focus:outline-none active:outline-none mt-1 h-8 w-[24rem] border border-gray-300  px-4 pl-11 pr-4"
            />
          </div>
          {/* Grade Filter Dropdown */}
          <select
            value={selectedGrade}
            onChange={handleGradeChange}
            className="text-sm h-8 border border-gray-300  px-4"
            aria-label="filter by grade"
          >
            <option value="">All Grades</option>
            {gradeOptions.map((grade) => (
              <option key={grade} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>
          {/* Attended school selection dropdown */}
          <select
            value={selectedSchoolName}
            onChange={handleSchoolChange}
            className="text-sm h-8 border border-gray-300  px-4"
            aria-label="filter by school"
          >
            <option value="">All Schools</option>
            {attendedSchools?.map(
              (school) =>
                school.schoolName !== "First Steps" && (
                  <option key={school.id} value={school.schoolName}>
                    {school.schoolName}
                  </option>
                )
            )}
          </select>
        </div>

        <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
          <DataTable
          
            title={tableHeader}
            columns={column}
            data={filteredStudents}
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
                  color:'black'
                },
              },
              header: {
                icon: {
                  color: 'red', // Set sorting indicator color to black
                },
              },
              cells: {
                style: {
                  justifyContent: 'center', // Center cell content
                  textAlign: 'center',
                  color:'black',
                },
              },
            }}
          ></DataTable>
          {(isAcademic|| isDesk ||isDirector||isManager || isAdmin) &&<div className="flex justify-end items-center space-x-4">
            <button
              className="add-button"
              onClick={() => navigate("/students/studentsParents/newStudent/")}
              // disabled={selectedRows.length !== 1} // Disable if no rows are selected
              hidden={!canCreate}
              aria-label="add student"
            >
              New Student
            </button>
            <button
              className={`px-4 py-2 ${
                selectedRows?.length === 1 ? "add-button" : "bg-gray-300"
              } text-white rounded`}
              onClick={handleRegisterSelected}
              disabled={selectedRows?.length !== 1} // Disable if no rows are selected
              hidden={!canCreate}
               aria-label="register student"
            >
              Register
            </button>
          </div>}
        </div>
        <DeletionConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
        <RegisterModal //will allow to add or remove studetnYEars
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          studentYears={studentYears}
          studentObject={studentObject}
          setStudentObject={setStudentObject}
          setStudentYears={setStudentYears}
          academicYears={academicYears}
          onSave={onUpdateStudentClicked}
        />
      </>
    );
  }
  return content;
};
export default StudentsList;
