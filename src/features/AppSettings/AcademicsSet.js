import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import logo from "../../Data/logo.jpg";

//we will  find the object corresponding to the page and extract the section tabs
const AcademicsSet = () => {
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

  // Define the tabs with their titles and paths
  const tabs = [
    (isDirector || isManager || isAdmin) && {
      title: "Academic Years",
      path: "/settings/academicsSet/academicYears/",
    },
    (isDirector || isManager || isAdmin) && {
      title: "Schools",
      path: "/settings/academicsSet/attendedSchools/",
    },
    (isDirector || isManager || isAdmin) && {
      title: "Classrooms",
      path: "/settings/academicsSet/classrooms/",
    },
    // { title: "Otherkjhhj", path: "/settings/academicsSet/blaother" },
  ];

  // Function to determine if the tab is active based on the current path
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="flex bg-gray-300 p-3 px-4 md:px-4  items-center justify-start space-x-4">
        {(isAdmin || isManager || isDirector) && <AcademicYearsSelection />}
        {tabs
          .filter(Boolean) // Filter out null or undefined tabs
          .map((tab) => (
            <Link key={tab.path} to={tab.path}>
              <li
                className={`list-none cursor-pointer px-3 py-2 border border-gray-400  ${
                  isActive(tab.path)
                    ? "text-sky-700 border-sky-700 bg-gray-100"
                    : "text-gray-800 hover:text-fuchsia-500 hover:border-fuchsia-500"
                }`}
              >
                {tab.title}
              </li>
            </Link>
          ))}
      </div>
      {location.pathname === "/settings/academicsSet/" && (
        <div className="flex justify-center items-center bg-gray-300 py-4">
          <img
            src={logo}
            className=" rounded "
            alt="first steps nursery logo"
          />
        </div>
      )}
    </>
  );
};
export default AcademicsSet;
