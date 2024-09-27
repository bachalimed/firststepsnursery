import { Link } from "react-router-dom";
import { LuSchool } from "react-icons/lu";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
const NurseryPlannings = () => {
  const NurseryPlanningsTabs = {
    title: "Nursery Plannings",
    icon: <LuSchool />,
    path: "/academics/nurseryPlannings",
    allowedRoles: [
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
      <Link to={"/academics/schoolPlannings/"}>
        <li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">
          nurs Planning
        </li>
      </Link>
      <Link to={"/academics/schoolPlannings/"}>
        <li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">
          ners plan
        </li>
      </Link>
      <Link to={"/academics/schoolPlannings/"}>
        <li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">
          new pppl anning
        </li>
      </Link>
      <AcademicYearsSelection />
    </div>
  );
  return content;
};

export default NurseryPlannings;
