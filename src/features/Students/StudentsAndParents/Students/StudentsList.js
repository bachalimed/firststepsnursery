import {
  useUpdateStudentMutation,
  useGetStudentsByYearQuery,
  useDeleteStudentMutation,
} from "./studentsApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import { IoShieldCheckmark, IoShieldCheckmarkOutline } from "react-icons/io5";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import RegisterModal from "./RegisterModal";
import Students from "../../Students";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { useGetStudentDocumentsByYearByIdQuery } from "../../../AppSettings/StudentsSet/StudentDocumentsLists/studentDocumentsListsApiSlice";
import { useSelector } from "react-redux";
import { selectAllStudentsByYear, selectAllStudents } from "./studentsApiSlice"; //use the memoized selector
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";
//import RegisterModal from "./RegisterModal";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { setAcademicYears } from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetAttendedSchoolsQuery } from "../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import useAuth from "../../../../hooks/useAuth";
import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import {
  setSomeStudents,
  setStudents,
  currentStudentsList,
} from "./studentsSlice";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { gradeOptions } from "../../../../config/Constants";
const StudentsList = () => {

  //this is for the academic year selection
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //variables to be used for authorisation
  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();
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
    isLoading:isStudentsLoading, //monitor several situations is loading...
    isSuccess:isStudentsSuccess,
    isError:isStudentsError,
    error:studentsError,
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
    isLoading: schoolIsLoading,
    isSuccess: schoolIsSuccess,
    isError: schoolIsError,
    error: schoolError,
  } = useGetAttendedSchoolsQuery({ endpointName: "StudentsList" } || {}, {
    //pollingInterval: 60000
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  //initialising the delete Mutation
  const [
    deleteStudent,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteStudentMutation();

  // Function to handle the delete button click
  const onDeleteStudentClicked = (id) => {
    setIdStudentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deleteStudent({ id: idStudentToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdStudentToDelete(null);
  };

  // const myStu = useSelector(state=> state.student)
  // console.log(myStu, 'mystu')

  //const allStudents = useSelector(selectAllStudents)// not the same cache list we re looking for this is from getstudents query and not getstudentbyyear wuery

  //console.log('allStudents from the state by year',allStudents)
  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");

  let studentsList = [];
  let filteredStudents = [];

  const attendedSchools = schoolIsSuccess
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
      await updateStudent(updatedStudentObject); // Save updated student to backend
      console.log("Student updated successfully");
    } catch (error) {
      console.log("Error saving student:", error);
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
            <IoShieldCheckmarkOutline className="text-red-500 text-2xl" />
          )}
        </span>
      ),
      sortable: true,
      removableRows: true,
      width: "80px",
    },
    isAdmin && {
      name: "ID",
      selector: (row) => (
        <Link to={`/students/studentsParents/studentDetails/${row.id}`}>
          {row.id}{" "}
        </Link>
      ),
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
      width: "200px",
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
            <LiaMaleSolid className="text-blue-500 text-3xl" />
          ) : (
            <LiaFemaleSolid className="text-rose-500 text-3xl" />
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
      width: "180px",
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
    {
      name: "Documents",
      selector: (row) => (
        <Link to={`/students/studentsParents/studentDocumentsList/${row.id}`}>
          {" "}
          <IoDocumentAttachOutline className="text-slate-800 text-2xl" />
        </Link>
      ),
      sortable: true,
      removableRows: true,
      width: "120px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          <button
            className="text-blue-500"
            fontSize={20}
            onClick={() =>
              navigate(`/students/studentsParents/studentDetails/${row.id}`)
            }
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() =>
                navigate(`/students/studentsParents/editStudent/${row.id}`)
              }
            >
              <FiEdit className="text-2xl" />
            </button>
          ) : null}
          {canDelete && !isDelLoading && (
            <button
              className="text-red-500"
              onClick={() => onDeleteStudentClicked(row.id)}
            >
              <RiDeleteBin6Line className="text-2xl" />
            </button>
          )}
        </div>
      ),
      ignoreRowClick: true,

      button: true,
    },
  ];

  // Custom header to include the row count
  const tableHeader = (
    <div>
      <h2>
        Students List:
        <span> {filteredStudents.length} students</span>
      </h2>
    </div>
  );

  //console.log(filteredStudents, "filteredStudents");
  let content;
  if (isStudentsLoading) content = <LoadingStateIcon />;
  if (isStudentsError) {
    content = <p className="errmsg">{studentsError?.data?.message}</p>; //errormessage class defined in the css, the error has data and inside we have message of error
  }
  if (isStudentsSuccess || filteredStudents?.length>0){

  content = (
    <>
      <Students />
      <div className="flex space-x-2 items-center">
        {/* Search Bar */}
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
        {/* Grade Filter Dropdown */}
        <select
          value={selectedGrade}
          onChange={handleGradeChange}
          className="text-sm h-8 border border-gray-300 rounded-md px-4"
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
          className="text-sm h-8 border border-gray-300 rounded-md px-4"
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
        <div className="flex justify-end items-center space-x-4">
          <button
            className="px-3 py-2 bg-green-500 text-white rounded"
            onClick={() => navigate("/students/studentsParents/newStudent/")}
            // disabled={selectedRows.length !== 1} // Disable if no rows are selected
            hidden={!canCreate}
          >
            New Student
          </button>
          <button
            className={`px-4 py-2 ${
              selectedRows?.length === 1 ? "bg-teal-500" : "bg-gray-500"
            } text-white rounded`}
            onClick={handleRegisterSelected}
            disabled={selectedRows?.length !== 1} // Disable if no rows are selected
            hidden={!canCreate}
          >
            Register
          </button>
        </div>
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
