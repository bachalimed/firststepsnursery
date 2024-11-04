import React, { useState, useEffect } from "react";
import Modal from "react-modal";

//this modal will add studetn years for the studetn selelcted
const RegisterModal = ({
  isOpen,
  onClose,
  studentObject,
  setStudentObject,
  selectedAcademicYear,
  studentYears,
  academicYears,
  onSave,
}) => {
  const [modifiedYears, setModifiedYears] = useState([]);
  useEffect(() => {
    if (isOpen && Array.isArray(studentYears)) {
      console.log(studentYears, "studtnyears", academicYears, "academicyears");
      // Initialize the modifiedYears array with selected flag based on studentYears
      const updatedYears = academicYears.map((year) => {
        const isSelected = studentYears.some(
          (studentYear) =>
            studentYear.academicYear.toLowerCase().trim() ===
            year.title.toLowerCase().trim()
        );

        // if (isSelected) {
        //   console.log(`Selected: true for year.title: ${year.title}`);
        // }
        return {
          ...year,
          selected: isSelected,
        };
      });

      setModifiedYears(updatedYears);
    }
  }, [isOpen, studentYears, academicYears]);
  const [years, setYears] = useState([]);
console.log(studentObject, 'studentObject')
  const handleCheckboxChange = (index) => {
    const updatedYears = [...modifiedYears];
    updatedYears[index].selected = !updatedYears[index].selected;

    const updatedStudentYears = updatedYears
      .filter((year) => year.selected) // Get only selected years
      .map((year) => ({ academicYear: year.title })); // Map to the desired format
    setYears(updatedStudentYears);
    setModifiedYears(updatedYears);
    console.log("updatedStudentYears", updatedStudentYears);
    setStudentObject({...studentObject, studentYears:updatedStudentYears})//added this ////////////
  };
  const handleSave = () => {
    onSave(years);

    //console.log('modifiedYears', modifiedYears)
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
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">{`Select New Register Year for${studentObject?.studentName?.middleName} ${studentObject?.studentName?.firstName} ${studentObject?.studentName?.lastName}`}</h2>
        <div className="space-y-4">
          {modifiedYears
           .filter((year) => year.title !== "1000")
          //.filter((year) => year.title === selectedAcademicYear.title)
          .map((year, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`year-${index}`}
                checked={year.selected}
                onChange={() => handleCheckboxChange(index)}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`year-${index}`}
                className="text-sm text-gray-700"
              >
                 {year.title}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default RegisterModal;
