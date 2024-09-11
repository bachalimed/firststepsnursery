import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import StudentsParents from '../../StudentsParents';
import { IoCheckmarkSharp } from 'react-icons/io5';
import { GrDocumentUpload, GrView } from 'react-icons/gr';
import { RiDeleteBin6Line } from 'react-icons/ri';
const FamilyDetails = () => {
  const {id}= useParams()//this is the raference used in app.js for the route
  const parent = useSelector(state=> state.parent?.entities[id])
  console.log(id, 'parentid ')
  console.log(parent, 'parent ')
  return (<>
    <StudentsParents/>
    <div className="flex-1 bg-white px-6 py-4 rounded-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Parents Details</h2>
      
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Father Personal Information</h3>
        <p><strong>Name:</strong> {parent.userProfile.userFullName.userFirstName} {parent.userProfile.userFullName.userMiddleName} {parent.userProfile.userFullName.userLastName}</p>
        <p><strong>Date of Birth:</strong> {new Date(parent.userProfile.userDob).toLocaleDateString()}</p>
        <p><strong>Sex:</strong> {parent.userProfile.userSex}</p>
        <p><strong>Active:</strong> {parent.userProfile.userIsActive ? 'Yes' : 'No'}</p>
        <p><strong>Address:</strong> {parent.userProfile.userAddress.house} {parent.userProfile.userAddress.street}</p>
        <p><strong>Address:</strong> {parent.userProfile.userAddress.area} {parent.userProfile.userAddress.postCode}</p>
        <p><strong>Address:</strong> {parent.userProfile.userAddress.city} </p>

      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Mother Personal Information</h3>
        <p><strong>Name:</strong> {parent.partner.userProfile.userFullName.userFirstName} {parent.userProfile.userFullName.userMiddleName} {parent.userProfile.userFullName.userLastName}</p>
        <p><strong>Date of Birth:</strong> {new Date(parent.partner.userProfile.userDob).toLocaleDateString()}</p>
        <p><strong>Sex:</strong> {parent.userProfile.userSex}</p>
        <p><strong>Active:</strong> {parent.partner.userProfile.userIsActive ? 'Yes' : 'No'}</p>
        <p><strong>Address:</strong> {parent.partner.userProfile.userAddress.house} {parent.userProfile.userAddress.street}</p>
        <p><strong>Address:</strong> {parent.partner.userProfile.userAddress.area} {parent.userProfile.userAddress.postCode}</p>
        <p><strong>Address:</strong> {parent.partner.userProfile.userAddress.city} </p>

      </div>
        {parent.children && parent.children.length > 0 ? (
        parent.children.map((child, index) => (
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Children</h3>
        <p><strong>child Name:</strong> {child.studentName.firstName} {child.studentName.middleName} {child.studentName.lastName}</p>
        <p><strong>Date of Birth:</strong> {new Date(child.studentDob).toLocaleDateString()}</p>
        <p><strong>Sex:</strong> {child.studentSex}</p>
        <p><strong>Joint Family:</strong> {child.studentJointFamily ? 'Yes' : 'No'}</p>
        
      </div>
    ))
  ) : (
    <p>No children profiles available.</p>
  )}

   
    </div>
    </>
  );
};

export default FamilyDetails