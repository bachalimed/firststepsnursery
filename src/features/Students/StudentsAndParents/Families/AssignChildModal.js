import Modal from 'react-modal'
import React, { useState } from 'react';


const AssignChildModal = ({ isOpen, onClose, onConfirm, students }) => {
  const [selectedStudent, setSelectedStudent] = useState('');

  const handleSelectChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleConfirm = () => {
    onConfirm(selectedStudent);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Assign Child to Parent</h2>
        <select 
          value={selectedStudent} 
          onChange={handleSelectChange} 
          className="border border-gray-300 rounded-md p-2 w-full"
        >
          <option value="">Select a Child</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.studentName.firstName} {student.studentName.middleName}{student.studentName.lastName}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button 
            onClick={handleConfirm} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={!selectedStudent}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignChildModal