import React from "react";
import Modal from "react-modal";

const DocumentActionModal = ({
  isOpen,
  onRequestClose,
  documentUrl,
  documentId,
}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = documentUrl;
    link.setAttribute("download", `document_${documentId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePrint = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = documentUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    };
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Document Actions"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Choose an Action</h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Print
          </button>
        </div>
        <button
          onClick={onRequestClose}
          className="mt-6 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default DocumentActionModal;
