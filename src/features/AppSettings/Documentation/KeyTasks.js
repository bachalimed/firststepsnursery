import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import Documentation from "../Documentation";

const KeyTasks = () => {
  useEffect(()=>{document.title="Key Tasks"})

  const [openTask, setOpenTask] = useState(1); // Track the currently open task

  const toggleTask = (task) => {
    setOpenTask(openTask === task ? null : task); // Close if the same task is clicked, otherwise open the new one
  };

  return (
    <>
      <Documentation />
      <div className="p-6 font-sans">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Key Tasks</h1>
          <p className="text-xl text-gray-600 mt-2">
            Here's a summary of common tasks that can be performed:
          </p>
        </div>

        <div className="space-y-6">
          {/* Task 1 */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3
              onClick={() => toggleTask(1)}
              className="text-2xl mb-4 font-semibold text-blue-600 cursor-pointer"
            >
              Task 1: Register Students
            </h3>
            {openTask === 1 && (
              <div>
                <h4 className="text-1xl font-semibold text-sky-600 ml-6">
                  Register New Student
                </h4>
                <p className="text-lg text-gray-700 mt-2 ml-10">
                  If a student is new to the nursery, they should be registered
                  for the current academic year by creating a new record.
                </p>
                <Link
                  to="/students/studentsParents/newStudent/"
                  className="add-button inline-block mt-4 ml-12 mb-2 px-6 py-2"
                >
                  New Student
                </Link>
                <h4 className="text-1xl font-semibold text-sky-600 ml-6">
                  Register Old Student
                </h4>
                <p className="text-lg text-gray-700 mt-2 ml-10">
                  If a student is returning to the nursery, register them for
                  the current academic year by selecting their record and
                  updating the academic year.
                </p>
                <Link
                  to="/students/studentsParents/students/"
                  className="save-button inline-block mt-4 ml-12 mb-2 px-6 py-2"
                >
                  Students List
                </Link>
              </div>
            )}
          </div>

          {/* Task 2 */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3
              onClick={() => toggleTask(2)}
              className="text-2xl mb-4 font-semibold text-blue-600 cursor-pointer"
            >
              Task 2: Manage Admissions
            </h3>
            {openTask === 2 && (
              <div>
                <h4 className="text-1xl font-semibold text-sky-600 ml-6">
                  New Student Admission
                </h4>
                <p className="text-lg text-gray-700 mt-2 ml-10">
                  Once a student is registered, create an admission for each
                  service, setting agreed fees and planned months.
                </p>
                <Link
                  to="/students/admissions/newAdmission/"
                  className="add-button inline-block mt-4 ml-12 mb-2 px-6 py-2"
                >
                  New Admission
                </Link>
                <h4 className="text-1xl font-semibold text-sky-600 ml-6">
                  Authorise Fees
                </h4>
                <p className="text-lg text-gray-700 mt-2 ml-10">
                  Authorise flagged fees to approve them for future charges.
                </p>
                <Link
                  to="/students/admissions/admissions/"
                  className="save-button inline-block mt-4 ml-12 mb-2 px-6 py-2"
                >
                  Admissions List
                </Link>
              </div>
            )}
          </div>

          {/* Task 3 */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3
              onClick={() => toggleTask(3)}
              className="text-2xl mb-4 font-semibold text-blue-600 cursor-pointer"
            >
              Task 3: Manage Enrolments
            </h3>
            {openTask === 3 && (
              <div>
                <h4 className="text-1xl font-semibold text-sky-600 ml-6">
                  New Enrolment
                </h4>
                <p className="text-lg text-gray-700 mt-2 ml-10">
                  Create a new enrolment for registered students, specifying the
                  academic year and services. Unlike for admissions, one
                  enrolment is created per service (one admission can give way
                  to one or more enrolments)
                </p>
                <Link
                  to="/students/enrolments/newEnrolment/"
                  className="save-button inline-block mt-4 ml-12 mb-2 px-6 py-2"
                >
                  New Enrolment
                </Link>
              </div>
            )}
          </div>
          {/* Task 4 */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3
              onClick={() => toggleTask(4)}
              className="text-2xl mb-4 font-semibold text-blue-600 cursor-pointer"
            >
              Task 4: Manage Invoices
            </h3>
            {openTask === 4 && (
              <div>
                <h4 className="text-1xl font-semibold text-sky-600 ml-6">
                  New Invoice
                </h4>
                <p className="text-lg text-gray-700 mt-2 ml-10">
                  Invoices are automatically generated from the enrolments. From
                  the list of enrolments, select the enrolments you need to
                  invoice and click generate invoice.
                </p>
                <Link
                  to="/students/enrolments/enrolments/"
                  className="add-button inline-block mt-4 ml-12 mb-2 px-6 py-2"
                >
                  Enrolments List
                </Link>
                <h4 className="text-1xl font-semibold text-sky-600 ml-6">
                  Edit Invoice
                </h4>
                <p className="text-lg text-gray-700 mt-2 ml-10">
                  In case you need to edit an invoice (modify fee...) you can
                  edit the invoice after it is generated.
                </p>
                <Link
                  to="/finances/invoices/invoicesList/"
                  className="save-button inline-block mt-4 ml-12 mb-2 px-6 py-2"
                >
                  Invoices List
                </Link>
              </div>
            )}
          </div>
          {/* Task 5 */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3
              onClick={() => toggleTask(5)}
              className="text-2xl mb-4 font-semibold text-blue-600 cursor-pointer"
            >
              Task 5: Manage Payments
            </h3>
            {openTask === 5 && (
              <div>
                <h4 className="text-1xl font-semibold text-sky-600 ml-6">
                  New Payment
                </h4>
                <p className="text-lg text-gray-700 mt-2 ml-10">
                  Every income is recorded as new payment. One payment can be
                  made for more than one invoice and it should be the exact
                  total amount to be validated.
                </p>
                <Link
                  to="/finances/payments/newPayment/"
                  className="add-button inline-block mt-4 ml-12 mb-2 px-6 py-2"
                >
                  New Payment
                </Link>
                <h4 className="text-1xl font-semibold text-sky-600 ml-6">
                  Edit Payment
                </h4>
                <p className="text-lg text-gray-700 mt-2 ml-10">
                  No editing of payment is possible. if a change needs to be
                  done, remove the old ppayment and created a new payment with
                  the correct parameters.
                </p>
                <Link
                  to="/finances/payments/paymentsList/"
                  className="save-button inline-block mt-4 ml-12 mb-2 px-6 py-2"
                >
                  Payments List
                </Link>
              </div>
            )}
          </div>
          {/* Task 6 */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3
              onClick={() => toggleTask(6)}
              className="text-2xl mb-4 font-semibold text-blue-600 cursor-pointer"
            >
              Task 6: Manage Academics
            </h3>
            {openTask === 6 && (
              <div>
                <h4 className="text-1xl font-semibold text-sky-600 ml-6">
                  New Section
                </h4>
                <p className="text-lg text-gray-700 mt-2 ml-10">
                  The students in the nursery are organised into sections and
                  are appointed to an animator and a classroom. Any update to a
                  section students to animator will result in creation of new
                  section with a formation date and the record of the old
                  section with an end date. to create a section for the first
                  time, provide alabel, select a classroom, animator and the
                  list of students. the list of students is filtered to only
                  show the students with no section.
                </p>
                <Link
                  to="/academics/sections/newSection/"
                  className="add-button inline-block mt-4 ml-12 mb-2 px-6 py-2"
                >
                  New Section
                </Link>
                <h4 className="text-1xl font-semibold text-sky-600 ml-6">
                  Edit Section
                </h4>
                <p className="text-lg text-gray-700 mt-2 ml-10">
                  To edit a section, click the edit button of the section in
                  sections list.
                </p>
                <Link
                  to="/academics/sections/nurserySectionsList/"
                  className="save-button inline-block mt-4 ml-12 mb-2 px-6 py-2"
                >
                  Ssctions List
                </Link>
                <h4 className="text-1xl font-semibold text-sky-600 ml-6">
                  Assignments List
                </h4>
                <p className="text-lg text-gray-700 mt-2 ml-10">
                  Assignments designate the responsible for dropping or
                  collection from schools. Every animator should check which
                  school is affected to him and perform the task using the list
                  of students for the designated schools (from the planning or
                  sections list).
                </p>
                <Link
                  to="/academics/plannings/animatorsAssignments/"
                  className="save-button inline-block mt-4 ml-12 mb-2 px-6 py-2"
                >
                  Assignments List
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default KeyTasks;
