import React, { useState } from 'react';
import { useGetStudentDocumentByIdQuery } from './studentDocumentsApiSlice'
import Modal from 'react-modal';

const ViewDocumentModal = ({ id, isOpen, onClose }) => {
    const { data: document,isSuccess, isLoading, isError, error } = useGetStudentDocumentByIdQuery(id)
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading document</div>
    if (isSuccess){
    console.log(id,'id','isopne:', isOpen,'onclose:', onClose, 'document',document)
    return (
        <Modal isOpen={isOpen} 
        onRequestClose={onClose} 
        
        contentLabel="View Document">
            {/* <h2>{document.studentDocumentLabel}</h2> */}
            {document.file.endsWith('.jpg') || document.file.endsWith('.jpeg') ? (
    <img src={`${document.file}`}  style={{ width: '100%', height: 'auto' }} />
) : (
    <iframe src={`${document.file}`} title="Document Viewer" width="100%" height="500px" frameBorder="0"></iframe>
)}

            <button onClick={() => window.print()}>Print</button>
            <a href={`${document.file}`} download>Save to Computer</a>
            <button onClick={onClose}>Close</button>
        </Modal>
    );
}
return null;
};

export default ViewDocumentModal;