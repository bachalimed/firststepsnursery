// // the actual side bar operating with no need of the menu json items from the files

// import { useState } from "react";
// import logo from "./../../../Data/logo.jpg";
// import { Link } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import useAuth from "../../../hooks/useAuth";
// import { BsChevronDown } from "react-icons/bs";
// import { VscDashboard, VscPerson } from "react-icons/vsc";
// import { PiStudent } from "react-icons/pi";
// import { LuCircleDollarSign, LuSchool, LuMail } from "react-icons/lu";
// import { GiHumanPyramid, GiReceiveMoney, GiPayMoney } from "react-icons/gi";
// import { FaMailBulk } from "react-icons/fa";
// import { SiWebmoney } from "react-icons/si";
// import { SlSettings } from "react-icons/sl";
// import { BiHome } from "react-icons/bi";
// import { RiParentLine } from "react-icons/ri";
// import { IoFileTrayStackedOutline, IoSchoolOutline } from "react-icons/io5";
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
// import { GrUserAdmin, GrTask } from "react-icons/gr";
// import { CiViewList } from "react-icons/ci";
// import { IoMenuOutline } from "react-icons/io5";

// // import { CgPushChevronLeftR } from "react-icons/cg"

// const DashboardSidebar = () => {
//   //to set the open close of side bar
//   const [open, setOpen] = useState(true); // teh side bar open or not
//   const [studentsOpen, setStudentsOpen] = useState(false);
//   const [academicsOpen, setAcademicsOpen] = useState(false);
//   const [financesOpen, setFinancesOpen] = useState(false);
//   const [hrOpen, setHrOpen] = useState(false);
//   const [deskOpen, setDeskOpen] = useState(false);
//   const [settingsOpen, setSettingsOpen] = useState(false);
//   const [adminOpen, setAdminOpen] = useState(false);

//   const location = useLocation();
//   const company = { label: "First Steps", type: "Nursery" };

//   let content;
//   content = (
//     <div
//     className={`bg-gray-900  ${
//       open ? "w-56" : "w-20"
//     } p-3 flex flex-col min-h-screen text-white duration-300 relative`}
//   >
    
