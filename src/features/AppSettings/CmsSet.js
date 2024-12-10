import { Link } from "react-router-dom";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import useAuth from "../../hooks/useAuth";
//we will  find the object corresponding to the page and extract the section tabs
const CmsSet = () => {
  const { isEmployee ,isParent,isContentManager,isAnimator,isAcademic,isFinance,isHR,isDesk , isDirector ,isManager , isAdmin  } = useAuth();
  let content;
  content = (
    <div className="flex bg-gray-300 p-1 px-4 md:px-8  items-center justify-start space-x-4">
      {(isDirector ||isManager || isAdmin)&&<AcademicYearsSelection />}
      <Link to={"/settings/cmsSet"}>
        <li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">
          page
        </li>
      </Link>
      <Link to={"/settings/cmsSet"}>
        <li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">
          new post
        </li>
      </Link>
      <Link to={"/settings/cmsSet"}>
        <li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">
          New Student
        </li>
      </Link>
    </div>
  );
  return content;
};

export default CmsSet;
