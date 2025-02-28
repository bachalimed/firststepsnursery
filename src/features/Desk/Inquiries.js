import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { BsQuestionSquare } from "react-icons/bs";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
//we will  find the object corresponding to the page and extract the section tabs
const Inquiries = () => {
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
      <Link to={"/desk/inquiries/"}>
        <li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">
          all Inquiries
        </li>
      </Link>
      <Link to={"/desk/inquiries/"}>
        <li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">
          New Inquiry{" "}
        </li>
      </Link>
      <Link to={"/desk/inquiries/"}>
        <li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">
          Inquiry 3
        </li>
      </Link>
    </div>
  );
  return content;
};

export default Inquiries;
