import React from 'react'
import { useParams } from 'react-router'

const StudentDetails = () => {
  const {studentId}= useParams()//this is the raference used in app.js for the route
  return (
    <div>StudentDetails of student with ID {studentId}</div>
  )
}

export default StudentDetails