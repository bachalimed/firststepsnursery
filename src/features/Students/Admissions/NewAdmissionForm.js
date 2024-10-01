import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; // Assuming you're using Redux for state management

const NewAdmissionForm = () => {
  // Local state for form data
  const [formData, setFormData] = useState({
    student: "",
    admissionYear: "",
    admissionDate: "",
    agreedFees: [
      {
        service: "",
        feeValue: 0,
        feePeriod: "",
        feeStartDate: "",
        feeEndDate: "",
      },
    ],
    admidsionCreator: "", // Set to the logged-in user id
    admidsionOperator: "", // Set to the operator id
  });

  // State for academic years, service types, and student data fetched from backend
  const [academicYears, setAcademicYears] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [students, setStudents] = useState([]);

  // Example of logged-in userId (adjust based on your auth system)
  const userId = useSelector((state) => state.auth.userId);

  // Fetch academic years, service types, and students from backend
  useEffect(() => {
    async function fetchData() {
      try {
        const [academicYearsRes, serviceTypesRes, studentsRes] = await Promise.all([
          axios.get("/api/academicYears"), // Example endpoint
          axios.get("/api/services"), // Example endpoint for services
          axios.get("/api/students"), // Example endpoint for students
        ]);
        setAcademicYears(academicYearsRes.data);
        setServiceTypes(serviceTypesRes.data);
        setStudents(studentsRes.data);
        setFormData((prevData) => ({
          ...prevData,
          admidsionCreator: userId,
          admidsionOperator: userId, // Set the current user as the operator by default
        }));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData();
  }, [userId]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle agreedFees change
  const handleAgreedFeesChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAgreedFees = [...formData.agreedFees];
    updatedAgreedFees[index] = { ...updatedAgreedFees[index], [name]: value };
    setFormData((prevData) => ({
      ...prevData,
      agreedFees: updatedAgreedFees,
    }));
  };

  // Add new agreed fee
  const addAgreedFee = () => {
    setFormData((prevData) => ({
      ...prevData,
      agreedFees: [
        ...prevData.agreedFees,
        {
          service: "",
          feeValue: 0,
          feePeriod: "",
          feeStartDate: "",
          feeEndDate: "",
        },
      ],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit the form data
      await axios.post("/api/admissions", formData);
      alert("Admission created successfully!");
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-md">
      <h2 className="text-xl font-bold">New Admission</h2>

      {/* Student Dropdown */}
      <div>
        <label htmlFor="student" className="block text-sm font-medium text-gray-700">
          Student
        </label>
        <select
          id="student"
          name="student"
          value={formData.student}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      {/* Admission Year Dropdown */}
      <div>
        <label htmlFor="admissionYear" className="block text-sm font-medium text-gray-700">
          Admission Year
        </label>
        <select
          id="admissionYear"
          name="admissionYear"
          value={formData.admissionYear}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select Year</option>
          {academicYears.map((year) => (
            <option key={year._id} value={year.year}>
              {year.year}
            </option>
          ))}
        </select>
      </div>

      {/* Admission Date */}
      <div>
        <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700">
          Admission Date
        </label>
        <input
          type="date"
          id="admissionDate"
          name="admissionDate"
          value={formData.admissionDate}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Agreed Fees */}
      <div>
        <h3 className="text-lg font-semibold">Agreed Fees</h3>
        {formData.agreedFees.map((fee, index) => (
          <div key={index} className="space-y-2 p-4 bg-gray-100 rounded-md mb-4">
            {/* Service Dropdown */}
            <div>
              <label htmlFor={`service-${index}`} className="block text-sm font-medium text-gray-700">
                Service
              </label>
              <select
                id={`service-${index}`}
                name="service"
                value={fee.service}
                onChange={(e) => handleAgreedFeesChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Service</option>
                {serviceTypes.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fee Value */}
            <div>
              <label htmlFor={`feeValue-${index}`} className="block text-sm font-medium text-gray-700">
                Fee Value
              </label>
              <input
                type="number"
                id={`feeValue-${index}`}
                name="feeValue"
                value={fee.feeValue}
                onChange={(e) => handleAgreedFeesChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Fee Period */}
            <div>
              <label htmlFor={`feePeriod-${index}`} className="block text-sm font-medium text-gray-700">
                Fee Period
              </label>
              <input
                type="text"
                id={`feePeriod-${index}`}
                name="feePeriod"
                value={fee.feePeriod}
                onChange={(e) => handleAgreedFeesChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Fee Start Date */}
            <div>
              <label htmlFor={`feeStartDate-${index}`} className="block text-sm font-medium text-gray-700">
                Fee Start Date
              </label>
              <input
                type="date"
                id={`feeStartDate-${index}`}
                name="feeStartDate"
                value={fee.feeStartDate}
                onChange={(e) => handleAgreedFeesChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Fee End Date */}
            <div>
              <label htmlFor={`feeEndDate-${index}`} className="block text-sm font-medium text-gray-700">
                Fee End Date
              </label>
              <input
                type="date"
                id={`feeEndDate-${index}`}
                name="feeEndDate"
                value={fee.feeEndDate}
                onChange={(e) => handleAgreedFeesChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addAgreedFee}
          className="mt-2 text-blue-600 hover:underline"
        >
          Add Another Fee
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700"
      >
        Submit Admission
      </button>
    </form>
  );
};

export default NewAdmissionForm;
