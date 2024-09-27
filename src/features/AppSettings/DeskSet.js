import { Link } from "react-router-dom";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";

//we will  find the object corresponding to the page and extract the section tabs
const DeskSet = () => {
  const deskSetTabs = {
    title: "Desk",
    path: "/settings/deskSet",
    allowedRoles: [
      "Employee",
      "Parent",
      "ContentManager",
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
      <Link to={"/settings/deskSet/"}>
        <li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">
          Students
        </li>
      </Link>
      <Link to={"/settings/deskSet/"}>
        <li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">
          Parents
        </li>
      </Link>
      <Link to={"/settings/deskSet/"}>
        <li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">
          New Student
        </li>
      </Link>
      <AcademicYearsSelection />
    </div>
  );
  return content;
};

export default DeskSet;
