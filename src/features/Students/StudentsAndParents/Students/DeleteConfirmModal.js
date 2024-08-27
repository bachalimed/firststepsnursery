import React from 'react';
import Modal from 'react-modal';

const DeleteConfirmModal = ({ isOpen, onRequestClose, onConfirm, documentId }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Deletion"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete the document "{documentId}"?</p>
      <div className="flex justify-end space-x-4">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={onRequestClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;