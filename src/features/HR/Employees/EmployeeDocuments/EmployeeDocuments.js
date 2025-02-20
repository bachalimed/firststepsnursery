import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import LoadingStateSmallIcon from "../../../../Components/LoadingStateSmallIcon";
import useAuth from "../../../../hooks/useAuth";
import React from "react";
import axios from "axios";
import HR from "../../HR";
import { useState, useEffect } from "react";
import {
  useAddEmployeeDocumentsMutation,
  useDeleteEmployeeDocumentMutation,
} from "./employeeDocumentsApiSlice";
import { useGetEmployeeDocumentsByYearByIdQuery } from "../../../AppSettings/HRSet/EmployeeDocumentsLists/employeeDocumentsListsApiSlice"; //using the listslist to get the documents
import { selectCurrentToken } from "../../../auth/authSlice";
import UploadDocumentFormModal from "../../../../Components/Shared/Modals/UploadDocumentFormModal";
import ViewDocumentModal from "../../../../Components/Shared/Modals/ViewDocumentModal";
import DataTable from "react-data-table-component";
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";
import { GrView } from "react-icons/gr";
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";
import { GrDocumentUpload,GrDocumentDownload } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
//constrains on inputs when creating new user

const EmployeeDocuments = () => {
  useEffect(() => {
    document.title = "Employee Documents List";
  });
  const { id: userId } = useParams(); //pull the id from use params from the url
  const Navigate = useNavigate();

  //console.log(userId,'the id in teh list')
  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const [idEmployeeDocumentToDelete, setIdEmployeeDocumentToDelete] =
    useState(null); // State to track which document to delete
  const [documents, setDocuments] = useState([]);

  const [employeeDocumentYear, setEmployeeDocumentYear] = useState(
    selectedAcademicYear?.title || ""
  );
  const [employeeDocumentLabel, setEmployeeDocumentLabel] = useState("");

  const [employeeDocumentReference, setEmployeeDocumentReference] =
    useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [documentToView, setDocumentToView] = useState(null);
  const [loadingRowId, setLoadingRowId] = useState(null);
  const {
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
    deleteEmployeeDocument,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteEmployeeDocumentMutation();
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [
    addEmployeeDocuments,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading: uploadIsLoading,
      isSuccess: uploadIsSuccess,
      isError: uploadIsError,
      error: uploadError,
    },
  ] = useAddEmployeeDocumentsMutation(); //it will not execute the mutation nownow but when called

  //prepare the permission variables

  useEffect(() => {
    if (selectedAcademicYear?.title) {
      setEmployeeDocumentYear(selectedAcademicYear?.title);
      //console.log('employeeDocumentYear:', employeeDocumentYear)
    }
  }, [selectedAcademicYear]);

  //console.log(id,employeeDocumentYear)
  const {
    data: employeeDocumentsListing,
    isLoading: isListLoading,
    isSuccess: isListSuccess,
    // isError: isListError,
    // error: listError,
  } = useGetEmployeeDocumentsByYearByIdQuery(
    {
      userId: userId,

      year: employeeDocumentYear,
      endpointName: "EmployeeDocumentsList",
    } || {},
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  // Function to handle the delete button click
  const onDeleteEmployeeDocumentClicked = (docId) => {
    // console.log("id of the document when clicked", docId);
    setIdEmployeeDocumentToDelete(docId); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    // console.log(
    //   "id of the document when confirmed delete",
    //   idEmployeeDocumentToDelete
    // );
    try {
      const response = await deleteEmployeeDocument({
        id: idEmployeeDocumentToDelete,
      });
      setIsDeleteModalOpen(false); // Close the modal
      if (response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      } else if (response?.data?.message) {
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
    setIdEmployeeDocumentToDelete(null);
  };
  const [documentTitle, setDocumentTitle] = useState("");
  //modal to upload document
  const handleUploadClick = (documentTitle, documentReference) => {
    setLoadingRowId(documentReference);
    setIsUploadModalOpen(true);
    setDocumentTitle(documentTitle);
    setEmployeeDocumentReference(documentReference);
  };
  // now that the modal has returned the required data:{ userId, employeeDocumentYear, employeeDocumentLabel, employeeDocumentType, file

  const handleUpload = async ({
    entityId,
    documentYear,
    documentLabel,
    documentReference,
    file,
  }) => {
    //console.log(userId, employeeDocumentYear, employeeDocumentLabel, employeeDocumentReference, file)
    // e.preventDefault()
    const formData = new FormData();

    // Append each document to the FormData

    formData.append("userId", entityId);
    formData.append("employeeDocumentYear", documentYear);
    formData.append("employeeDocumentReference", documentReference); ///!!!must upload the id and not the title
    formData.append("employeeDocumentLabel", documentLabel);
    formData.append("file", file);

    try {
      const response = await addEmployeeDocuments(formData); //.unwrap()
      // console.log("response :", response);
      // if (!response.ok) {
      //   throw new Error("Something went wrong!");
      // }
      // const result = await response.json();
      //console.log("result :", result);
      //extracode for banner/////////////////
      if (response?.data?.message) {
        // Success response
        triggerBanner(response?.data?.message, "success");
      } else if (response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      } else if (response?.error?.data?.message) {
        // Error response
        triggerBanner(response?.error?.data?.message, "error");
      } else if (uploadIsError) {
        // In case of unexpected response format
        triggerBanner(uploadError?.data?.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      } //////////////
    } catch (error) {
      console.error("Error uploading documents:", error);
      triggerBanner(error?.data?.message, "error"); //////
    } finally {
      setLoadingRowId(null);
    }
  };

  const token = useSelector(selectCurrentToken);
  //console.log(token,'token')

  const apiClient = axios.create({
    baseURL:
      process.env.NODE_ENV === "production"
        ? "https://firststepsnursery-api.onrender.com"
        : "http://localhost:3500",
    //baseURL: `http://localhost:3500`,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // const handleViewDocument = async (id) => {
  //   try {
  //     const response = await apiClient.get(
  //       `/hr/employees/employeeDocuments/${id}`,
  //       {
  //         responseType: "blob",
  //       }
  //     );

  //     const contentType = response.headers["content-type"];
  //     const blob = new Blob([response.data], { type: contentType });
  //     const url = window.URL.createObjectURL(blob);
  //     if (contentType === "application/pdf") {
  //       // Handle PDF download
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute("download", `document_${id}.pdf`);
  //       document.body.appendChild(link);
  //       link.click();
  //       link.remove();
  //     } else {
  //       setDocumentToView(url);
  //       setIsViewModalOpen(true);
  //     }
  //   } catch (error) {
  //     console.error("Error viewing the document:", error);
  //   }
  // };
// Handler for downloading the document
const handleDownloadDocument = async (id) => {
  try {
    const response = await apiClient.get(
      `/hr/employees/employeeDocuments/${id}`,
      {
        responseType: "blob",
      }
    );

    const contentType = response.headers["content-type"];
    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    // Infer file extension from content type or default to `.bin`
    const fileExtension = contentType.split("/")[1] || "bin";
    link.setAttribute("download", `document_${id}.${fileExtension}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error downloading the document:", error);
  }
};

// Handler for viewing the document
const handleViewDocument = async (id) => {
  try {
    const response = await apiClient.get(
      `/hr/employees/employeeDocuments/${id}`,
      {
        responseType: "blob",
      }
    );

    const contentType = response.headers["content-type"];
    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);

    if ( contentType.startsWith("image/")) {
      setDocumentToView(url);
      setIsViewModalOpen(true);
    } else if(contentType === "application/pdf" ){
handleDownloadDocument(id)
    }
    else {
      alert("Document format not supported for viewing.");
    }
  } catch (error) {
    console.error("Error viewing the document:", error);
  }
};
  useEffect(() => {
    if (uploadIsSuccess) {
      //if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
      //setUserId(userId)//to ensure it is always present in teh future requests in the same page
      //setEmployeeDocumentYear('')
      setEmployeeDocumentLabel("");
      setEmployeeDocumentReference("");
      setDocuments([]);
      Navigate(`/hr/employees/employeeDocumentsList/${userId}`); //will navigate here after saving
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
      selector: (row) => {
        if (row.documentUpdatedAt) {
          return new Date(row.documentUpdatedAt).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }
        return ""; // Return empty string if documentUpdatedAt is not available
      },
      sortable: true,
      width: "120px",
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
              aria-label="view document"
              className="text-sky-700"
              fontSize={20}
              onClick={() => handleViewDocument(row.employeeDocumentId)}
            >
              <GrView fontSize={20} />
            </button>
          )} {canView && row.documentUploaded && (
                      <button
                      aria-label="download document"
                      className="text-green-700"
                      onClick={() => handleDownloadDocument(row.employeeDocumentId)}
                    >
                      <GrDocumentDownload fontSize={20} />
                    </button>
                    )}
          

          {canEdit && !row.documentUploaded && (
            <>
              {" "}
              <button
                aria-label="upload document"
                className="text-amber-300"
                onClick={() =>
                  handleUploadClick(row.documentTitle, row.documentReference)
                }
                hidden={
                  loadingRowId === row.documentReference && uploadIsLoading
                }
              >
                <GrDocumentUpload fontSize={20} />
              </button>{" "}
              {loadingRowId === row.documentReference && (
                <LoadingStateSmallIcon />
              )}
            </>
          )}
          {canDelete && row.documentUploaded && !isDelLoading && (
            <button
              aria-label="delete document"
              className="text-red-600"
              onClick={() =>
                onDeleteEmployeeDocumentClicked(row.employeeDocumentId)
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
  const tableHeader = (
    <h2>
      Documents List:
      <span> {employeeDocumentsListing?.length} documents</span>
    </h2>
  );

  let content;
  if (isListLoading)
    content = (
      <>
        <HR />
        <LoadingStateIcon />
      </>
    );

  //console.log(employeeDocumentsListing)
  if (isListSuccess)
    content = (
      <>
        {/* {" "}
      {isDelSuccess && <p>Document deleted successfully!</p>} */}
        <HR />
        <div className="dataTableContainer">
          <div>
            <DataTable
              title={tableHeader}
              columns={column}
              data={employeeDocumentsListing}
              pagination
              selectableRows
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

          <div className="cancelSavebuttonsDiv">
            <button
              className="cancel-button"
              onClick={() => Navigate(`/hr/employees/employeesList/`)}
            >
              Back to List
            </button>
            <button
              className=" px-4 py-2 bg-sky-700 text-white rounded"
              onClick={() =>
                Navigate(`/hr/employees/employeeDetails/${userId}`)
              }
            >
              Employee Details
            </button>
          </div>
        </div>
        <UploadDocumentFormModal
          isOpen={isUploadModalOpen}
          onRequestClose={() => setIsUploadModalOpen(false)}
          entityId={userId}
          documentYear={employeeDocumentYear}
          documentTitle={documentTitle}
          documentReference={employeeDocumentReference}
          onUpload={handleUpload}
          entityType="employee"
        />
        <ViewDocumentModal
          isOpen={isViewModalOpen}
          onRequestClose={() => setIsViewModalOpen(false)}
          documentUrl={documentToView}
          // documentType="employee"
        />
        <DeletionConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      </>
    );

  return content;
};
export default EmployeeDocuments;
