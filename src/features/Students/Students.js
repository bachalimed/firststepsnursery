import { IoFileTrayStackedOutline } from "react-icons/io5";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import useAuth from "../../hooks/useAuth";
import { useLocation, Link } from "react-router-dom";


const Students = () => {
  const location = useLocation();
  const { isAdmin, isManager } = useAuth();
  const admissionsTabs = {
    title: "Admissions",
    path: "/students/admissions",
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

  // Define the tab data with paths and labels
  const tabs = [
    { label: "Students", path: "/students/studentsParents/students/" },
    { label: "Families", path: "/students/studentsParents/families/" },
    { label: "Admissions", path: "/students/admissions/admissions/" },
    { label: "Enrolments", path: "/students/enrolments/enrolments/" },
    (isAdmin || isManager) && {
      label: "Unenrolled Students",
      path: "/students/enrolments/unenrolments/",
    },
    //{ label: "New Admission", path: "/students/admissions/newAdmission/" },
  ];

  // Function to determine if a tab is active based on the current path
  const isActive = (path) => location.pathname === path;

  // Render the component content
  return (
    <div className="flex bg-gray-300 p-1  px-4 md:px-8 items-center justify-start space-x-4">
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

export default Students;
