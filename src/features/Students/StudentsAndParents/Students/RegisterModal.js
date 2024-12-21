import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const RegisterModal = ({
  isOpen,
  onClose,
  studentObject,
  setStudentObject,
  studentYears,
  academicYears,
  onSave,
}) => {
  const [modifiedYears, setModifiedYears] = useState([]);

  useEffect(() => {
    if (isOpen && Array.isArray(studentYears)) {
      // Initialize the modifiedYears array
      const updatedYears = academicYears.map((year) => {
        const isSelected = studentYears.some(
          (studentYear) =>
            studentYear.academicYear.toLowerCase().trim() ===
            year.title.toLowerCase().trim()
        );
        return {
          ...year,
          selected: isSelected,
          isExisting: isSelected, // Mark as existing if already selected
        };
      });
      setModifiedYears(updatedYears);
    }
  }, [isOpen, studentYears, academicYears]);

  const handleYearSelection = (index) => {
    const updatedYears = [...modifiedYears];
    const year = updatedYears[index];

    // Prevent deselecting already selected years
    if (year.isExisting) return;

    // Toggle selection state
    year.selected = !year.selected;

    // Update studentYears in desired format
    const updatedStudentYears = updatedYears
      .filter((year) => year.selected)
      .map((year) => ({ academicYear: year.title }));

    setModifiedYears(updatedYears);
    setStudentObject({ ...studentObject, studentYears: updatedStudentYears });
  };

  const handleSave = () => {
    const yearsToSave = modifiedYears
      .filter((year) => year.selected)
      .map((year) => ({ academicYear: year.title }));
    onSave(yearsToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Register Student"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="formSectionContainer">
        <h2 className="text-xl font-semibold mb-4">{`Select New Register Year for ${studentObject?.studentName?.middleName} ${studentObject?.studentName?.firstName} ${studentObject?.studentName?.lastName}`}</h2>
        <p className="text-red-600">Choose one new year</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 mt-1 max-h-80 overflow-y-auto">
          {modifiedYears
            .filter((year) => year.title !== "1000")
            .map((year, index) => (
              <button
                aria-label="selectYears"
                key={index}
                type="button"
                onClick={() => handleYearSelection(index)}
                className={`px-3 py-2 text-left rounded-md ${
                  year.selected
                    ? "bg-sky-700 text-white hover:bg-sky-600"
                    : "bg-gray-200 text-gray-700 hover:bg-sky-600 hover:text-white"
                } ${year.isExisting ? "cursor-not-allowed opacity-70" : ""}`}
                disabled={year.isExisting}
              >
                <div className="font-semibold">{year.title}</div>
              </button>
            ))}
        </div>
        <div className="cancelSavebuttonsDiv">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-sky-500"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RegisterModal;

// import React, { useState, useEffect } from "react";
// import Modal from "react-modal";

// //this modal will add studetn years for the studetn selelcted
// const RegisterModal = ({
//   isOpen,
//   onClose,
//   studentObject,
//   setStudentObject,
//   studentYears,
//   academicYears,
//   onSave,
// }) => {
//   const [modifiedYears, setModifiedYears] = useState([]);
//   useEffect(() => {
//     if (isOpen && Array.isArray(studentYears)) {
//       //console.log(studentYears, "studtnyears", academicYears, "academicyears");
//       // Initialize the modifiedYears array with selected flag based on studentYears
//       const updatedYears = academicYears.map((year) => {
//         const isSelected = studentYears.some(
//           (studentYear) =>
//             studentYear.academicYear.toLowerCase().trim() ===
//             year.title.toLowerCase().trim()
//         );

//         // if (isSelected) {
//         //   console.log(`Selected: true for year.title: ${year.title}`);
//         // }
//         return {
//           ...year,
//           selected: isSelected,
//         };
//       });

//       setModifiedYears(updatedYears);
//     }
//   }, [isOpen, studentYears, academicYears]);
//   const [years, setYears] = useState([]);
// //console.log(studentObject, 'studentObject')
//   const handleCheckboxChange = (index) => {
//     const updatedYears = [...modifiedYears];
//     updatedYears[index].selected = !updatedYears[index].selected;

//     const updatedStudentYears = updatedYears
//       //.filter((year) => year.selected) // Get only selected years will not allow to register studetn from other years (reregistratin)
//       .map((year) => ({ academicYear: year.title })); // Map to the desired format
//     setYears(updatedStudentYears);
//     setModifiedYears(updatedYears);
//     console.log("updatedStudentYears", updatedStudentYears);
//     setStudentObject({...studentObject, studentYears:updatedStudentYears})//added this ////////////
//   };
//   const handleSave = () => {
//     onSave(years);

//     //console.log('modifiedYears', modifiedYears)
//     onClose();
//   };
//   if (!isOpen) return null;

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       contentLabel="Register Student"
//       className="modal-content"
//       overlayClassName="modal-overlay"
//     >
//       <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
//         <h2 className="text-xl font-semibold mb-4">{`Select New Register Year for${studentObject?.studentName?.middleName} ${studentObject?.studentName?.firstName} ${studentObject?.studentName?.lastName}`}</h2>
//         <p className="text-red-600">Choose only one new year, do not uncheck any box!</p>
//         <div className="space-y-4">
//           {modifiedYears
//            .filter((year) => year.title !== "1000")
//           //.filter((year) => year.title === selectedAcademicYear?.title)
//           .map((year, index) => (
//             <div key={index} className="flex items-center">
//                <label
//                 htmlFor={`year-${index}`}
//                 className="text-sm text-gray-700"
//               >
//               <input
//                 type="checkbox"
//                 id={`year-${index}`}
//                 checked={year.selected}
//                 onChange={() => handleCheckboxChange(index)}
//                 className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-sky-700"
//               />

//                  {year.title}
//               </label>
//             </div>
//           ))}
//         </div>
//         <div className="cancelSavebuttonsDiv">
//           <button
//             onClick={onClose}
//            className="cancel-button"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-sky-500"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// };
// export default RegisterModal;
