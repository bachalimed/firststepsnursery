import React, { useState } from "react";
import Modal from "react-modal"; // You need to install react-modal: npm install react-modal

Modal.setAppElement("#root"); // This is to ensure accessibility

const UploadDocumentFormModal = ({
  isOpen,
  onRequestClose,
  userId,
  year,
  onUpload,
  documentTitle,
  employeeDocumentReference,
}) => {
  const [employeeDocumentLabel, setEmployeeDocumentLabel] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    onUpload({
      userId,
      employeeDocumentYear: year,
      employeeDocumentLabel,
      employeeDocumentReference,
      file,
    });
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Upload Document"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>

        <div className="mb-4">
          <label
             className="formInputLabel"
            htmlFor="documentTitle"
          >
            Document Title
          </label>
          <input
            id="documentTitle"
            type="text"
            value={documentTitle}
            disabled
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label
             className="formInputLabel"
            htmlFor="employeeDocumentLabel"
          >
            Document Label
          </label>
          <input
            id="employeeDocumentLabel"
            type="text"
            value={employeeDocumentLabel}
            onChange={(e) => setEmployeeDocumentLabel(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-700 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label
             className="formInputLabel"
            htmlFor="file"
          >
            Choose File
          </label>
          <input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onRequestClose}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-700"
          >
            Upload
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadDocumentFormModal;
