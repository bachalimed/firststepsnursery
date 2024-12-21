import { IoFileTrayStackedOutline } from "react-icons/io5";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import useAuth from "../../hooks/useAuth";
import { useLocation, Link } from "react-router-dom";

const MyProfile = () => {
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
    //   { label: "MyProfile", path: "/myProfile/resetPassword/" },
    //   { label: "Families", path: "/myProfile/myProfileParents/families/" },
    //   { label: "Admissions", path: "/myProfile/admissions/admissions/" },
    //   { label: "Enrolments", path: "/myProfile/enrolments/enrolments/" },
    //   (isAdmin || isManager) && {
    //     label: "Unenrolled MyProfile",
    //     path: "/myProfile/enrolments/unenrolments/",
    //   },
    //   //{ label: "New Admission", path: "/myProfile/admissions/newAdmission/" },
  ];

  // Function to determine if a tab is active based on the current path
  const isActive = (path) => location.pathname === path;

  // Render the component content
  return (
    <div className="flex bg-gray-300 p-3 px-4 md:px-4 items-center justify-start space-x-4">
      {(isAdmin || isManager || isDirector) && <AcademicYearsSelection />}
      {tabs.map((tab) => (
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

export default MyProfile;
