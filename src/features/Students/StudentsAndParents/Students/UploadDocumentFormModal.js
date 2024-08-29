import React, { useState } from 'react';
import Modal from 'react-modal'; // You need to install react-modal: npm install react-modal


Modal.setAppElement('#root'); // This is to ensure accessibility

const UploadDocumentFormModal = ({ isOpen, onRequestClose, studentId, year, onUpload, studentDocumentsListing }) => {
    const [studentDocumentLabel, setStudentDocumentLabel] = useState('');
    const [studentDocumentReference, setStudentDocumentType] = useState('');
    const [studentDocumentYear, setStudentDocumentYear] =useState(year)
    const [file, setFile] = useState(null);

    //console.log('the updated listing in teh modal',studentDocumentsListing )
    const handleUpload = () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }
        onUpload({ studentId, studentDocumentYear, studentDocumentLabel, studentDocumentReference, file });
        onRequestClose();
    };




    return (
       <Modal 
            isOpen={isOpen} 
            onRequestClose={onRequestClose}
            contentLabel="Upload Document"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <h2>Upload Document</h2>
            <label>
                Document Label:
                <input 
                    type="text" 
                    value={studentDocumentLabel} 
                    onChange={(e) => setStudentDocumentLabel(e.target.value)} 
                />
            </label>
            <label>
                Document Type:
                <select 
                    value={studentDocumentReference} 
                    onChange={(e) => setStudentDocumentType(e.target.value)}
                >    <option value="">Select Type</option>
                 {Array.isArray(studentDocumentsListing) && studentDocumentsListing.map((doc) => (//will not show the docs where we have studetndocumentid toavoid uploading same document title
                    (!doc.studentDocumentId&&<option key ={doc.documentReference} value={doc.documentReference}>{doc.documentTitle}</option>)
                    ))}
                </select>
            </label>
            <label>
                Choose File:
                <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])} 
                />
            </label>
            <div className="modal-actions">
                <button onClick={onRequestClose}>Cancel</button>
                <button onClick={handleUpload}>Upload</button>
            </div>
        </Modal>
    );
};

export default UploadDocumentFormModal;