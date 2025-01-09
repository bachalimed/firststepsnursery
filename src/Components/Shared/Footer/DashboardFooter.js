import React from "react";
import { Link } from "react-router-dom";
const DashboardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col md:flex-row items-center bg-sky-700 justify-between px-6 py-4 border-t border-gray-300 text-sm text-white">
    <p>&copy; {new Date().getFullYear()} First Steps Nursery. All rights reserved.</p>
    
    <div className="flex flex-col items-start mt-4 md:mt-0">
      <h3 className="font-bold text-white mb-2 ">Documentation</h3>
      <Link to="/settings/documentation/gettingStarted/" className="hover:underline">
        Getting Started
      </Link>
      <Link to="/settings/documentation/keyTasks/" className="hover:underline">
      Key Tasks
      </Link>
      <Link to="/settings/documentation/faqs/" className="hover:underline">
      FAQ
      </Link>
      
    </div>
  </footer>
  

  );
};

export default DashboardFooter;