import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import { Link, useLocation } from "react-router-dom";

//we will  find the object corresponding to the page and extract the section tabs
const AcademicsSet = () => {
  const location = useLocation();
  const academicsSetTabs = {
    title: "Academics",
    path: "/settings/academicsSet",
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
    sectionTabs: [
      {
        title: "Academic Years",
        path: "academicYears/",
        allowedRoles: ["Academic", "Director", "Manager", "Admin"],
      },

      {
        title: "Schools",
        path: "attendedSchools/",
        allowedRoles: ["Academic", "Director", "Manager", "Admin"],
      },

      {
        title: "bloblo",
        path: "/settings/bloblo/",
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
      },
    ],
  };

  // Define the tabs with their titles and paths
  const tabs = [
    {
      title: "Academic Years",
      path: "/settings/academicsSet/academicYears/",
    },
    {
      title: "attendedSchools",
      path: "/settings/academicsSet/attendedSchools/",
    },
    { title: "Classrooms", path: "/settings/academicsSet/classrooms/" },
    { title: "Otherkjhhj", path: "/settings/academicsSet/blaother" },
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
export default AcademicsSet;