//     <div className="flex items-center space-x-2">
//         <img
//           src={logo}
//            className="h-12 w-12 rounded-lg"
//           alt="logo image"
//         />
//         <span
//           className={`origin-left font-medium duration-300 ${
//             !open && "scale-0"
//           }`}
//         >
//           {company.label} <br />
//           {company.type}
//         </span>
//       </div>
//       <LuChevronLeft
//         className={` text-gray-600 text-3xl rounded-lg ${
//           !open && "rotate-180"
//         } bg-teal-200 absolute -right-4 top-6 cursor-pointer`}
//         onClick={() => setOpen(!open)}
//       />
//       <br />
//       <div className="flex-1 border-t border-neutral-600 pt-4">
//       <ul className="space-y-2">
//           <Link to="/dashboard/">
//             <li
//               className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}
//               onClick={() => setOpen(!open)}
//             >
//               <span className="text-2xl block float-left">
//                 <VscDashboard />{" "}
//               </span>
//               <span
//                 className={`text-base font-light flex-1 ${
//                   !open && "hidden"
//                 } duration-200`}
//               >
//                 {" "}
//                 Dashboard
//               </span>
//             </li>
//           </Link>
//           {/* this link will start the first tab instead of the studentsParents  */}
//           <Link to="/students/studentsParents/students/">
//             <li
//               className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md  `}
//             >
//               <span
//                 className="text-2xl block float-left duration-200"
//                 onClick={() => setOpen(true)}
//               >
//                 <PiStudent />{" "}
//               </span>
//               <span
//                 className={`text-base font-light flex-1 ${
//                   !open && "hidden"
//                 } duration-200`}
//                 onClick={() => setOpen(!open)}
//               >
//                 {" "}
//                 Students
//               </span>
//               {open && (
//                 <BsChevronDown
//                   className={`${studentsOpen && "rotate-180"}`}
//                   onClick={() => setStudentsOpen(!studentsOpen)}
//                 />
//               )}
//             </li>
//           </Link>
//           {open && studentsOpen && (
//             <ul>
//               <Link
//                 to="/students/studentsParents/students/"
//                 className={
//                   location.pathname === "/students/studentsParents/students/"
//                     ? "text-teal-200"
//                     : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <RiParentLine />{" "}
//                   </span>
//                   Students & Parents
//                 </li>
//               </Link>
//               <Link
//                 to="/students/admissions/admissions/"
//                 className={
//                   location.pathname === "/students/admissions/admissions/"
//                     ? "text-teal-200"
//                     : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <IoFileTrayStackedOutline />{" "}
//                   </span>
//                   Admissions
//                 </li>
//               </Link>
//               <Link
//                 to="/students/enrolments/enrolments/"
//                 className={
//                   location.pathname === "/students/enrolments/enrolments/"
//                     ? "text-teal-200"
//                     : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <FaListCheck />{" "}
//                   </span>
//                   Enrolments
//                 </li>
//               </Link>
//             </ul>
//           )}
//           {/* this link will start the first tab instead of the sections  */}
//           <Link to="/academics/sections/nurserySectionsList/">
//             <li
//               className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}
//             >
//               <span
//                 className="text-2xl block float-left"
//                 onClick={() => setOpen(true)}
//               >
//                 <IoSchoolOutline />{" "}
//               </span>
//               <span
//                 className={`text-base font-light flex-1 ${
//                   !open && "hidden"
//                 } duration-200`}
//                 onClick={() => setOpen(!open)}
//               >
//                 {" "}
//                 Academics
//               </span>
//               {open && (
//                 <BsChevronDown
//                   className={`${academicsOpen && "rotate-180"}`}
//                   onClick={() => setAcademicsOpen(!academicsOpen)}
//                 />
//               )}
//             </li>
//           </Link>
//           {open && academicsOpen && (
//             <ul>
//               <Link
//                 to="/academics/sections/nurserySectionsList/"
//                 className={
//                   location.pathname ===
//                   "/academics/sections/nurserySectionsList/"
//                     ? "text-teal-200"
//                     : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <CiViewList />{" "}
//                   </span>
//                   Sections
//                 </li>
//               </Link>
//               <Link
//                 to="/academics/plannings/sectionsPlannings/"
//                 className={
//                   location.pathname ===
//                   "/academics/plannings/sectionsPlannings/"
//                     ? "text-teal-200"
//                     : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <MdOutlineBusinessCenter />{" "}
//                   </span>
//                   Plannings
//                 </li>
//               </Link>
//               {/* <Link
//                 to="/academics/nurseryPlannings/"
//                 className={
//                   location.pathname === "/academics/nurseryPlannings/"
//                     ? "text-teal-200"
//                     : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <LuSchool />{" "}
//                   </span>
//                   Nursery Plannings
//                 </li>
//               </Link> */}
//               {/* <Link
//                 to="/academics/collectionDrop/"
//                 className={
//                   location.pathname === "/academics/collectionDrop/"
//                     ? "text-teal-200"
//                     : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <HiMiniArrowsUpDown />{" "}
//                   </span>
//                   Collection&Drop
//                 </li>
//               </Link> */}
//             </ul>
//           )}
//           <Link to="/finances/Invoices/invoicesList">
//             <li
//               className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}
//             >
//               <span
//                 className="text-2xl block float-left"
//                 onClick={() => setOpen(true)}
//               >
//                 <LuCircleDollarSign />{" "}
//               </span>
//               <span
//                 className={`text-base font-light flex-1 ${
//                   !open && "hidden"
//                 } duration-200`}
//                 onClick={() => setOpen(!open)}
//               >
//                 {" "}
//                 Finances
//               </span>
//               {open && (
//                 <BsChevronDown
//                   className={`${financesOpen && "rotate-180"}`}
//                   onClick={() => setFinancesOpen(!financesOpen)}
//                 />
//               )}
//             </li>
//           </Link>
//           {open && financesOpen && (
//             <ul>
              

