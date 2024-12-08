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
  const [open, setOpen] = useState(true); // teh side bar open or not
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [financesOpen, setFinancesOpen] = useState(false);
  const [hrOpen, setHrOpen] = useState(false);
  const [deskOpen, setDeskOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // State to control header expansion
  const location = useLocation();
  const company = { label: "First Steps", type: "Nursery" };

  let content;
  content = (<div className="relative">
    <header className={`bg-teal-500 text-white py-1 px-4 md:px-8 flex  gap-x-4 items-center shadow-md ${isExpanded ? 'flex-col absolute' : 'flex'}`}>
        <button
                className="text-grey-300 p-2 hover:bg-sky-700 rounded-md md:hidden"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <IoMenuOutline className="text-2xl" />
            </button>
           
      <Link to="/dashboard/">
        <li
          className={`text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}
        >
          <VscDashboard className="text-2xl" />
          <span className="flex-1">Dashboard</span>
        </li>
      </Link>
      <Link to="/">
        <li
          className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
          onClick={() => setOpen(!open)}
        >
          <BiHome className="text-2xl " />
          <span className="text-base font-light flex-1 duration-200">
            Public
          </span>
        </li>
      </Link>
      <div className="relative">
        <Link to="/students/studentsParents/students/">
          <li
            className={`text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md`}
            onMouseEnter={() => setStudentsOpen(true)}
            onMouseLeave={() => setStudentsOpen(false)}
          >
            <PiStudent className="text-2xl" />
            <span className="text-base font-light flex-1">Students</span>
          </li>
        </Link>
        {/* {studentsOpen && (
          <ul className="absolute top-full left-0 bg-teal-500 text-white border border-gray-300 rounded-md shadow-md transition-all duration-300">
            <Link
              to="/students/studentsParents/students/"
              className={
                location.pathname === "/students/studentsParents/students/"
                  ? "text-teal-200"
                  : ""
              }
            >
              <li className="text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md">
                Students & Parents
              </li>
            </Link>
            <Link
              to="/students/admissions/admissions/"
              className={
                location.pathname === "/students/admissions/admissions/"
                  ? "text-teal-200"
                  : ""
              }
            >
              <li className="text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md">
                Admissions
              </li>
            </Link>
            <Link
              to="/students/enrolments/enrolments/"
              className={
                location.pathname === "/students/enrolments/enrolments/"
                  ? "text-teal-200"
                  : ""
              }
            >
              <li className="text-grey-300 text-sm flex border border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md">
                Enrolments
              </li>
            </Link>
          </ul>
        )} */}
      </div>
      {/* this link will start the first tab instead of the sections  */}
      <div className="relative">
        <Link to="/academics/sections/nurserySectionsList/">
          <li
            className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
            onMouseEnter={() => setAcademicsOpen(true)}
            onMouseLeave={() => setAcademicsOpen(false)}
          >
            <IoSchoolOutline className="text-2xl " />
            <span className="text-base font-light flex-1 duration-200">
              Academics
            </span>
          </li>
        </Link>
        {/* {academicsOpen && (
           <ul className="absolute top-full left-0 bg-teal-500 text-white border border-gray-300 rounded-md shadow-md transition-all duration-300">
            <Link
              to="/academics/sections/nurserySectionsList/"
              className={
                location.pathname === "/academics/sections/nurserySectionsList/"
                  ? "text-teal-200"
                  : ""
              }
            >
              <li
                className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
              >
                Sections
              </li>
            </Link>
            <Link
              to="/academics/plannings/sectionsPlannings/"
              className={
                location.pathname === "/academics/plannings/sectionsPlannings/"
                  ? "text-teal-200"
                  : ""
              }
            >
              <li
                className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
              >
                Plannings
              </li>
            </Link> */}
            {/* <Link
               to="/academics/nurseryPlannings/"
               className={
                 location.pathname === "/academics/nurseryPlannings/"
                   ? "text-teal-200"
                   : ""
               }
             >
              <li
             className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
               >
              
                 Nursery Plannings
               </li>
             </Link> */}
            {/* <Link
               to="/academics/collectionDrop/"
               className={
                 location.pathname === "/academics/collectionDrop/"
                   ? "text-teal-200"
                   : ""
               }
             >
              <li
             className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
               >
               
                 Collection&Drop
               </li>
             </Link> */}
          {/* </ul>
        )} */}
      </div>
      <div className="relative">
        <Link to="/finances/Invoices/invoicesList">
          <li
            className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
            onMouseEnter={() => setFinancesOpen(true)}
            onMouseLeave={() => setFinancesOpen(false)}
          >
            <LuCircleDollarSign className="text-2xl " />
            <span className="text-base font-light flex-1 duration-200">
              Finances
            </span>
          </li>
        </Link>
        {/* {financesOpen && (
           <ul className="absolute top-full left-0 bg-teal-500 text-white border border-gray-300 rounded-md shadow-md transition-all duration-300">
            <Link
              to="/finances/invoices/invoicesList/"
              className={
                location.pathname === "/finances/invoices/invoicesList/"
                  ? "text-teal-200"
                  : ""
              }
            >
              <li
                className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
              >
                Invoices
              </li>
            </Link>
            <Link
              to="/finances/payments/paymentsList/"
              className={
                location.pathname === "/finances/payments/paymentsList/"
                  ? "text-teal-200"
                  : ""
              }
            >
              <li
                className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
              >
                Payments
              </li>
            </Link>
            <Link
              to="/finances/expenses/expensesList/"
              className={
                location.pathname === "/finances/expenses/expensesList/"
                  ? "text-teal-200"
                  : ""
              }
            >
              <li
                className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
              >
                Expenses
              </li>
            </Link>
          </ul>
        )} */}
      </div>
      <div className="relative">
        <Link to="/hr/employees/employeesList/">
          <li
            className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
            onMouseEnter={() => setHrOpen(true)}
            onMouseLeave={() => setHrOpen(false)}
          >
            <GiHumanPyramid className="text-2xl " />
            <span className="text-base font-light flex-1 duration-200">HR</span>
          </li>
        </Link>
        {/* {hrOpen && (
           <ul className="absolute top-full left-0 bg-teal-500 text-white border border-gray-300 rounded-md shadow-md transition-all duration-300">
            <Link
              to="/hr/employees/employeesList/"
              className={
                location.pathname === "/hr/employees/employeesList/"
                  ? "text-teal-200"
                  : ""
              }
            >
              <li
                className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
              >
                Employees
              </li>
            </Link> */}
            {/* <Link
               to="/hr/payroll/"
               className={
                 location.pathname === "/hr/payroll/" ? "text-teal-200" : ""
               }
             >
              <li
             className={`text-grey-300 text-sm flex border items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
               >
                
                 Payroll
               </li>
             </Link> */}
            {/* <Link
               to="/hr/leave/"
               className={
                 location.pathname === "/hr/leave/" ? "text-teal-200" : ""
               }
             >
               <li
             className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
               >
              
                 Leave
               </li>
             </Link> */}
          {/* </ul>
        )} */}
      </div>
      {/* <Link to="/desk/inquiries/">
          <li
             className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
           >
             <span
               className="text-2xl block float-left"
               onClick={() => setOpen(true)}
             >
               <FaMailBulk />
             </span>
             <span
               className={`text-base font-light flex-1 ${
                 !open 
               } duration-200`}
               onClick={() => setOpen(!open)}
             >
               
               Desk
             </span>
             {open && (
               <BsChevronDown
                 className={`${deskOpen && "rotate-180"}`}
                 onClick={() => setDeskOpen(!deskOpen)}
               />
             )}
           </li>
         </Link>
         {open && deskOpen && (
           <ul>
             <Link
               to="/desk/inquiries/"
               className={
                 location.pathname === "/desk/inquiries/"
                   ? "text-teal-200"
                   : ""
               }
             >
              <li
             className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
               >
               
                 Inquiries
               </li>
             </Link>
             <Link
               to="/desk/tasks/"
               className={
                 location.pathname === "/desk/tasks/" ? "text-teal-200" : ""
               }
             >
               <li
             className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
               >
               
                 Tasks
               </li>
             </Link>
             <Link
               to="/desk/Chat/"
               className={
                 location.pathname === "/desk/Chat/" ? "text-teal-200" : ""
               }
             >
              <li
             className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
               >
              
                 Chat
               </li>
             </Link>
             <Link
               to="/desk/mails/"
               className={
                 location.pathname === "/desk/mails/" ? "text-teal-200" : ""
               }
             >
              <li
             className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
               >
              
                 Mails
               </li>
             </Link>
           </ul>
         )} */}
      {/* <Link to="/cms/">
           <li
             className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
             onClick={() => setOpen(!open)}
           >
             <span className="text-2xl block float-left">
               <SiWebmoney />
             </span>
             <span
               className={`text-base font-light flex-1 ${
                 !open 
               } duration-200`}
             >
               
               CMS
             </span>
           </li>
         </Link> */}

      
      <div className="relative">
        <Link to="/admin/usersManagement/users/">
          <li
            className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
            onMouseEnter={() => setAdminOpen(true)}
            onMouseLeave={() => setAdminOpen(false)}
          >
            <GrUserAdmin className="text-2xl " />
            <span className="text-base font-light flex-1 duration-200">
              Admin
            </span>
          </li>
        </Link>
        {/* {adminOpen && (
            <ul className="absolute top-full left-0 bg-teal-500 text-white border border-gray-300 rounded-md shadow-md transition-all duration-300">
            <Link
              to="/admin/usersManagement/users/"
              className={
                location.pathname === "/admin/usersManagement/users/"
                  ? "text-teal-200"
                  : ""
              }
            >
              <li
                className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
                onClick={() => setOpen(!open)}
              >
                Users Management
              </li>
            </Link> */}
            {/* <Link
                 to="/settings/deskSet/blabla"
                 className={
                   location.pathname === "/settings/deskSet/blabla"
                     ? "text-teal-200"
                     : ""
                 }
               >
                 <li
             className={`text-grey-300 text-sm flex border items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
                   onClick={() => setOpen(!open)}
                 >
                 
                   Blabla
                 </li>
               </Link> */}
          {/* </ul>
        )} */}
      </div>
      <div className="relative">
        <Link to="/settings/studentsSet/">
          <li
            className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
            onMouseEnter={() => setSettingsOpen(true)}
            onMouseLeave={() => setSettingsOpen(false)}
          >
            <SlSettings className="text-2xl " />
            <span className="text-base font-light flex-1 duration-200">
              Settings
            </span>
          </li>
        </Link>
         {settingsOpen && (
            <ul className="absolute top-full left-0 bg-teal-500 text-white border border-gray-300 rounded-md shadow-md transition-all duration-300">
            <Link
              to="/settings/dashboardSet/"
              className={
                location.pathname === "/settings/dashboardSet/"
                  ? "text-teal-200"
                  : ""
              }
            >
              <li
                className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
                onClick={() => setOpen(!open)}
              >
                Dashboard
              </li>
            </Link>
            <Link
              to="/settings/studentsSet/"
              className={
                location.pathname === "/settings/studentsSet/"
                  ? "text-teal-200"
                  : ""
              }
            >
              <li
                className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
                onClick={() => setOpen(!open)}
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
                className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
                onClick={() => setOpen(!open)}
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
                className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
                onClick={() => setOpen(!open)}
              >
                Finances
              </li>
            </Link>
            <Link
              to="/settings/HRSet/"
              className={
                location.pathname === "/settings/HRSet/" ? "text-teal-200" : ""
              }
            >
              <li
                className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
                onClick={() => setOpen(!open)}
              >
                HR
              </li>
            </Link> 
             <Link
                 to="/settings/deskSet/"
                 className={
                   location.pathname === "/settings/deskSet/"
                     ? "text-teal-200"
                     : ""
                 }
               >
                 <li
             className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
                   onClick={() => setOpen(!open)}
                 >
                
                   Desk
                 </li>
               </Link>
            <Link
                 to="/settings/cmsSet/"
                 className={
                   location.pathname === "/settings/cmsSet/"
                     ? "text-teal-200"
                     : ""
                 }
               >
                 <li
             className={`text-grey-300 text-sm flex border  border-gray-300 items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
                   onClick={() => setOpen(!open)}
                 >
                
                   CMS
                 </li>
               </Link> 
           </ul>
        )} 
      </div>
    </header>
    </div>
  );
  return content;
};
export default MenuButtons;
