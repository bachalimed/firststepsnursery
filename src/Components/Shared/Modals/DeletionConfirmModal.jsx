import React from "react";
import Modal from "react-modal";

//Modal.setAppElement("#root"); 

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
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
            className="cancel-button"
            data-testid="cancel-button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="save-button"
            data-testid="delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
