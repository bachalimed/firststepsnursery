import React from "react";

// A reusable confirmation modal component
const ConfirmationModal = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4" id="modal-title" data-testid="modal-title">{title}</h2>
        <p className="text-gray-700 mb-6" data-testid="modal-message">{message}</p>
        <div className="cancelSavebuttonsDiv">
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
            data-testid="confirm-button"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;


// import React from "react";

// // A reusable confirmation modal component
// const ConfirmationModal = ({ show, onClose, onConfirm, title, message }) => {
//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-xl font-semibold mb-4" aria-label="title">{title}</h2>
//         <p className="text-gray-700 mb-6">{message}</p>
//         <div className="cancelSavebuttonsDiv">
//           <button
//             onClick={onClose}
//             className="cancel-button"

//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="save-button"
//           >
//             Confirm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmationModal;
