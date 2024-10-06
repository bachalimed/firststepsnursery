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
    { label: "blabla", path: "/students/enrolments/bla/" },
  ];

  // Function to determine if a tab is active based on the current path
  const isActive = (path) => location.pathname === path;

  // Render the component content
  return (
    <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6">
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
      <AcademicYearsSelection />
    </div>
  );
};

export default Enrolments;
