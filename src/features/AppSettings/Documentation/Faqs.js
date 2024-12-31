import { Link } from "react-router-dom";
import Documentation from "../Documentation";
import React, { useState } from "react";

const Faqs = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (questionIndex) => {
    setOpenQuestion(openQuestion === questionIndex ? null : questionIndex);
  };

  const faqs = [
    {
      question: "What arragements to perform for a new academic year?",
      answer:
        "For a new academic year, you should"+
        "create a new academic year (Settings=>academics=>academic years=>new academic year),"+
        " set a student documents list for the new acadmeic year( settings=>students=>student documents list=> new list),"+
        "create services for the new year (settings=>students=>services=>new service), "+
        "create / renew payees for the new academic year (settings=>finances=>payees=>new payee),"+
        "create new expense categories (settings=>finances=>expense categories=> new category),"+
        "create new employee documents list (settings=>hr=>employee documents list=>new list),"+
        "edit employees to add the new academic year to employee years (hr=>employee list=>edit employee)",
    },
    {
      question: "If I delete a family, what happens to the parent and students records?",
      answer:
        "The parents records will be deleted, but the studetn will be kept without a family so that his history is not lost.",
    },
    {
      question: "If a student has only one parent, how to record a family?",
      answer:
        "you can provide the name of the deceised parent or jsut a John Doe generic name and mention in the family situation that family is not joint.",
    },
    {
      question: "If I lose my password, how to gain access to the application?",
      answer:
        "You can use the option 'forgot Password' in the login page and we will provide you with a new password as soon as we get your request.",
    },
    {
      question: "How do I know if no student was left for enrolment?",
      answer:
        "You can view the list of students that have admission for services but were not enrolled for that month in the unenrolled list.",
    },
  ];

  return (
    <>
      <Documentation />
      <div className="p-6 font-sans">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            Find answers to commonly asked questions about the application.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-lg">
              <h3
                onClick={() => toggleQuestion(index)}
                className="text-xl font-semibold text-blue-600 cursor-pointer"
              >
                {faq.question}
              </h3>
              {openQuestion === index && (
                <p className="text-lg text-gray-700 mt-2">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      ;
    </>
  );
};

export default Faqs;