//               <Link
//                 to="/finances/invoices/invoicesList/"
//                 className={
//                   location.pathname === "/finances/invoices/invoicesList/"
//                     ? "text-teal-200"
//                     : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <LiaFileInvoiceDollarSolid />{" "}
//                   </span>
//                   Invoices
//                 </li>
//               </Link>
//               <Link
//                 to="/finances/payments/paymentsList/"
//                 className={
//                   location.pathname === "/finances/payments/paymentsList/"
//                     ? "text-teal-200"
//                     : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <GiReceiveMoney />{" "}
//                   </span>
//                   Payments
//                 </li>
//               </Link>
//               <Link
//                 to="/finances/expenses/expensesList/"
//                 className={
//                   location.pathname === "/finances/expenses/expensesList/"
//                     ? "text-teal-200"
//                     : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <GiPayMoney />{" "}
//                   </span>
//                   Expenses
//                 </li>
//               </Link>
//             </ul>
//           )}
//           <Link to="/hr/employees/employeesList/">
//             <li
//               className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}
//             >
//               <span
//                 className="text-2xl block float-left"
//                 onClick={() => setOpen(true)}
//               >
//                 <GiHumanPyramid />{" "}
//               </span>
//               <span
//                 className={`text-base font-light flex-1 ${
//                   !open && "hidden"
//                 } duration-200`}
//                 onClick={() => setOpen(!open)}
//               >
//                 {" "}
//                 HR
//               </span>
//               {open && (
//                 <BsChevronDown
//                   className={`${hrOpen && "rotate-180"}`}
//                   onClick={() => setHrOpen(!hrOpen)}
//                 />
//               )}
//             </li>
//           </Link>
//           {open && hrOpen && (
//             <ul>
//               <Link
//                 to="/hr/employees/employeesList/"
//                 className={
//                   location.pathname === "/hr/employees/employeesList/"
//                     ? "text-teal-200"
//                     : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <VscPerson />{" "}
//                   </span>
//                   Employees
//                 </li>
//               </Link>
//               {/* <Link
//                 to="/hr/payroll/"
//                 className={
//                   location.pathname === "/hr/payroll/" ? "text-teal-200" : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <TbCreditCardPay />{" "}
//                   </span>
//                   Payroll
//                 </li>
//               </Link> */}
//               {/* <Link
//                 to="/hr/leave/"
//                 className={
//                   location.pathname === "/hr/leave/" ? "text-teal-200" : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <MdOutlinePermContactCalendar />{" "}
//                   </span>
//                   Leave
//                 </li>
//               </Link> */}
//             </ul>
//           )}
//           {/* <Link to="/desk/inquiries/">
//             <li
//               className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}
//             >
//               <span
//                 className="text-2xl block float-left"
//                 onClick={() => setOpen(true)}
//               >
//                 <FaMailBulk />{" "}
//               </span>
//               <span
//                 className={`text-base font-light flex-1 ${
//                   !open && "hidden"
//                 } duration-200`}
//                 onClick={() => setOpen(!open)}
//               >
//                 {" "}
//                 Desk
//               </span>
//               {open && (
//                 <BsChevronDown
//                   className={`${deskOpen && "rotate-180"}`}
//                   onClick={() => setDeskOpen(!deskOpen)}
//                 />
//               )}
//             </li>
//           </Link>
//           {open && deskOpen && (
//             <ul>
//               <Link
//                 to="/desk/inquiries/"
//                 className={
//                   location.pathname === "/desk/inquiries/"
//                     ? "text-teal-200"
//                     : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <BsQuestionSquare />{" "}
//                   </span>
//                   Inquiries
//                 </li>
//               </Link>
//               <Link
//                 to="/desk/tasks/"
//                 className={
//                   location.pathname === "/desk/tasks/" ? "text-teal-200" : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <GrTask />{" "}
//                   </span>
//                   Tasks
//                 </li>
//               </Link>
//               <Link
//                 to="/desk/Chat/"
//                 className={
//                   location.pathname === "/desk/Chat/" ? "text-teal-200" : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <HiOutlineChatAlt />{" "}
//                   </span>
//                   Chat
//                 </li>
//               </Link>
//               <Link
//                 to="/desk/mails/"
//                 className={
//                   location.pathname === "/desk/mails/" ? "text-teal-200" : ""
//                 }
//               >
//                 <li
//                   className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                   onClick={() => setOpen(!open)}
//                 >
//                   <span className="text-1xl block float-left">
//                     {" "}
//                     <LuMail />{" "}
//                   </span>
//                   Mails
//                 </li>
//               </Link>
//             </ul>
//           )} */}
//           {/* <Link to="/cms/">
//             <li
//               className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}
//               onClick={() => setOpen(!open)}
//             >
//               <span className="text-2xl block float-left">
//                 <SiWebmoney />{" "}
//               </span>
//               <span
//                 className={`text-base font-light flex-1 ${
//                   !open && "hidden"
//                 } duration-200`}
//               >
//                 {" "}
//                 CMS
//               </span>
//             </li>
//           </Link> */}
//           <Link to="/">
//             <li
//               className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}
//               onClick={() => setOpen(!open)}
//             >
//               <span className="text-2xl block float-left">
//                 <BiHome />{" "}
//               </span>
//               <span
//                 className={`text-base font-light flex-1 ${
//                   !open && "hidden"
//                 } duration-200`}
//               >
//                 {" "}
//                 Public
//               </span>
//             </li>
//           </Link>

