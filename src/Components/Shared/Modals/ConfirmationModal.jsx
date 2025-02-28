import React from "react";
import { useEffect, useState } from "react";
// A reusable confirmation modal component
const ConfirmationModal = ({ show, onClose, onConfirm, title, message }) => {
  
   const [selectedButton, setSelectedButton] = useState("cancel"); // Default selected button
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          onClose(); // Close modal when Escape is pressed
        } else if (event.key === "Enter") {
          if (selectedButton === "save") {
            onConfirm(); // Confirm deletion when Enter is pressed on Confirm
          } else {
            onClose(); // Cancel when Enter is pressed on Cancel
          }
        } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          // Toggle selection between Cancel and Confirm buttons
          setSelectedButton((prev) => (prev === "cancel" ? "save" : "cancel"));
        }
      };
  
      if (show) {
        document.addEventListener("keydown", handleKeyDown);
      }
  
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [show, onClose, onConfirm, selectedButton]);
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
          className={`border border-gray-700 text-gray-800  bg-gray-200 hover:text-black  hover:bg-gray-500 active:bg-gray-700 active:border-gray-800 active:text-gray-700 w-full px-4 py-2 rounded-md ${selectedButton === "cancel" ? "border-gray-800 bg-gray-400 text-white" : "bg-gray-100"}`}
          data-testid="cancel-button"
        >
          Cancel
        </button>
        <button
          aria-label="confirm"
          onClick={onConfirm}
          className={`px-4 py-2 border border-sky-700 text-white rounded bg-sky-700 hover:bg-sky-500 active:bg-sky-800 active:border-sky-800 w-full ${selectedButton === "save" ? "border-sky-800 bg-sky-700 text-white" : "bg-sky-400"} `}
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
