import React from "react";
import { IoCheckbox } from "react-icons/io5";
import { Link } from "react-router-dom";

const FamilyCompleted = () => {
  return (
    <div className="container md:mt-10">
      <div className="flex flex-col items-center">
        <IoCheckbox className="text-green-700 w-24 h-24" />
      </div>
      <div className="mt-3 text-xl font-semibold uppercase text-green-700">
        Family Details Saved
      </div>
      <Link to="/students/studentsParents/families/">
        <button className="h-10 px-5 text-green-700 transition-colors duration-150 border border-gray-300 rounded-lg focus:shadow-outline hover:bg-green-600 hover:Text-green-100">
          Close
        </button>
      </Link>
    </div>
  );
};

export default FamilyCompleted;
