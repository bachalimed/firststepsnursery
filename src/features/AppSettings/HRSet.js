import { Link, useLocation } from "react-router-dom";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";

const HRSet = () => {
  const location = useLocation();

  const hRSetTabs = {
    title: "HR",
    path: "/settings/HRSet",
    allowedRoles: [
      "Employee",
      "Parent",
      "ContentManager",
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

  // Define the tabs with their titles and paths
  const tabs = [
    {
      title: "Employee Documents List",
      path: "/settings/HRSet/EmployeeDocumentsListsList",
    },
    { title: " Sectionjhgfhg", path: "/settings/HRSett/" },
    { title: "Otherkjhhj", path: "/settings/HRSet/" },
  ];

  // Function to determine if the tab is active based on the current path
  const isActive = (path) => location.pathname === path;

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
            {tab.title}
          </li>
        </Link>
      ))}
    </div>
  );
};

export default HRSet;
