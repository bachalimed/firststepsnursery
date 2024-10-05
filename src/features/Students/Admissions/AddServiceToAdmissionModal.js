import React, { useState } from 'react';

const AddServiceToAdmissionModal = ({ availableServices, agreedServices, onAddService, anchor }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [error, setError] = useState('');

  // Filter out services already in agreedServices
  const filteredServices = availableServices.filter(service => 
    !agreedServices.some(agreed => agreed.id === service.id)
  );

  const handleServiceSelect = (serviceId) => {
    const service = filteredServices.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
    }
  };

  const handleAddService = () => {
    if (!selectedService) {
      setError('Please select a service.');
      return;
    }

    // Check if service periodicity is respected (you'll need logic based on your schema)
    // Assuming service.periodicity needs to be unique or checked against agreedServices
    const isPeriodicConflict = agreedServices.some(s => 
      s.periodicity === selectedService.periodicity
    );

    if (isPeriodicConflict) {
      setError('This service conflicts with the periodicity of an existing service.');
      return;
    }

    // Check if service feeValue is below anchor and set isFlagged accordingly
    const newService = {
      ...selectedService,
      isFlagged: selectedService.feeValue < anchor
    };

    // Call the onAddService function with the new service
    onAddService(newService);

    // Close modal or reset selection
    setSelectedService(null);
    setError('');
  };

  return (
    <div className="modal">
      <h2>Add a New Service</h2>
      
      {error && <p className="error">{error}</p>}

      <select onChange={(e) => handleServiceSelect(e.target.value)}>
        <option value="">Select a service</option>
        {filteredServices.map(service => (
          <option key={service.id} value={service.id}>
            {service.name} (Fee: {service.feeValue}, Periodicity: {service.periodicity})
          </option>
        ))}
      </select>

      <button onClick={handleAddService}>Add Service</button>
    </div>
  );
};

export default AddServiceToAdmissionModal;
