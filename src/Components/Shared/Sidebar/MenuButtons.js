import { useState, useEffect } from "react";
import { IoMenuOutline } from "react-icons/io5";
import logo from "./../../../Data/logo.jpg";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { BsChevronDown } from "react-icons/bs";
import { VscDashboard, VscPerson } from "react-icons/vsc";
import { PiStudent } from "react-icons/pi";
import { LuCircleDollarSign, LuSchool, LuMail } from "react-icons/lu";
import { GiHumanPyramid, GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { FaMailBulk } from "react-icons/fa";
import { SiWebmoney } from "react-icons/si";
import { SlSettings } from "react-icons/sl";
import { BiHome } from "react-icons/bi";
import { RiParentLine } from "react-icons/ri";
import { IoFileTrayStackedOutline, IoSchoolOutline } from "react-icons/io5";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { FaListCheck } from "react-icons/fa6";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { TbCreditCardPay, TbLogout } from "react-icons/tb";
import { MdOutlinePermContactCalendar } from "react-icons/md";
import { BsQuestionSquare } from "react-icons/bs";
import { HiOutlineChatAlt } from "react-icons/hi";
import { PiDotsThreeVerticalLight } from "react-icons/pi";
import { sidebarMenuUp } from "../../lib/Consts/SidebarMenu";
import { LuChevronLeft } from "react-icons/lu";
import { GrUserAdmin, GrTask } from "react-icons/gr";
import { CiViewList } from "react-icons/ci";

const MenuButtons = () => {
  const { username } = useAuth();

  //to set the open close of side bar
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [financesOpen, setFinancesOpen] = useState(false);
  const [hrOpen, setHrOpen] = useState(false);
  const [deskOpen, setDeskOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // State to control header expansion
  const [open, setOpen] = useState(true); // teh side bar open or not
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  let content;
  content = (
    <div className="relative">
      <header
        className={`bg-teal-500 text-white py-1 px-4 md:px-8 flex  gap-x-4 items-center shadow-md `}
      >
        <button className="text-grey-300 p-2 hover:bg-sky-700 rounded-md md:hidden">
          <IoMenuOutline className="text-2xl" />
        </button>

        <Link to="/dashboard/">
          <li
            className={`text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}
          >
            <VscDashboard className="text-2xl" />
            <span className="flex-1 hidden md:block">Dashboard</span>
          </li>
        </Link>
        <Link to="/">
          <li
            className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
          >
            <BiHome className="text-2xl " />
            <span className="flex-1 hidden md:block">Public</span>
          </li>
        </Link>
        <div className="relative">
          <Link to="/students/studentsParents/students/">
            <li
              className={`text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md`}
            >
              <PiStudent className="text-2xl" />
              <span className="flex-1 hidden md:block">Students</span>
            </li>
          </Link>
        </div>
        {/* this link will start the first tab instead of the sections  */}
        <div className="relative">
          <Link to="/academics/sections/nurserySectionsList/">
            <li
              className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
            >
              <IoSchoolOutline className="text-2xl " />
              <span className="flex-1 hidden md:block">Academics</span>
            </li>
          </Link>
        </div>
        <div className="relative">
          <Link to="/finances/Invoices/invoicesList">
            <li
              className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
            >
              <LuCircleDollarSign className="text-2xl " />
              <span className="flex-1 hidden md:block">Finances</span>
            </li>
          </Link>
        </div>
        <div className="relative">
          <Link to="/hr/employees/employeesList/">
            <li
              className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
            >
              <GiHumanPyramid className="text-2xl " />
              <span className="flex-1 hidden md:block">HR</span>
            </li>
          </Link>
        </div>

        <div className="relative">
          <Link to="/admin/usersManagement/users/">
            <li
              className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
            >
              <GrUserAdmin className="text-2xl " />
              <span className="flex-1 hidden md:block">Admin</span>
            </li>
          </Link>
        </div>
        <div
  className="relative"
  onMouseEnter={() => setSettingsOpen(true)}
  onMouseLeave={() => setSettingsOpen(false)}
>
  <Link to="/settings/studentsSet/">
    <li
      className={`text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md`}
    >
      <SlSettings className="text-2xl" />
      <span className="flex-1 hidden md:block">Settings</span>
    </li>
  </Link>
  {settingsOpen && (
    <ul className="absolute top-full left-0 bg-teal-500 text-white border border-gray-300 rounded-md shadow-md transition-all duration-300">
      {/* <Link
        to="/settings/dashboardSet/"
        className={
          location.pathname === "/settings/dashboardSet/"
            ? "text-teal-200"
            : ""
        }
      >
        <li
          className={`text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md`}
        >
          Dashboard
        </li>
      </Link> */}
      <Link
        to="/settings/studentsSet/"
        className={
          location.pathname === "/settings/studentsSet/"
            ? "text-teal-200"
            : ""
        }
      >
        <li
          className={`text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md`}
        >
          Students
        </li>
      </Link>
      <Link
        to="/settings/academicsSet/"
        className={
          location.pathname === "/settings/academicsSet/"
            ? "text-teal-200"
            : ""
        }
      >
        <li
          className={`text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md`}
        >
          Academics
        </li>
      </Link>
      <Link
        to="/settings/financesSet/"
        className={
          location.pathname === "/settings/financesSet/"
            ? "text-teal-200"
            : ""
        }
      >
        <li
          className={`text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md`}
        >
          Finances
        </li>
      </Link>
      <Link
        to="/settings/HRSet/"
        className={
          location.pathname === "/settings/HRSet/"
            ? "text-teal-200"
            : ""
        }
      >
        <li
          className={`text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md`}
        >
          HR
        </li>
      </Link>
      {/* <Link
        to="/settings/deskSet/"
        className={
          location.pathname === "/settings/deskSet/"
            ? "text-teal-200"
            : ""
        }
      >
        <li
          className={`text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md`}
        >
          Desk
        </li>
      </Link> */}
      {/* <Link
        to="/settings/cmsSet/"
        className={
          location.pathname === "/settings/cmsSet/"
            ? "text-teal-200"
            : ""
        }
      >
        <li
          className={`text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md`}
        >
          CMS
        </li>
      </Link> */}
    </ul>
  )}
</div>

      </header>
    </div>
  );
  return content;
};
export default MenuButtons;
