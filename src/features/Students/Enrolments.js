import { Link } from "react-router-dom";
import { FaListCheck } from "react-icons/fa6";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
const Enrolments = () => {
  const enrolmentTabs = {
    title: "Enrolments",
    icon: <FaListCheck />,
    path: "/students/enrolments",
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

  let content;
  content = (
    <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6">
      <Link to={"/students/admissions/allEnrolments"}>
        <li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">
          All Enrolments
        </li>
      </Link>
      <Link to={"/students/admissions/newEnrolment"}>
        <li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">
          New Enrolment
        </li>
      </Link>
      <Link to={"/students/admissions/ffefef"}>
        <li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">
          blabla
        </li>
      </Link>
      <AcademicYearsSelection />
    </div>
  );
  return content;
};

export default Enrolments;
