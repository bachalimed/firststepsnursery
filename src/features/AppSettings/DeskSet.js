import { Link, useLocation } from "react-router-dom";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import useAuth from "../../hooks/useAuth";
//we will  find the object corresponding to the page and extract the section tabs
const DeskSet = () => {
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

  let content;
  content = (
    <div className="flex bg-gray-300 p-1 px-4 md:px-8 items-center justify-start space-x-4">
      {(isAdmin || isManager || isDirector) && <AcademicYearsSelection />}
      <Link to={"/settings/deskSet/"}>
        <li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">
          Students
        </li>
      </Link>
      <Link to={"/settings/deskSet/"}>
        <li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">
          Parents
        </li>
      </Link>
      <Link to={"/settings/deskSet/"}>
        <li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">
          New Student
        </li>
      </Link>
    </div>
  );
  return content;
};

export default DeskSet;
