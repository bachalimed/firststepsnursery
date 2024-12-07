import React from "react";

const DashboardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex items-center justify-center h-16 border-t border-gray-300 text-sm text-gray-600">
      <p>&copy; {currentYear}</p>
    </footer>
  );
};

export default DashboardFooter;