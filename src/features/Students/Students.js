
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import useAuth from "../../hooks/useAuth";
import { useLocation, Link } from "react-router-dom";


const Students = () => {
  const location = useLocation();
  const { isEmployee ,isParent,isContentManager,isAnimator,isAcademic,isFinance,isHR,isDesk , isDirector ,isManager , isAdmin  } = useAuth();


  // Define the tab data with paths and labels
  const tabs = [
   (isAcademic|| isDesk ||isDirector||isManager || isAdmin) &&{ label: "Students", path: "/students/studentsParents/students/" },
   (isAcademic|| isDesk ||isDirector||isManager || isAdmin) &&{ label: "Families", path: "/students/studentsParents/families/" },
   (isAcademic|| isDesk ||isDirector||isManager || isAdmin) &&{ label: "Admissions", path: "/students/admissions/admissions/" },
   (isAcademic|| isDesk ||isDirector||isManager || isAdmin) &&{ label: "Enrolments", path: "/students/enrolments/enrolments/" },
   (isAcademic|| isDesk ||isDirector||isManager || isAdmin) &&{ label: "Unenrolled Students", path: "/students/enrolments/unenrolments/"},
    //{ label: "New Admission", path: "/students/admissions/newAdmission/" },
  ];


  // Function to determine if a tab is active based on the current path
  const isActive = (path) => location.pathname === path;

  // Render the component content
  return (
    <div className="flex bg-gray-300 p-3  px-4 md:px-4 items-center justify-start space-x-4">
      {(isDirector ||isManager || isAdmin)&&<AcademicYearsSelection />}
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
            {tab.label}
          </li>
        </Link>
      ))}
    </div>
  );
};

export default Students;
