import { Link, useLocation } from "react-router-dom";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import useAuth from "../../hooks/useAuth";
const UsersManagement = () => {
  const location = useLocation();

  const { isEmployee ,isParent,isContentManager,isAnimator,isAcademic,isFinance,isHR,isDesk , isDirector ,isManager , isAdmin  } = useAuth();

  // Define the tabs for Users Management
  const tabs = [
   isAdmin&& { label: "All Users", path: "/admin/usersManagement/users/" },
   // { label: "New User", path: "/admin/usersManagement/newUser/" },
   // { label: "Option 3", path: "/admin/usersManagement/blabla" }, // Option 3 placeholder
  ];

  // Function to determine if a tab is active based on the current path
  const isActive = (path) => location.pathname === path;

  // Render the component content
  return (
    <div className="flex bg-gray-300 p-3 px-4 md:px-4  items-center justify-start space-x-4">
      <AcademicYearsSelection style={{ display: isDirector || isManager || isAdmin ? 'block' : 'none' }} />
      {tabs.filter(Boolean) // Filter out null or undefined tabs
      .map((tab) => (
        <Link key={tab.path} to={tab.path}>
          <li
            className={`list-none cursor-pointer px-3 py-2 border border-gray-400  ${
              isActive(tab.path)
                ? "text-sky-700 border-sky-700 bg-gray-100"
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

export default UsersManagement;