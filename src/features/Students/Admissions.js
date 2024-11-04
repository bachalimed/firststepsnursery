
import { IoFileTrayStackedOutline } from "react-icons/io5";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";

import { useLocation, Link } from "react-router-dom";

const Admissions = () => {
  const location = useLocation();
  
  const admissionsTabs = {
    title: "Admissions",
    path: "/students/admissions",
    allowedRoles: [
      "Parent",
      "Animator",
      "Academic",
      "Director",
      "Finance",
      "HR",
      "Desk",
      "Manager",
      "Admin",
    ],
  };





  // Define the tab data with paths and labels
  const tabs = [
    { label: "Admissions", path: "/students/admissions/admissions/" },
    { label: "New Admission", path: "/students/admissions/newAdmission/" },
    //{ label: "blabla", path: "/students/admissions/bla/" },
    
  ];

  // Function to determine if a tab is active based on the current path
  const isActive = (path) => location.pathname === path;

  // Render the component content
  return (
    <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6">
      <AcademicYearsSelection />
      {tabs.map((tab) => (
        <Link key={tab.path} to={tab.path}>
          <li
            className={`list-none cursor-pointer ${
              isActive(tab.path)
                ? "text-blue-500"
                : "text-gray-800 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </li>
        </Link>
      ))}
    </div>
  );
};

export default Admissions;
