// import { useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import { selectNotificationById } from "./notificationsApiSlice";

// const NotificationDetails = () => {
//   const { id } = useParams();
//   const notification = useSelector((state) => state.notification?.entities[id]);
//   const navigate = useNavigate();

//   const handleBack = () => {
//     navigate("/hr/notifications/");
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">
//         Notification Details
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Full Name */}
//         <div>
//           <p className="text-sm font-medium text-gray-700">Full Name</p>
//           <p className="text-lg text-gray-900">
//             {notification?.userFullName?.userFirstName}{" "}
//             {notification?.userFullName?.userMiddleName}{" "}
//             {notification?.userFullName?.userLastName || ""}
//           </p>
//         </div>

//         {/* Date of Birth */}
//         <div>
//           <p className="text-sm font-medium text-gray-700">Date of Birth</p>
//           <p className="text-lg text-gray-900">
//             {notification?.userDob ? notification.userDob.split("T")[0] : "N/A"}
//           </p>
//         </div>

//         {/* Sex */}
//         <div>
//           <p className="text-sm font-medium text-gray-700">Sex</p>
//           <p className="text-lg text-gray-900">{notification?.userSex || "N/A"}</p>
//         </div>

//         {/* Address */}
//         <div>
//           <p className="text-sm font-medium text-gray-700">Address</p>
//           <p className="text-lg text-gray-900">
//             {notification?.userAddress?.house} {notification?.userAddress?.street}
//           </p>
//           <p className="text-lg text-gray-900">{notification?.userAddress?.area}</p>
//           <p className="text-lg text-gray-900">
//             {notification?.userAddress?.postCode}
//           </p>
//           <p className="text-lg text-gray-900">{notification?.userAddress?.city}</p>
//         </div>

//         {/* Contact */}
//         <div>
//           <p className="text-sm font-medium text-gray-700">Contact</p>
//           <p className="text-lg text-gray-900">
//             {notification?.userContact?.primaryPhone || "N/A"}
//           </p>
//           <p className="text-lg text-gray-900">
//             {notification?.userContact?.secondaryPhone || "N/A"}
//           </p>
//           <p className="text-lg text-gray-900">
//             {notification?.userContact?.email || "N/A"}
//           </p>
//         </div>

//         {/* Roles */}
//         <div>
//           <p className="text-sm font-medium text-gray-700">Roles</p>
//           <p className="text-lg text-gray-900">
//             {notification?.userRoles?.length > 0
//               ? notification.userRoles.join(", ")
//               : "N/A"}
//           </p>
//         </div>

//         {/* Active Status */}
//         <div>
//           <p className="text-sm font-medium text-gray-700">Active Status</p>
//           <p
//             className={`text-lg font-semibold ${
//               notification?.notificationIsActive ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {notification?.notificationIsActive ? "Active" : "Inactive"}
//           </p>
//         </div>

//         {/* Academic Years */}
//         <div>
//           <p className="text-sm font-medium text-gray-700">Academic Years</p>
//           <ul className="list-disc list-inside text-lg text-gray-900">
//             {notification?.notificationData?.notificationYears?.length > 0 ? (
//               notification.notificationData.notificationYears.map((year, idx) => (
//                 <li key={idx}>{year.academicYear}</li>
//               ))
//             ) : (
//               <li>N/A</li>
//             )}
//           </ul>
//         </div>

//         {/* Current Employment */}
//         <div>
//           <p className="text-sm font-medium text-gray-700">
//             Current Employment
//           </p>
//           <p className="text-lg text-gray-900">
//             {notification?.notificationData?.notificationCurrentEmployment?.position
//               ? `${
//                   notification?.notificationData?.notificationCurrentEmployment?.position
//                 }, Joined on: ${
//                   notification?.notificationData?.notificationCurrentEmployment?.joinDate.split(
//                     "T"
//                   )[0]
//                 }`
//               : "N/A"}
//           </p>
//         </div>

//         {/* Work History */}
//         <div>
//           <p className="text-sm font-medium text-gray-700">Work History</p>
//           <ul className="list-disc list-inside text-lg text-gray-900">
//             {notification?.notificationData?.notificationWorkHistory?.length > 0 ? (
//               notification.notificationData.notificationWorkHistory.map((history, idx) => (
//                 <li key={idx}>
//                   {history.position} at {history.company} ({history.startDate} -{" "}
//                   {history.endDate || "Present"})
//                 </li>
//               ))
//             ) : (
//               <li>N/A</li>
//             )}
//           </ul>
//         </div>
//       </div>

//       <div className="cancelSavebuttonsDiv">
//         <button
//           onClick={() => navigate(`/hr/notifications/notifications/`)}
//          className="cancel-button"
//         >
//           Back to List
//         </button>
//         <button
//           onClick={() => navigate(`/hr/notifications/editNotification/${id}`)}
//           className="edit-button"
//           hidden={!canEdit}
//         >
//           Edit Notification
//         </button>
//       </div>
//     </div>
//   );
// };

// export default NotificationDetails;
