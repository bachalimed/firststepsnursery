import React from "react";
import Modal from "react-modal";
 //import handleDownloadDocument from "./EmployeeDocumentsList";


const ViewDocumentModal = ({ isOpen, onRequestClose,documentUrl  }) => {
 
 
    return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="View Document"
      className="modal"
      overlayClassName="overlay"
    >
      <button onClick={onRequestClose} className="close-btn">
        Close
      </button>
      {/* {documentUrl && (
        <> */}
          {/* Handling PDFs */}
          {/* {documentUrl.endsWith(".pdf") ? (
            handleDownloadDocument(documentUrl)
          ) : (*/}
            <img
              src={documentUrl}
              alt="Document"
              className="w-full h-auto max-h-[90vh] object-contain"
            />
         {/*  )}
        </>
      )} */}
       
    </Modal>
  );
};

export default ViewDocumentModal;
