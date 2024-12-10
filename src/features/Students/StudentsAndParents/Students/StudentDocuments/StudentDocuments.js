import { useParams } from "react-router-dom"; //because we will get the userId from the url

import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Students from "../../../Students";
import { useState, useEffect } from "react";
import {
  useAddStudentDocumentsMutation,
  useDeleteStudentDocumentMutation,
} from "./studentDocumentsApiSlice";
import { useGetStudentDocumentsByYearByIdQuery } from "../../../../AppSettings/StudentsSet/StudentDocumentsLists/studentDocumentsListsApiSlice";
import { selectCurrentToken } from "../../../../auth/authSlice";
import { ROLES } from "../../../../../config/UserRoles";
import { ACTIONS } from "../../../../../config/UserActions";
import useAuth from "../../../../../hooks/useAuth";
import UploadDocumentFormModal from "../UploadDocumentFormModal";
import LoadingStateIcon from "../../../../../Components/LoadingStateIcon";
import ViewDocumentModal from "./ViewDocumentModal";
import DataTable from "react-data-table-component";
import DeletionConfirmModal from "../../../../../Components/Shared/Modals/DeletionConfirmModal";
import { GrView } from "react-icons/gr";
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";
import { GrDocumentUpload } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
const StudentDocuments = () => {
  const { id } = useParams(); //pull the id from use params from the url
  //console.log(id,'in the parent before form')
  //will get hte student from the state
  //const studentToEdit = useSelector((state) => state.student?.entities[id]);
  //)
  const Navigate = useNavigate();
  const Dispatch = useDispatch();

  const [studentId, setStudentId] = useState(id); // we get from previous page
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const [idStudentDocumentToDelete, setIdStudentDocumentToDelete] =
    useState(null); // State to track which document to delete
  const [documents, setDocuments] = useState([]);

  const [studentDocumentYear, setStudentDocumentYear] = useState(
    selectedAcademicYear.title || ""
  );
  const [studentDocumentLabel, setStudentDocumentLabel] = useState("");
  const [validStudentDocumentLabel, setValidStudentDocumentLabel] =
    useState("");
  const [studentDocumentReference, setStudentDocumentReference] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [documentToView, setDocumentToView] = useState(null);

  const {
    userId,
    canEdit,
    canDelete,
    canAdd,
    canView,
    canCreate,
    isParent,
    isAdmin,
    status2,
  } = useAuth();

  const [
    deleteStudentDocument,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteStudentDocumentMutation();
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [
    addStudentDocuments,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading: uploadIsLoading,
      isSuccess: uploadIsSuccess,
      isError: uploadIsError,
      error: uploadError,
    },
  ] = useAddStudentDocumentsMutation(); //it will not execute the mutation nownow but when called

  //prepare the permission variables

  useEffect(() => {
    if (selectedAcademicYear?.title) {
      setStudentDocumentYear(selectedAcademicYear.title);
      //console.log('studentDocumentYear:', studentDocumentYear)
    }
  }, [selectedAcademicYear]);

  const {
    data: studentDocumentsListing,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
    isError: listIsError,
    error: listError,
  } = useGetStudentDocumentsByYearByIdQuery(
    {
      studentId: id,
      year: studentDocumentYear,
      endpointName: "StudentDocumentsList",
    } || {},
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //console.log('studentDocumentsListing',studentDocumentsListing )

  //         //the error messages to be displayed in every case according to the class we put in like 'form input incomplete... which will underline and highlight the field in that cass
  //const errClass = isError ? "errmsg" : "offscreen"
  //       //const validStudentClass = !validStudentName ? 'form__input--incomplete' : ''
  //       //const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
  //       //const validRolesClass = !Boolean(userRoles.length) ? 'form__input--incomplete' : ''

  // Function to handle the delete button click
  const onDeleteStudentDocumentClicked = (docId) => {
    console.log("id of the document when clicked", docId);
    setIdStudentDocumentToDelete(docId); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    console.log(
      "id of the document when confirmed delete",
      idStudentDocumentToDelete
    );
    await deleteStudentDocument({ id: idStudentDocumentToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdStudentDocumentToDelete(null);
  };
  const [documentTitle, setDocumentTitle] = useState("");
  //modal to upload document
  const handleUploadClick = (documentTitle, documentReference) => {
    setIsUploadModalOpen(true);
    setDocumentTitle(documentTitle);
    setStudentDocumentReference(documentReference);
  };
  // now that the modal has returned the required data:{ studentId, studentDocumentYear, studentDocumentLabel, studentDocumentType, file

  const handleUpload = async ({
    studentId,
    studentDocumentYear,
    studentDocumentLabel,
    studentDocumentReference,
    file,
  }) => {
    //console.log(studentId, studentDocumentYear, studentDocumentLabel, studentDocumentReference, file)
    // e.preventDefault()
    const formData = new FormData();

    // Append each document to the FormData

    formData.append("studentId", studentId);
    formData.append("studentDocumentYear", studentDocumentYear);
    formData.append("studentDocumentReference", studentDocumentReference); ///!!!must upload the id and not the title
    formData.append("studentDocumentLabel", studentDocumentLabel);
    formData.append("file", file);

    try {
      const response = await addStudentDocuments(formData); //.unwrap()
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const result = await response.json();
      console.log("Upload successful:", result);
    } catch (error) {
      console.error("Error uploading documents:", error);
    }
  };
  const token = useSelector(selectCurrentToken);
  //console.log(token,'token')

  const apiClient = axios.create({
    baseURL: "http://localhost:3500",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const handleViewDocument = async (id) => {
    try {
      const response = await apiClient.get(
        `/students/studentsParents/studentDocuments/${id}`,
        {
          responseType: "blob",
        }
      );

      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      if (contentType === "application/pdf") {
        // Handle PDF download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `document_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setDocumentToView(url);
        setIsViewModalOpen(true);
      }
    } catch (error) {
      console.error("Error viewing the document:", error);
    }
  };

  useEffect(() => {
    if (uploadIsSuccess) {
      //if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
      //setStudentId(studentId)//to ensure it is always present in teh future requests in the same page
      //setStudentDocumentYear('')
      setStudentDocumentLabel("");
      setStudentDocumentReference("");
      setDocuments([]);
      Navigate(`/students/studentsParents/studentDocumentsList/${studentId}`); //will navigate here after saving
    }
  }, [uploadIsSuccess, Navigate]);

  const column = [
    {
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: "50px",
    },
    //show this column only if user is a parent and not employee

    //   {
    // name: "Reference",
    // selector:row=>( row.documentReference  ),
    // sortable:true,
    // width:'200px'
    //  },
    {
      name: "Title",
      selector: (row) => row.documentTitle,

      sortable: true,
      removableRows: true,
      width: "170px",
    },
    {
      name: "Uploaded",
      selector: (row) => row.documentUploaded,
      cell: (row) => (
        <span>
          {row.documentUploaded === true ? (
            <IoCheckmarkDoneSharp className="text-green-500 text-2xl" />
          ) : (
            ""
          )}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: "Required",
      selector: (row) => row.isRequired,
      cell: (row) => (
        <span>
          {row.isRequired === true ? (
            <IoCheckmarkSharp className="text-gray-500 text-2xl" />
          ) : (
            ""
          )}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: "Legalised",
      selector: (row) => row.isLegalised,
      sortable: true,
      cell: (row) => (
        <span>
          {row.isLegalised === true ? (
            <IoCheckmarkSharp className="text-gray-500 text-2xl" />
          ) : (
            ""
          )}
        </span>
      ),
      width: "100px",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-1">
          {canView && row.documentUploaded && (
            <button
              className="text-sky-700"
              fontSize={20}
              onClick={() => handleViewDocument(row.studentDocumentId)}
            >
              <GrView fontSize={20} />
            </button>
          )}

          {canEdit && !row.documentUploaded && (
            <button
              className="text-amber-300"
              onClick={() =>
                handleUploadClick(row.documentTitle, row.documentReference)
              }
            >
              <GrDocumentUpload fontSize={20} />
            </button>
          )}
          {canDelete && row.documentUploaded && !isDelLoading && (
            <button
              className="text-red-600"
              onClick={() =>
                onDeleteStudentDocumentClicked(row.studentDocumentId)
              }
            >
              <RiDeleteBin6Line fontSize={20} />
            </button>
          )}
        </div>
      ),
      ignoreRowClick: true,

      button: true,
    },
  ];
  let content;
  if (listIsLoading)
    content = (
      <>
        <Students />
        <LoadingStateIcon />
      </>
    );
  if (listIsError) {
    content = <p className="errmsg">{listError?.data?.message}</p>; //errormessage class defined in the css, the error has data and inside we have message of error
  }
  if (listIsSuccess) {
    //console.log(studentDocumentsListing)
    content = (
      <>
        {" "}
        {isDelSuccess && <p>Document deleted successfully!</p>}
        <Students />
        <div className=" flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200">
          <DataTable
            columns={column}
            data={studentDocumentsListing}
            pagination
            selectableRows
            removableRows
            pageSizeControl
          />

          <div className="flex justify-end items-center space-x-4">
            <button
              className="cancel-button"
              onClick={() => Navigate(`/students/studentsParents/students`)}
            >
              Back to List
            </button>
            <button
              className=" px-4 py-2 bg-sky-700 text-white rounded"
              onClick={() =>
                Navigate(`/students/studentsParents/studentDetails/${id}`)
              }
            >
              Student Details
            </button>

            {isAdmin && (
              <button
                className="px-3 py-2 bg-gray-400 text-white rounded"
                hidden={!canCreate}
              >
                All
              </button>
            )}
          </div>
        </div>
        <UploadDocumentFormModal
          isOpen={isUploadModalOpen}
          onRequestClose={() => setIsUploadModalOpen(false)}
          studentId={studentId}
          year={studentDocumentYear}
          documentTitle={documentTitle}
          studentDocumentReference={studentDocumentReference}
          onUpload={handleUpload}
        />
        <ViewDocumentModal
          isOpen={isViewModalOpen}
          onRequestClose={() => setIsViewModalOpen(false)}
          documentUrl={documentToView}
        />
        <DeletionConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      </>
    );
  }
  return content;
};
export default StudentDocuments;
