
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import useAuth from "../../hooks/useAuth";
import { useLocation, Link } from "react-router-dom";
//we will  find the object corresponding to the page and extract the section tabs
const Dashboard = () => {
  const location = useLocation();
  const { isAdmin, isManager } = useAuth();
  const studentsParentTabs = {
    title: "Dashboard",
    path: "/settings/dashboardSet",
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

 

   // Define the tab data with paths and labels
   const tabs = [
    { label: " Dashboard", path: "/settings/dashboardSet/" },
    { label: "Parents", path: "settings/dashboardSet/" },
    { label: " New Student", path: "/students/admissions/admissions/" },
    { label: "Enrolments", path: "/students/enrolments/enrolments/" },
    (isAdmin || isManager) && {
      label: "Unenrolled Students",
      path: "/students/enrolments/unenrolments/",
    },
    //{ label: "New Admission", path: "/students/admissions/newAdmission/" },
  ];

  const isActive = (path) => location.pathname === path;
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

export default Dashboard;
