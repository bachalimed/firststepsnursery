import { useLocation, Link } from "react-router-dom";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";

const StudentsParents = () => {
  const location = useLocation();

  // Define the tab data with paths and labels
  const tabs = [
    { label: "Students", path: "/students/studentsParents/students/" },
    { label: "Families", path: "/students/studentsParents/families/" },
    { label: "New Student", path: "/students/studentsParents/newStudent/" },
    { label: "New Family", path: "/students/studentsParents/newFamily/" },
  ];

  const studentsParentTabs = {
    title: "Students & Parents",
    path: "/students/studentsParents/", //needs to finish with this path and not /students so that section tabs could work
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

export default StudentsParents;
