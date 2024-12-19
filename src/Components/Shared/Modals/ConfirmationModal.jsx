import React from "react";

// A reusable confirmation modal component
const ConfirmationModal = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) return null;

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
        {title}
      </h2>
    </div>

    {/* Content section */}
    <div className="p-6">
      <p className="text-gray-700 mb-6" data-testid="modal-message">
        {message}
      </p>
      <div className="flex justify-end space-x-4">
        <button
          aria-label="cancel"
          onClick={onClose}
          className="cancel-button w-full"
          data-testid="cancel-button"
        >
          Cancel
        </button>
        <button
          aria-label="confirm"
          onClick={onConfirm}
          className="save-button  w-full "
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
