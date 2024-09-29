import {
  useGetStudentsQuery,
  useUpdateStudentMutation,
  useGetStudentsByYearQuery,
  useDeleteStudentMutation,
} from "./studentsApiSlice";
import { HiOutlineSearch } from "react-icons/hi";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";

import StudentsParents from "../../StudentsParents";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { useGetStudentDocumentsByYearByIdQuery } from "../../../AppSettings/StudentsSet/StudentDocumentsLists/studentDocumentsListsApiSlice";
import { useSelector } from "react-redux";
import { selectAllStudentsByYear, selectAllStudents } from "./studentsApiSlice"; //use the memoized selector
import { useEffect, useState } from "react";
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";
import RegisterModal from "./RegisterModal";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { setAcademicYears } from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";

import useAuth from "../../../../hooks/useAuth";

import { LiaMaleSolid, LiaFemaleSolid } from "react-icons/lia";
import {
  setSomeStudents,
  setStudents,
  currentStudentsList,
} from "./studentsSlice";
import { IoDocumentAttachOutline } from "react-icons/io5";

const StudentsList = () => {
  //this is for the academic year selection
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const { canEdit, isAdmin, canDelete, canCreate, status2 } = useAuth();
  const [requiredDocNumber, setRequiredDocNumber] = useState("");
  const [studentDocNumber, setStudentDocNumber] = useState("");

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idStudentToDelete, setIdStudentToDelete] = useState(null); // State to track which document to delete

  //console.log("Fetch students for academic year:", selectedAcademicYear);
  const {
    data: students, //the data is renamed students
    isLoading, //monitor several situations is loading...
    isSuccess,
    isError,
    error,
  } = useGetStudentsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "studentsList",
    } || {},
    {
      //this param will be passed in req.params to select only students for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

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
    setIdStudentToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
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

  //this ensures teh selected year is chosen before running hte useeffect it is working perfectly to dispaptch the selected year
  // useEffect(() => {
  //   if (selectedAcademicYear?.title) {
  //     setSelectedYear(selectedAcademicYear.title);
  //     //console.log('Selected year updated:', selectedAcademicYear.title)
  //   }
  // }, [selectedAcademicYear]);
  //console.log('selectedAcademicYear',selectedAcademicYear)

  // const myStu = useSelector(state=> state.student)
  // console.log(myStu, 'mystu')

  //const allStudents = useSelector(selectAllStudents)// not the same cache list we re looking for this is from getstudents query and not getstudentbyyear wuery

  //console.log('allStudents from the state by year',allStudents)
  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  //state to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredStudents, setFilteredStudents] = useState([])
  //we need to declare the variable outside of if statement to be able to use it outside later
  let studentsList = [];
  let filteredStudents = [];
  if (isSuccess) {
    //set to the state to be used for other component s and edit student component

    const { entities } = students;

    //we need to change into array to be read??
    studentsList = Object.values(entities); //we are using entity adapter in this query
    dispatch(setStudents(studentsList)); //timing issue to update the state and use it the same time

    //the serach result data
    filteredStudents = studentsList?.filter((item) => {
      //the nested objects need extra logic to separate them
      const firstNameMatch = item?.studentName?.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const middleNameMatch = item?.studentName?.middleName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const lastNameMatch = item?.studentName?.lastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      //console.log('filteredStudents in the success', item)
      return (
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        firstNameMatch ||
        middleNameMatch ||
        lastNameMatch
      );
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

  //console.log(academicYears)
  // Handler for registering selected row,
  const [studentYears, setStudentYears] = useState([]);
  const handleRegisterSelected = () => {
    //we already allowed only one to be selected in the button options
    //console.log('Selected Rows to detail:', selectedRows)

    setStudentObject(selectedRows[0]);
    //console.log(studentObject, "studentObject");
    //const {studentYears}= (studentObject)

    setStudentYears(studentObject.studentYears);
    //console.log("student years and id", studentYears);
    setIsRegisterModalOpen(true);

    //setSelectedRows([]); // Clear selection after process
  };
  
  // This is called when saving the updated student years from the modal
  const onUpdateStudentClicked = async (updatedYears) => {
    //console.log("Updated studentYears from modal:", updatedYears);

    const updatedStudentObject = {
      ...studentObject,
      studentYears: updatedYears, // Merge updated studentYears
    };

    //console.log("Saving updated student:", updatedStudentObject);

    try {
      await updateStudent(updatedStudentObject); // Save updated student to backend
      console.log("Student updated successfully");
    } catch (error) {
      console.log("Error saving student:", error);
    }

    setIsRegisterModalOpen(false); // Close modal
  };

  //   const [studentYears, setStudentYears] = useState([])
  // //adds to the previous entries in arrays for gardien, schools...
  //       const onStudentYearsChanged = (e, selectedYear) => {
  //         if (e.target.checked) {
  //           // Add the selectedYear to studentYears if it's checked
  //           setStudentYears([...studentYears, selectedYear]);
  //         } else {
  //           // Remove the selectedYear from studentYears if it's unchecked
  //           setStudentYears(studentYears.filter(year => year !== selectedYear))
  //         }
  //       }

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },
    //show this column only if user is a parent and not employee

    isAdmin && {
      name: "ID",
      selector: (row) => (
        <Link to={`/students/studentsParents/studentDetails/${row.id}`}>
          {row.id}{" "}
        </Link>
      ),
      sortable: true,
      width: "200px",
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
      name: "DOB",
      selector: (row) =>new Date(row.studentDob).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),

      sortable: true,
      width: "100px",
    },
    // {name: "Father",
    //   selector:row=>row.studentFather._id,
    //   sortable:true
    // },
    // {name: "Mother",
    //   selector:row=>row.studentMother._id,
    //   sortable:true
    // },

    {
      name: "Registered",

      selector: (row) => (
        <div>
          {row.studentYears.map((year) => (
            <Link
              to={`/students/studentsParents/registrationDetails/${row.id}`}
            >
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
              Navigate(`/students/studentsParents/studentDetails/${row.id}`)
            }
          >
            <ImProfile className="text-2xl" />
          </button>
          {canEdit ? (
            <button
              className="text-yellow-400"
              onClick={() =>
                Navigate(`/students/studentsParents/editStudent/${row.id}`)
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
  let content;
  if (isLoading) content = <p>Loading...</p>;
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>; //errormessage class defined in the css, the error has data and inside we have message of error
  }
  //if (isSuccess){

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
        <DataTable
          columns={column}
          data={filteredStudents}
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
            onClick={handleRegisterSelected}
            disabled={selectedRows.length !== 1} // Disable if no rows are selected
            hidden={!canCreate}
          >
            Register
          </button>

          <button
            className="px-3 py-2 bg-yellow-400 text-white rounded"
            onClick={handleDuplicateSelected}
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
      <DeletionConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
      <RegisterModal
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
  //}
  return content;
};
export default StudentsList;
