import React from 'react';
import Modal from "react-modal";


const FeeAuthorisationModal = ({ isOpen, onClose, services, onAuthorize }) => {
  const handleAuthorise = (serviceId) => {
    onAuthorize(serviceId); // Call the function passed as prop to authorize the service
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold">Authorise Fees</h2>
      <div className="mt-4">
        {services.map((service) => (
          <div key={service.id} className="flex items-center justify-between">
            <span>{service.service.serviceType}</span>
            {!service.isAuthorised ? (
              <button
                className="text-blue-500"
                onClick={() => handleAuthorise(service.id)}
              >
                Authorize
              </button>
            ) : (
              <span className="text-green-500">Authorized</span>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default FeeAuthorisationModal;
