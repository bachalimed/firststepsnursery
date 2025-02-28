import React from "react";
import { useEffect, useState } from "react";
//Modal.setAppElement("#root");

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm , message}) => {
  const [selectedButton, setSelectedButton] = useState("cancel"); // Default selected button

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose(); // Close modal when Escape is pressed
      } else if (event.key === "Enter") {
        if (selectedButton === "confirm") {
          onConfirm(); // Confirm deletion when Enter is pressed on Confirm
        } else {
          onClose(); // Cancel when Enter is pressed on Cancel
        }
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        // Toggle selection between Cancel and Confirm buttons
        setSelectedButton((prev) => (prev === "cancel" ? "confirm" : "cancel"));
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onConfirm, selectedButton]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg max-w-md w-full">
        {/* Top bar with title */}
        <div className="bg-sky-600 rounded-t-md py-2 px-4 flex justify-center items-center">
          <h2
            className="text-lg font-semibold text-white"
            id="modal-title"
            data-testid="modal-title"
          >
            Confirm Deletion
          </h2>
        </div>

        {/* Content section */}
        <div className="p-6">
          {message?
          (<p className="text-gray-700 mb-6" data-testid="modal-message">
            {message}.{" "}
          </p>):(<p className="text-gray-700 mb-6" data-testid="modal-message">
            Are you sure you want to delete? This action cannot be undone.{" "}
          </p>)}
          <div className="flex justify-end space-x-4">
            <button
              aria-label="cancel"
              onClick={onClose}
              className={`border border-gray-700 text-gray-800  bg-gray-200 hover:text-black  hover:bg-gray-500 active:bg-gray-700 active:border-gray-800 active:text-gray-700 w-full px-4 py-2 rounded-md ${selectedButton === "cancel" ? "border-gray-800 bg-gray-400 text-white" : "bg-gray-100"}`}
              data-testid="cancel-button"
            >
              Cancel
            </button>
            <button
              aria-label="confirm"
              onClick={onConfirm}
              className={` border border-red-700 text-red-700  bg-white hover:text-white hover:bg-red-600 active:bg-red-800 active:border-red-800 active:text-white w-full px-4 py-2 rounded-md ${selectedButton === "confirm" ? "bg-red-800 text-white" : "bg-gray-100"}`}
              data-testid="confirm-button"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

{
  /* <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirm Deletion"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <h2 className="modal-title" data-testid="modal-title">Confirm Deletion</h2>
        <p data-testid="modal-message">Are you sure you want to delete? This action cannot be undone.</p>
        <div className="modal-actions">
          <button
            onClick={onClose}
            className="cancel-button w-full"
            data-testid="cancel-button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="save-button w-full"
            data-testid="delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal> */
}
