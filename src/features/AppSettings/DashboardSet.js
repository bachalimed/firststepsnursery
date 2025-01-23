import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import useAuth from "../../hooks/useAuth";
import { useLocation, Link } from "react-router-dom";
import firststeps from "../../Data/firststeps.png";

//we will  find the object corresponding to the page and extract the section tabs
const Dashboard = () => {
  const location = useLocation();
  const {
    isEmployee,
    isParent,
    isContentManager,
    isAnimator,
    isAcademic,
    isFinance,
    isHR,
    isDesk,
    isDirector,
    isManager,
    isAdmin,
  } = useAuth();

  // Define the tab data with paths and labels
  const tabs = [
    (isDirector || isManager || isAdmin) && {
      label: " bla",
      path: "/settings/dashboardSet/",
    },
    (isDirector || isManager || isAdmin) && {
      label: "bls",
      path: "settings/dashboardSet/",
    },
  ];

  const isActive = (path) => location.pathname === path;
  return (
    <>
      <div className="flex bg-gray-300 p-3 px-4 md:px-4 items-center justify-start space-x-4">
        {(isAdmin || isManager || isDirector) && <AcademicYearsSelection />}
        {tabs
          .filter(Boolean) // Filter out null or undefined tabs
          .map((tab) => (
            <Link key={tab.path} to={tab.path}>
              <li
                className={`list-none cursor-pointer rounded-sm px-3 py-2 border border-gray-400  ${
                  isActive(tab.path)
                    ? "text-sky-700 border-sky-700 bg-gray-100"
                    : "text-gray-800 hover:text-fuchsia-500 hover:border-fuchsia-500"
                }`}
              >
                {tab.label}
              </li>
            </Link>
          ))}
      </div>{" "}
      {location.pathname === "/settings/dashboardSet/" && (
        <div className="flex justify-center items-center bg-gray-300 py-4">
          <img
            src={firststeps}
            className=" rounded "
            alt="first steps nursery logo"
          />
        </div>
      )}
    </>
  );
};

export default Dashboard;
