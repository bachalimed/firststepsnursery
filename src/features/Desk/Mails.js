import { Link } from "react-router-dom";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import useAuth from "../../hooks/useAuth";
//we will  find the object corresponding to the page and extract the section tabs
const Mails = () => {
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
  let content = (
    <div className="flex bg-gray-300 p-1 px-4 md:px-8 items-center justify-start space-x-4">
      {(isAdmin || isManager || isDirector) && <AcademicYearsSelection />}
      <Link to={"/desk/mails/mails/"}>
        <li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">
          All Mails
        </li>
      </Link>
      <Link to={"/desk/mails/myMails/"}>
        <li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">
          My Mailss{" "}
        </li>
      </Link>
      <Link to={"/desk/mails/newTask"}>
        <li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">
          New Task{" "}
        </li>
      </Link>
      <Link to={"/desk/mails/"}>
        <li>Task 3</li>
      </Link>
    </div>
  );
  return content;
};

export default Mails;
