import { Link } from "react-router-dom";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";

//we will  find the object corresponding to the page and extract the section tabs
const CmsSet = () => {
  const cmsTabs = {
    title: "CMS",
    path: "/settings/cmsSet",
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
    <div className="flex bg-gray-300 p-1 px-4 md:px-8  items-center justify-start space-x-4">
      <AcademicYearsSelection />
      <Link to={"/settings/cmsSet"}>
        <li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">
          page
        </li>
      </Link>
      <Link to={"/settings/cmsSet"}>
        <li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">
          new post
        </li>
      </Link>
      <Link to={"/settings/cmsSet"}>
        <li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">
          New Student
        </li>
      </Link>
    </div>
  );
  return content;
};

export default CmsSet;
