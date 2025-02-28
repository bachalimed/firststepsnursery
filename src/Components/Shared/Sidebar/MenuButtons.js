import { useState, useEffect } from "react";
// import { IoMenuOutline } from "react-icons/io5";
import { LuCircleDollarSign, LuSchool, LuMail } from "react-icons/lu";
import { PiStudent } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { VscDashboard, VscPerson } from "react-icons/vsc";
import { GiHumanPyramid, GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { SlSettings } from "react-icons/sl";
import { BiHome } from "react-icons/bi";
import { IoFileTrayStackedOutline, IoSchoolOutline } from "react-icons/io5";
import { GrUserAdmin, GrTask } from "react-icons/gr";
import { GoPaperclip } from "react-icons/go";

// import { BsChevronDown } from "react-icons/bs";
// import { FaMailBulk } from "react-icons/fa";
// import { SiWebmoney } from "react-icons/si";
// import { RiParentLine } from "react-icons/ri";
// import { MdOutlineBusinessCenter } from "react-icons/md";
// import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
// import { FaListCheck } from "react-icons/fa6";
// import { HiMiniArrowsUpDown } from "react-icons/hi2";
// import { TbCreditCardPay, TbLogout } from "react-icons/tb";
// import { MdOutlinePermContactCalendar } from "react-icons/md";
// import { BsQuestionSquare } from "react-icons/bs";
// import { HiOutlineChatAlt } from "react-icons/hi";
// import { PiDotsThreeVerticalLight } from "react-icons/pi";
// import { sidebarMenuUp } from "../../lib/Consts/SidebarMenu";
// import { LuChevronLeft } from "react-icons/lu";
// import { CiViewList } from "react-icons/ci";

const MenuButtons = () => {
  const { username } = useAuth();
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
  //to set the open close of side bar

  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  return (
    // <header className="flex items-center justify-start max-sm:justify-center md:px-1 bg-sky-700">
     <header className="flex items-center justify-start  md:px-1 bg-sky-700 sticky top-0 z-40" style={{ height: "auto" }}>
      <Link to="/">
        <li
          className={`text-grey-300 text-sm flex text-white rounded-t-sm items-center gap-x-1 cursor-pointer p-2 hover:bg-sky-500  `}
        >
          <BiHome className="text-2xl" aria-label="home tab" />
          <span className="flex-1 hidden md:block">Home</span>
        </li>
      </Link>

      {(isDirector ||
        isManager ||
        isAdmin ||
        isAcademic ||
        isFinance ||
        isHR) && (
        <Link to="/dashboard/studentsDash/">
          <li
            className={`text-grey-300 text-sm flex text-white rounded-t-sm items-center gap-x-1 cursor-pointer p-2 hover:bg-sky-500 ${
              location.pathname.startsWith("/dashboard/")
                ? "bg-gray-300 text-red-900"
                : ""
            } `}
          >
            <VscDashboard className="text-2xl" aria-label="dashboard tab" />
            <span className="flex-1 hidden md:block">Dashboard</span>
          </li>
        </Link>
      )}

      {(isAcademic || isDesk || isDirector || isManager || isAdmin) && (
        <div className="relative">
          <Link to="/students/studentsParents/students/">
            <li
              className={`text-grey-300 text-sm flex    items-center gap-x-1 rounded-t-sm cursor-pointer p-2 hover:bg-sky-500  ${
                location.pathname.startsWith("/students/")
                  ? "bg-gray-300 text-black"
                  : "text-white"
              } `}
            >
              <PiStudent className="text-2xl" aria-label="students tab" />
              <span className="flex-1 hidden md:block">Students</span>
            </li>
          </Link>
        </div>
      )}
      {(isAnimator || isAcademic || isDirector || isManager || isAdmin) && (
        <div className="relative">
          <Link to="/academics/plannings/animatorsAssignments/">
            <li
              className={`text-grey-300 text-sm flex    items-center gap-x-1 rounded-t-sm cursor-pointer p-2 hover:bg-sky-500  ${
                location.pathname.startsWith("/academics/")
                  ? "bg-gray-300 text-black"
                  : "text-white"
              }`}
            >
              <IoSchoolOutline
                className="text-2xl "
                aria-label="academics tab"
              />
              <span className="flex-1 hidden md:block">Academics</span>
            </li>
          </Link>
        </div>
      )}
      {(isFinance || isDirector || isManager || isAdmin) && (
        <div className="relative">
          <Link to="/finances/invoices/invoicesList/">
            <li
              className={`text-grey-300 text-sm flex    items-center gap-x-1 rounded-t-sm cursor-pointer p-2 hover:bg-sky-500  ${
                location.pathname.startsWith("/finances/")
                  ? "bg-gray-300 text-black"
                  : "text-white"
              }`}
            >
              <LuCircleDollarSign
                className="text-2xl "
                aria-label="finances tab"
              />
              <span className="flex-1 hidden md:block">Finances</span>
            </li>
          </Link>
        </div>
      )}
      {(isHR || isDirector || isManager || isAdmin) && (
        <div className="relative">
          <Link to="/hr/employees/employeesList/">
            <li
              className={`text-grey-300 text-sm flex    items-center gap-x-1 rounded-t-sm cursor-pointer p-2 hover:bg-sky-500  ${
                location.pathname.startsWith("/hr/")
                  ? "bg-gray-300 text-black"
                  : "text-white"
              }`}
            >
              <GiHumanPyramid className="text-2xl " aria-label="hr tab" />
              <span className="flex-1 hidden md:block">HR</span>
            </li>
          </Link>
        </div>
      )}
      {/* {(isHR || isDirector || isManager || isAdmin) && (
        <div className="relative">
          <Link to="/reports/students/ageGroups/">
            <li
              className={`text-grey-300 text-sm flex   items-center gap-x-1 cursor-pointer p-2 hover:bg-sky-500  ${
                location.pathname.startsWith("/reports/")
                  ? "bg-gray-300 text-black"
                  : "text-white "
              }`}
            >
              <GoPaperclip  className="text-2xl " aria-label="reports tab" />
              <span className="flex-1 hidden md:block">Reports</span>
            </li>
          </Link>
        </div>
      )} */}
      {isAdmin && (
        <div className="relative">
          <Link to="/admin/usersManagement/users/">
            <li
              className={`text-grey-300 text-sm flex   items-center gap-x-1 rounded-t-sm cursor-pointer p-2 hover:bg-sky-500  ${
                location.pathname.startsWith("/admin/")
                  ? "bg-gray-300 text-black"
                  : "text-white "
              }`}
            >
              <GrUserAdmin className="text-2xl " aria-label="admin tab" />
              <span className="flex-1 hidden md:block">Admin</span>
            </li>
          </Link>
        </div>
      )}

      {/* start of reports section */}
      <div
        className="relative"
        onMouseEnter={() => setReportsOpen(true)}
        onMouseLeave={() => setReportsOpen(false)}
      >
        {(isFinance || isHR || isDirector || isManager || isAdmin) && (
          <Link to="/reports/studentsReports/ageGroupsReport/">
            <li
              className={`text-grey-300 text-sm flex    items-center gap-x-1 rounded-t-sm cursor-pointer p-2 hover:bg-sky-500  ${
                location.pathname.startsWith("/reports/")
                  ? "bg-gray-300 text-black"
                  : "text-white"
              }`}
            >
              <GoPaperclip className="text-2xl" aria-label="reports tab" />
              <span className="flex-1 hidden md:block">Reports</span>
            </li>
          </Link>
        )}
        {reportsOpen && (
          <ul className="absolute top-full left-0 bg-sky-500 text-white    shadow-md transition-all duration-300">
            {(isFinance || isDirector || isManager || isAdmin) && (
              <Link
                to="/reports/studentsReports/ageGroupsReport/"
                className={
                  location.pathname.startsWith("/reports/") ? "bg-sky-100" : ""
                }
              >
                <li
                  className={`text-grey-300 text-sm flex  text-white  items-center gap-x-1 cursor-pointer p-2 hover:bg-gray-100 hover:text-black `}
                >
                  Students
                </li>
              </Link>
            )}
            {(isDirector || isManager || isAdmin) && (
              <Link
                to="/reports/academicsReports/"
                className={
                  location.pathname.startsWith("/reports/") ? "bg-sky-100" : ""
                }
              >
                <li
                  className={`text-grey-300 text-sm flex  text-white  items-center gap-x-1 cursor-pointer p-2 hover:bg-sky-100 hover:text-black `}
                >
                  Academics
                </li>
              </Link>
            )}
            {(isFinance || isDirector || isManager || isAdmin) && (
              <Link
                to="/reports/financesReports/expensesReport/"
                className={
                  location.pathname.startsWith("/reports/") ? "bg-sky-100" : ""
                }
              >
                <li
                  className={`text-grey-300 text-sm flex  text-white  items-center gap-x-1 cursor-pointer p-2 hover:bg-sky-100 hover:text-black `}
                >
                  Finances
                </li>
              </Link>
            )}
            {(isHR || isDirector || isManager || isAdmin) && (
              <Link
                to="/reports/hrReports/leavesReport/"
                className={
                  location.pathname.startsWith("/reports/") ? "bg-sky-100" : ""
                }
              >
                <li
                  className={`text-grey-300 text-sm flex  text-white  items-center gap-x-1 cursor-pointer p-2 hover:bg-sky-100 hover:text-black `}
                >
                  HR
                </li>
              </Link>
            )}
          </ul>
        )}
      </div>
      {/* end of reports section */}
      <div
        className="relative"
        onMouseEnter={() => setSettingsOpen(true)}
        onMouseLeave={() => setSettingsOpen(false)}
      >
        {(isFinance || isHR || isDirector || isManager || isAdmin) && (
          <Link to="/settings/studentsSet/">
            <li
              className={`text-grey-300 text-sm flex    items-center gap-x-1 cursor-pointer rounded-t-sm p-2 hover:bg-sky-500   ${
                location.pathname.startsWith("/settings/")
                  ? "bg-gray-300 text-black"
                  : "text-white"
              }`}
            >
              <SlSettings className="text-2xl" aria-label="settings tab" />
              <span className="flex-1 hidden md:block">Settings</span>
            </li>
          </Link>
        )}
        {settingsOpen && (
          <ul className="absolute top-full left-0 bg-sky-500 text-white    shadow-md transition-all duration-300">
            {(isFinance || isDirector || isManager || isAdmin) && (
              <Link
                to="/settings/studentsSet/"
                className={
                  location.pathname.startsWith("/settings/") ? "bg-sky-100" : ""
                }
              >
                <li
                  className={`text-grey-300 text-sm flex  text-white  items-center gap-x-1 cursor-pointer p-2 hover:bg-sky-100 hover:text-black `}
                >
                  Students
                </li>
              </Link>
            )}
            {(isDirector || isManager || isAdmin) && (
              <Link
                to="/settings/academicsSet/"
                className={
                  location.pathname.startsWith("/settings/") ? "bg-sky-100" : ""
                }
              >
                <li
                  className={`text-grey-300 text-sm flex  text-white  items-center gap-x-1 cursor-pointer p-2 hover:bg-sky-100 hover:text-black `}
                >
                  Academics
                </li>
              </Link>
            )}
            {(isFinance || isDirector || isManager || isAdmin) && (
              <Link
                to="/settings/financesSet/"
                className={
                  location.pathname.startsWith("/settings/") ? "bg-sky-100" : ""
                }
              >
                <li
                  className={`text-grey-300 text-sm flex  text-white  items-center gap-x-1 cursor-pointer p-2 hover:bg-sky-100 hover:text-black `}
                >
                  Finances
                </li>
              </Link>
            )}
            {(isHR || isDirector || isManager || isAdmin) && (
              <Link
                to="/settings/HRSet/"
                className={
                  location.pathname.startsWith("/settings/") ? "bg-sky-100" : ""
                }
              >
                <li
                  className={`text-grey-300 text-sm flex  text-white  items-center gap-x-1 cursor-pointer p-2 hover:bg-sky-100 hover:text-black `}
                >
                  HR
                </li>
              </Link>
            )}
            {(isHR || isFinance || isDirector || isManager || isAdmin) && (
              <Link
                to="/settings/documentation/"
                className={
                  location.pathname.startsWith("/settings/") ? "bg-sky-100" : ""
                }
              >
                <li
                  className={`text-grey-300 text-sm flex  text-white  items-center gap-x-1 cursor-pointer p-2 hover:bg-sky-100 hover:text-black `}
                >
                  Documentation
                </li>
              </Link>
            )}
          </ul>
        )}
      </div>
    </header>
  );
};

export default MenuButtons;
