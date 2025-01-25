// import React, { useState } from "react";
// import CRMManagement from "../CRMManagement";
// const TextSettings = () => {
//   const [isTextEnabled, setIsTextEnabled] = useState(false);
//   const [messageTemplate, setMessageTemplate] = useState(
//     "Dear [ParentName], a payment of [Amount] TND was made for [StudentName]. Thank you."
//   );
//   const [sendOnPayment, setSendOnPayment] = useState(true);

//   const handleSaveSettings = () => {
//     // Logic to save the settings to the backend
//     const settings = {
//       isTextEnabled,
//       messageTemplate,
//       sendOnPayment,
//     };

//     //console.log("Settings to save:", settings);
//     // Send settings to the backend
//   };
//   return (
//     <>
//       <CRMManagement />
//       <div className="p-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold mb-4">Text Settings</h2>

//         {/* Enable/Disable Text Messages */}
//         <div className="mb-4">
//           <label className="flex items-center space-x-3">
//             <input
//               type="checkbox"
//               checked={isTextEnabled}
//               onChange={(e) => setIsTextEnabled(e.target.checked)}
//               className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="text-sm">
//               Enable text messages to parents on payment
//             </span>
//           </label>
//         </div>

//         {/* Save Button */}
//         <div className="mt-6">
//           <button onClick={handleSaveSettings} className="save-button">
//             Save Settings
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TextSettings;
