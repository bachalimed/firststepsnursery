import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import useAuth from "../../hooks/useAuth"
import { useLocation, Link } from "react-router-dom";
import firststeps from '../../Data/firststeps.png'
const Notifications = () => {
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
    (isAcademic || isDesk || isDirector || isManager || isAdmin) && {
      label: "Notifications",
      path: "/notifications/notifications/notificationsList/",
    },
    // (isAcademic || isDesk || isDirector || isManager || isAdmin) && {
    //   label: "Families",
    //   path: "/notifications/notificationsParents/families/",
    // },
    // (isAcademic || isDesk || isDirector || isManager || isAdmin) && {
    //   label: "Admissions",
    //   path: "/notifications/admissions/admissions/",
    // },
    // (isAcademic || isDesk || isDirector || isManager || isAdmin) && {
    //   label: "Enrolments",
    //   path: "/notifications/enrolments/enrolments/",
    // },
    // ( isManager || isAdmin) && {
    //   label: "Unenrolled Notifications",
    //   path: "/notifications/enrolments/unenrolments/",
    // },
    //{ label: "New Admission", path: "/notifications/admissions/newAdmission/" },
  ];


  // Function to determine if a tab is active based on the current path
  const isActive = (path) => location.pathname === path;


  // Render the component content
  return (
    <>
    <div className="flex bg-gray-300 p-3 px-4 md:px-4 items-center justify-start space-x-4 ">
      {(isAdmin || isManager || isDirector) && <AcademicYearsSelection />}
     
        {tabs
          .filter(Boolean) // Filter out null or undefined tabs
          .map((tab) => (
            <Link key={tab.path} to={tab.path}>
              <li
                className={`list-none flex-1 cursor-pointer px-3 py-2 border border-gray-400  ${
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
    {location.pathname === "/notifications/" &&
    <div className="flex justify-center items-center bg-gray-300 py-4">
      <img
            src={firststeps}
            className=" rounded "
            alt="first steps nursery logo"
            
          />
    </div>}
    </>
  );
};

export default Notifications;
