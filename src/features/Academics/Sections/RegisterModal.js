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
      //console.log(studentYears, "studtnyears", academicYears, "academicyears");
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

  const handleCheckboxChange = (index) => {
    const updatedYears = [...modifiedYears];
    updatedYears[index].selected = !updatedYears[index].selected;

    const updatedStudentYears = updatedYears
      .filter((year) => year.selected) // Get only selected years
      .map((year) => ({ academicYear: year.title })); // Map to the desired format
    setYears(updatedStudentYears);
    setModifiedYears(updatedYears);
    //console.log("updatedStudentYears", updatedStudentYears);
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
        <h2  className="formTitle ">Select New Register Year</h2>
        <div className="space-y-4">
          {modifiedYears.map((year, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`year-${index}`}
                checked={year.selected}
                onChange={() => handleCheckboxChange(index)}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-sky-700"
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
        <div className="cancelSavebuttonsDiv">
          <button
            onClick={onClose}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="save-button"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default RegisterModal;
