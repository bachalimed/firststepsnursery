import React from "react";

const DashboardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex items-center bg-sky-700 justify-center h-16 border-t border-gray-300 text-sm text-white">
      <p>&copy; {new Date().getFullYear()} First Steps Nursery. All rights reserved.</p>
    </footer>
  );
};

export default DashboardFooter;