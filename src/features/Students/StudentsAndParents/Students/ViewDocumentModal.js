import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useGetStudentDocumentByIdQuery } from './studentDocumentsApiSlice';

Modal.setAppElement('#root'); // Ensure accessibility

const ViewDocumentModal = ({ id, isOpen, onRequestClose }) => {
    const { data: blob, isLoading, isError, error, isSuccess } = useGetStudentDocumentByIdQuery(id);
    const [fileUrl, setFileUrl] = useState('');

    useEffect(() => {
        if (isSuccess && blob) {
            try {
                const url = URL.createObjectURL(blob);
                setFileUrl(url);
            } catch (error) {
                console.error('Failed to create object URL:', error);
            }
        }

        return () => {
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
            }
        };
    }, [isSuccess, blob]);

    const handleClose = () => {
        setFileUrl('');
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="View Document"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <h2>View Document</h2>
            {isLoading && <p>Loading...</p>}
            {isError && <p className="errmsg">Error loading document: {error?.message}</p>}
            {isSuccess && fileUrl && (
                <div>
                    {blob.type.startsWith('image/') ? (
                        <img src={fileUrl} alt="Document" className="document-image" />
                    ) : blob.type === 'application/pdf' ? (
                        <iframe src={fileUrl} title="Document" style={{ width: '100%', height: '600px' }} />
                    ) : (
                        <a href={fileUrl} download="document" className="document-link">
                            Download Document
                        </a>
                    )}
                </div>
            )}
            <div className="modal-actions">
                <button onClick={handleClose}>Close</button>
            </div>
        </Modal>
    );
};

export default ViewDocumentModal;