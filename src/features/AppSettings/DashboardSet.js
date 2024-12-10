
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
    { label: " bla", path: "/settings/dashboardSet/" },
    { label: "bls", path: "settings/dashboardSet/" },
   
  ];

  const isActive = (path) => location.pathname === path;
  return (
    <div className="flex bg-gray-300 p-1 px-4 md:px-8 items-center justify-start space-x-4">
      <AcademicYearsSelection />
      {tabs.map((tab) => (
        <Link key={tab.path} to={tab.path}>
          <li
            className={`list-none cursor-pointer px-4 py-2 border border-gray-400 rounded-md ${
              isActive(tab.path)
                ? "text-sky-700 border-sky-500 bg-blue-100"
                : "text-gray-800 hover:text-fuchsia-500 hover:border-fuchsia-500"
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
