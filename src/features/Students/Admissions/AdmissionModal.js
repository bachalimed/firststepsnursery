import React, { useState, useEffect } from "react";
import Modal from "react-modal";
const RegisterModal = ({
  isOpen,
  onClose,
  admissionObject,
  setAdmissionObject,
  
  admissionYears,
  academicYears,
  onSave,
}) => {
  const [modifiedYears, setModifiedYears] = useState([]);
  useEffect(() => {
    if (isOpen && Array.isArray(admissionYears)) {
      console.log(admissionYears, "studtnyears", academicYears, "academicyears");
      // Initialize the modifiedYears array with selected flag based on admissionYears
      const updatedYears = academicYears.map((year) => {
        const isSelected = admissionYears.some(
          (admissionYear) =>
            admissionYear.academicYear.toLowerCase().trim() ===
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
  }, [isOpen, admissionYears, academicYears]);
  const [years, setYears] = useState([]);

  const handleCheckboxChange = (index) => {
    const updatedYears = [...modifiedYears];
    updatedYears[index].selected = !updatedYears[index].selected;

    const updatedAdmissionYears = updatedYears
      .filter((year) => year.selected) // Get only selected years
      .map((year) => ({ academicYear: year.title })); // Map to the desired format
    setYears(updatedAdmissionYears);
    setModifiedYears(updatedYears);
    console.log("updatedAdmissionYears", updatedAdmissionYears);
    setAdmissionObject({...admissionObject, admissionYears:updatedAdmissionYears})//added this ////////////
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
      contentLabel="Register Admission"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Select New Register Year</h2>
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
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default RegisterModal;