//           <div className="border-t border-neutral-600">
//             <Link to="/admin/usersManagement/users/">
//               <li
//                 className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}
//               >
//                 <span
//                   className="text-2xl block float-left"
//                   onClick={() => setOpen(true)}
//                 >
//                   <GrUserAdmin />{" "}
//                 </span>
//                 <span
//                   className={`text-base font-light flex-1 ${
//                     !open && "hidden"
//                   } duration-200`}
//                   onClick={() => setOpen(!open)}
//                 >
//                   {" "}
//                   Admin
//                 </span>
//                 {open && (
//                   <BsChevronDown
//                     className={`${adminOpen && "rotate-180"}`}
//                     onClick={() => setAdminOpen(!adminOpen)}
//                   />
//                 )}
//               </li>
//             </Link>
//             {open && adminOpen && (
//               <ul>
//                 <Link
//                   to="/admin/usersManagement/users/"
//                   className={
//                     location.pathname === "/admin/usersManagement/users/"
//                       ? "text-teal-200"
//                       : ""
//                   }
//                 >
//                   <li
//                     className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                     onClick={() => setOpen(!open)}
//                   >
//                     <span className="text-1xl block float-left">
//                       {" "}
//                       <BsQuestionSquare />{" "}
//                     </span>
//                     Users Management
//                   </li>
//                 </Link>
//                 {/* <Link
//                   to="/settings/deskSet/blabla"
//                   className={
//                     location.pathname === "/settings/deskSet/blabla"
//                       ? "text-teal-200"
//                       : ""
//                   }
//                 >
//                   <li
//                     className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                     onClick={() => setOpen(!open)}
//                   >
//                     <span className="text-1xl block float-left">
//                       {" "}
//                       <FaMailBulk />{" "}
//                     </span>
//                     Blabla
//                   </li>
//                 </Link> */}
//               </ul>
//             )}
//             <Link to="/settings/studentsSet/">
//               <li
//                 className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}
//               >
//                 <span
//                   className="text-2xl block float-left"
//                   onClick={() => setOpen(true)}
//                 >
//                   <SlSettings />{" "}
//                 </span>
//                 <span
//                   className={`text-base font-light flex-1 ${
//                     !open && "hidden"
//                   } duration-200`}
//                   onClick={() => setOpen(!open)}
//                 >
//                   {" "}
//                   Settings
//                 </span>
//                 {open && (
//                   <BsChevronDown
//                     className={`${settingsOpen && "rotate-180"}`}
//                     onClick={() => setSettingsOpen(!settingsOpen)}
//                   />
//                 )}
//               </li>
//             </Link>
//             {open && settingsOpen && (
//               <ul>
//                 <Link
//                   to="/settings/dashboardSet/"
//                   className={
//                     location.pathname === "/settings/dashboardSet/"
//                       ? "text-teal-200"
//                       : ""
//                   }
//                 >
//                   <li
//                     className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                     onClick={() => setOpen(!open)}
//                   >
//                     <span className="text-1xl block float-left">
//                       {" "}
//                       <VscDashboard />{" "}
//                     </span>
//                     Dashboard
//                   </li>
//                 </Link>
//                 <Link
//                   to="/settings/studentsSet/"
//                   className={
//                     location.pathname === "/settings/studentsSet/"
//                       ? "text-teal-200"
//                       : ""
//                   }
//                 >
//                   <li
//                     className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                     onClick={() => setOpen(!open)}
//                   >
//                     <span className="text-1xl block float-left">
//                       {" "}
//                       <PiStudent />{" "}
//                     </span>
//                     Students
//                   </li>
//                 </Link>
//                 <Link
//                   to="/settings/academicsSet/"
//                   className={
//                     location.pathname === "/settings/academicsSet/"
//                       ? "text-teal-200"
//                       : ""
//                   }
//                 >
//                   <li
//                     className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                     onClick={() => setOpen(!open)}
//                   >
//                     <span className="text-1xl block float-left">
//                       {" "}
//                       <IoSchoolOutline />{" "}
//                     </span>
//                     Academics
//                   </li>
//                 </Link>
//                 <Link
//                   to="/settings/financesSet/"
//                   className={
//                     location.pathname === "/settings/financesSet/"
//                       ? "text-teal-200"
//                       : ""
//                   }
//                 >
//                   <li
//                     className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                     onClick={() => setOpen(!open)}
//                   >
//                     <span className="text-1xl block float-left">
//                       {" "}
//                       <LiaFileInvoiceDollarSolid />{" "}
//                     </span>
//                     Finances
//                   </li>
//                 </Link>
//                 <Link
//                   to="/settings/HRSet/"
//                   className={
//                     location.pathname === "/settings/HRSet/"
//                       ? "text-teal-200"
//                       : ""
//                   }
//                 >
//                   <li
//                     className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                     onClick={() => setOpen(!open)}
//                   >
//                     <span className="text-1xl block float-left">
//                       {" "}
//                       <GiHumanPyramid />{" "}
//                     </span>
//                     HR
//                   </li>
//                 </Link>
//                 {/* <Link
//                   to="/settings/deskSet/"
//                   className={
//                     location.pathname === "/settings/deskSet/"
//                       ? "text-teal-200"
//                       : ""
//                   }
//                 >
//                   <li
//                     className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                     onClick={() => setOpen(!open)}
//                   >
//                     <span className="text-1xl block float-left">
//                       {" "}
//                       <FaMailBulk />{" "}
//                     </span>
//                     Desk
//                   </li>
//                 </Link> */}
//                 {/* <Link
//                   to="/settings/cmsSet/"
//                   className={
//                     location.pathname === "/settings/cmsSet/"
//                       ? "text-teal-200"
//                       : ""
//                   }
//                 >
//                   <li
//                     className="  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md "
//                     onClick={() => setOpen(!open)}
//                   >
//                     <span className="text-1xl block float-left">
//                       {" "}
//                       <SiWebmoney />{" "}
//                     </span>
//                     CMS
//                   </li>
//                 </Link> */}
//               </ul>
//             )}
//           </div>
//         </ul>
//       </div>
//     </div>
//   );
//   return content;
// };
// export default DashboardSidebar;
