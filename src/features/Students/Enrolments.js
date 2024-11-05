import { FaListCheck } from "react-icons/fa6";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import { IoFileTrayStackedOutline } from "react-icons/io5";

import { useLocation, Link } from "react-router-dom";

const Enrolments = () => {
  const location = useLocation();
  const enrolmentTabs = {
    title: "Enrolments",
    icon: <FaListCheck />,
    path: "/students/enrolments",
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
    { label: "Enrolments", path: "/students/enrolments/enrolments/" },
    { label: "New Enrolment", path: "/students/enrolments/newEnrolment/" },
    { label: "Unenrolled Students", path: "/students/enrolments/unenrolled/" },
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
           className={`list-none cursor-pointer px-4 py-2 border border-gray-400 rounded-md ${
            isActive(tab.path)
              ? "text-blue-500 border-blue-500 bg-blue-100"
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

export default Enrolments;
