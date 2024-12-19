import { AiOutlineCheckCircle, AiOutlineExclamationCircle } from "react-icons/ai";

const ResultBanner = ({ message, type }) => {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-600",
  };

  return (
    <div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl shadow-lg rounded-lg bg-gray-100 bg-opacity-95 flex flex-col"
      style={{ zIndex: 1000 }}
    >
      {/* Top bar */}
      <div className={`h-8 rounded-t-lg ${colors[type] || "bg-gray-300"}`}></div>

      {/* Lower part */}
      <div className="p-4 flex items-center justify-center">
        <div className={`text-2xl mr-3 ${type === "success" ? "text-green-500" : "text-red-500"}`}>
          {type === "success" && <AiOutlineCheckCircle />}
          {type === "error" && <AiOutlineExclamationCircle />}
        </div>
        <p className="text-gray-900 text-lg ">{message}</p>
      </div>
    </div>
  );
};

export default ResultBanner;



// import { AiOutlineCheckCircle, AiOutlineExclamationCircle } from "react-icons/ai";

// const ResultBanner = ({ message, type }) => {
//   const iconStyles = {
//     success: "text-green-500",
//     error: "text-red-500",
//   };

//   return (
//     <div
//       className="fixed top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl shadow-lg rounded-lg bg-gray-100 flex items-center"
//       style={{ zIndex: 1000 }}
//     >
//       <div className="p-4 flex items-center">
//         <div className={`text-2xl mr-3 ${iconStyles[type] || ''}`}>
//           {type === "success" && <AiOutlineCheckCircle />}
//           {type === "error" && <AiOutlineExclamationCircle />}
//         </div>
//         <p className="text-gray-900 text-lg">{message}</p>
//       </div>
//     </div>
//   );
// };

// export default ResultBanner;
