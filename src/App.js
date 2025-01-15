import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./Components/PublicLayout";
import DashboardLayout from "./Components/DashboardLayout";
import Public from "./pages/Public";
import Login from "./features/auth/Login";
import ForgotPassword from "./features/auth/ForgotPassword";
import Dashboard from "./features/Dashboard/Dashboard";
import StudentsDash from "./features/Dashboard/Students/StudentsDash";
import FinancesDash from "./features/Dashboard/FinancesDash/FinancesDash";
// import HRDash from "./features/Dashboard/HRDashboard/HRDash";
import CookiePolicy from "./Components/CookiePolicy";
import ResetPassword from "./features/auth/MyProfile/ResetPassword";
import MyProfile from "./features/auth/MyProfile";
import EditMyProfile from "./features/auth/MyProfile/EditMyProfile";
import MyDetails from "./features/auth/MyProfile/MyDetails";

import EnrolmentsReport from "./features/Reporting/StudentsReports/EnrolmentsReport"
import AgeGroupsReport from "./features/Reporting/StudentsReports/AgeGroupsReport"
import StudentsReports from "./features/Reporting/StudentsReports"; 
import AcademicsReports from "./features/Reporting/AcademicsReports"; 
import HRReports from "./features/Reporting/HRReports"; 
import FinancesReports from "./features/Reporting/FinancesReports";
import UnpaidInvoices from "./features/Reporting/FinancesReports/UnpaidInvoices"

import Students from "./features/Students/Students"; //main tab
import StudentsList from "./features/Students/StudentsAndParents/Students/StudentsList";
import FamiliesList from "./features/Students/StudentsAndParents/Families/FamiliesList";
import EditStudent from "./features/Students/StudentsAndParents/Students/EditStudent";
import EditFamily from "./features/Students/StudentsAndParents/Families/EditFamily";

import NewStudentForm from "./features/Students/StudentsAndParents/Students/NewStudentForm";
import StudentDetails from "./features/Students/StudentsAndParents/Students/StudentDetails";

import StudentDocuments from "./features/Students/StudentsAndParents/Students/StudentDocuments/StudentDocuments";
import StudentDocumentsListsList from "./features/AppSettings/StudentsSet/StudentDocumentsLists/StudentDocumentsListsList";

import NewStudentDocumentsListForm from "./features/AppSettings/StudentsSet/StudentDocumentsLists/NewStudentDocumentsListForm";
import EditStudentDocumentsList from "./features/AppSettings/StudentsSet/StudentDocumentsLists/EditStudentDocumentsList";
import ServicesList from "./features/AppSettings/StudentsSet/NurseryServices/ServicesList";
import NewServiceForm from "./features/AppSettings/StudentsSet/NurseryServices/NewServiceForm";
import EditService from "./features/AppSettings/StudentsSet/NurseryServices/EditService";

import NewFamily from "./features/Students/StudentsAndParents/Families/NewFamily";
import FamilyDetails from "./features/Students/StudentsAndParents/Families/FamilyDetails";

import AdmissionsList from "./features/Students/Admissions/AdmissionsList";
import EditAdmission from "./features/Students/Admissions/EditAdmission";
import NewAdmissionForm from "./features/Students/Admissions/NewAdmissionForm";
import AdmissionDetails from "./features/Students/Admissions/AdmissionDetails";

import EnrolmentsList from "./features/Students/Enrolments/EnrolmentsList";
import UnEnrolmentsList from "./features/Students/Enrolments/UnEnrolmentsList";
import EditEnrolment from "./features/Students/Enrolments/EditEnrolment";
import NewEnrolmentForm from "./features/Students/Enrolments/NewEnrolmentForm";
import EnrolmentDetails from "./features/Students/Enrolments/EnrolmentDetails";

import Academics from "./features/Academics/Academics"; //main tab
import NewSectionForm from "./features/Academics/Sections/NewSectionForm";
import EditSection from "./features/Academics/Sections/EditSection";
import SectionDetails from "./features/Academics/Sections/SectionDetails";
import NurserySectionsList from "./features/Academics/Sections/NurserySectionsList";
import SchoolSectionsList from "./features/Academics/Sections/SchoolSectionsList";

//import Plannings from './features/Academics/Plannings'
import AnimatorsAssignmentsList from "./features/Academics/Plannings/AnimatorsAssignments/AnimatorsAssigmentsList";
import NewAnimatorsAssignmentForm from "./features/Academics/Plannings/AnimatorsAssignments/NewAnimatorsAssignmentForm";
import EditAnimatorsAssignment from "./features/Academics/Plannings/AnimatorsAssignments/EditAnimatorsAssignment";

import SectionsPlannings from "./features/Academics/Plannings/SectionsPlannings/SectionsPlannings";
import SitesPlannings from "./features/Academics/Plannings/SitesPlannings/SitesPlannings";
import AnimatorsPlannings from "./features/Academics/Plannings/AnimatorsPlannings/AnimatorsPlannings";
import ClassroomsPlannings from "./features/Academics/Plannings/ClassroomsPlannings/ClassroomsPlannings";

import Finances from "./features/Finances/Finances"; //main tab

import InvoicesList from "./features/Finances/Invoices/InvoicesList";
// import NewInvoiceForm from "./features/Finances/Invoices/NewInvoiceForm";
import EditInvoice from "./features/Finances/Invoices/EditInvoice";
import InvoiceDetails from "./features/Finances/Invoices/InvoiceDetails";

import PaymentsList from "./features/Finances/Payments/PaymentsList";
import NewPaymentForm from "./features/Finances/Payments/NewPaymentForm";
import EditPayment from "./features/Finances/Payments/EditPayment";
// import PaymentDetails from "./features/Finances/Payments/PaymentDetails";

import ExpensesList from "./features/Finances/Expenses/ExpensesList";
import NewExpenseForm from "./features/Finances/Expenses/NewExpenseForm";
import EditExpense from "./features/Finances/Expenses/EditExpense";
// import ExpenseDetails from "./features/Finances/Expenses/ExpenseDetails";

import HR from "./features/HR/HR"; //main tab
import EmployeesList from "./features/HR/Employees/EmployeesList";
import NewEmployeeForm from "./features/HR/Employees/NewEmployeeForm";
import EmployeeDetails from "./features/HR/Employees/EmployeeDetails";
import EmployeeDocuments from "./features/HR/Employees/EmployeeDocuments/EmployeeDocuments";
import EditEmployee from "./features/HR/Employees/EditEmployee";
import PayslipsList from "./features/HR/Payslips/PayslipsList";
import NewPayslipForm from "./features/HR/Payslips/NewPayslipForm";
import PayslipDetails from "./features/HR/Payslips/PayslipDetails";
//import PayslipDocuments from "./features/HR/Payslips/EmployeeDocuments/EmployeeDocuments";
import EditPayslip from "./features/HR/Payslips/EditPayslip";
import LeavesList from "./features/HR/Leaves/LeavesList";
import NewLeaveForm from "./features/HR/Leaves/NewLeaveForm";
import LeaveDetails from "./features/HR/Leaves/LeaveDetails";
//import PayslipDocuments from "./features/HR/Payslips/EmployeeDocuments/EmployeeDocuments";
import EditLeave from "./features/HR/Leaves/EditLeave";

import Chat from "./features/Desk/Chat";

import Inquiries from "./features/Desk/Inquiries";
import Mails from "./features/Desk/Mails";

import Cms from "./features/CMS/Cms";
import DashboardSet from "./features/AppSettings/DashboardSet";
import AcademicsSet from "./features/AppSettings/AcademicsSet";
//import AcademicYearsSelection from './Components/Shared/Header/AcademicYearsSelection'
import CmsSet from "./features/AppSettings/CmsSet";
import FinancesSet from "./features/AppSettings/FinancesSet";
import PayeesList from "./features/AppSettings/FinancesSet/Payees/PayeesList";
import NewPayeeForm from "./features/AppSettings/FinancesSet/Payees/NewPayeeForm";
import EditPayee from "./features/AppSettings/FinancesSet/Payees/EditPayee";
//import PayeeDetails from "./features/AppSettings/FinancesSet/Payees/PayeeDetails";
import ExpenseCategoriesList from "./features/AppSettings/FinancesSet/ExpenseCategories/ExpenseCategoriesList";
import NewExpenseCategoryForm from "./features/AppSettings/FinancesSet/ExpenseCategories/NewExpenseCategoryForm";
import EditExpenseCategory from "./features/AppSettings/FinancesSet/ExpenseCategories/EditExpenseCategory";
import ExpenseCategoryDetails from "./features/AppSettings/FinancesSet/ExpenseCategories/ExpenseCategoryDetails";

import StudentsSet from "./features/AppSettings/StudentsSet";

import HRSet from "./features/AppSettings/HRSet";
import EmployeeDocumentsListsList from "./features/AppSettings/HRSet/EmployeeDocumentsLists/EmployeeDocumentsListsList";
import NewEmployeeDocumentsListForm from "./features/AppSettings/HRSet/EmployeeDocumentsLists/NewEmployeeDocumentsListForm";
import EditEmployeeDocumentsList from "./features/AppSettings/HRSet/EmployeeDocumentsLists/EditEmployeeDocumentsList";
import DeskSet from "./features/AppSettings/DeskSet";

import Documentation from "./features/AppSettings/Documentation";
import GettingStarted from "./features/AppSettings/Documentation/GettingStarted";
import KeyTasks from "./features/AppSettings/Documentation/KeyTasks";
import Faqs from "./features/AppSettings/Documentation/Faqs";

import UsersManagement from "./features/Admin/UsersManagement";
import UsersList from "./features/Admin/UsersManagement/UsersList";
import EditUser from "./features/Admin/UsersManagement/EditUser";
import NewUserForm from "./features/Admin/UsersManagement/NewUserForm";
import UserDetails from "./features/Admin/UsersManagement/UserDetails";

import Tasks from "./features/Desk/Tasks";
import TasksList from "./features/Desk/Tasks/TasksList";
import MyTasksList from "./features/Desk/Tasks/MyTasksList";
import EditTask from "./features/Desk/Tasks/EditTask";
import NewTask from "./features/Desk/Tasks/NewTask";
import TaskDetails from "./features/Desk/Tasks/TaskDetails";

import Prefetch from "./features/auth/Prefetch"; // this will keep a subscription to the states and prevend the expiry of cached data, we will wrap it around the protected pages
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/UserRoles";
// import ReactDOM from 'react-dom/client'

import NoPage from "./pages/NoPage";
import AcademicYearsList from "./features/AppSettings/AcademicsSet/AcademicYears/AcademicYearsList";
import AcademicYearDetails from "./features/AppSettings/AcademicsSet/AcademicYears/AcademicYearDetails";
import AttendedSchoolList from "./features/AppSettings/AcademicsSet/attendedSchools/AttendedSchoolsList";
import AttendedSchoolsList from "./features/AppSettings/AcademicsSet/attendedSchools/AttendedSchoolsList";
import NewAttendedSchoolForm from "./features/AppSettings/AcademicsSet/attendedSchools/NewAttendedSchoolForm";
import EditAttendedSchool from "./features/AppSettings/AcademicsSet/attendedSchools/EditAttendedSchool";
import NewAcademicYearForm from "./features/AppSettings/AcademicsSet/AcademicYears/NewAcademicYearForm";
import EditAcademicYear from "./features/AppSettings/AcademicsSet/AcademicYears/EditAcademicYear";
import ClassroomsList from "./features/AppSettings/AcademicsSet/Classrooms/ClassroomsList";
import NewClassroomForm from "./features/AppSettings/AcademicsSet/Classrooms/NewClassroomForm";
import EditClassroom from "./features/AppSettings/AcademicsSet/Classrooms/EditClassroom";
import MyPlanning from "./features/Academics/Plannings/MyPlanning/MyPlanning";

// import Parents from './features/Students/Parents'
// import NewStudent from './features/Students/NewStudent'
// import ResetPassword from './features/auth/ResetPassword'
// import ForgotPassword from './features/auth/ForgotPassword'

//in case we need not to show the header in some pages, we create another route
//after </Route> start another <Route path="Login" element={<Login />} />

//define user types fro access rights
// const USER_TYPES ={
// 	PUBLIC_USER:"Public User",
// 	PARENT:"Parent",
// 	STAFF:"Staff",
// 	ANIMATOR:"Animator",
// 	FINANCE:"Finance",
// 	HUMAN_RESOURCE:"Human Resource",
// 	DIRECTOR:"Director",
// 	OWNER:"Owner",
// 	ADMIN:"Admin"
// 	}
// const CURRENT_USER_TYPE=USER_TYPES.PUBLIC_USER;

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        {" "}
        {/*the parent of all the other routes*/}
        <Route index element={<Public />} />{" "}
        {/*  index will show as a default in the public layout*/}
        <Route path="cookiePolicy" element={<CookiePolicy />} />
        <Route path="login" element={<Login />} />
        <Route path="forgotPassword" element={<ForgotPassword />} />
        {/*protected routes after this */}
        <Route element={<PersistLogin />}>
          {/*this wrapper will persist login  for all inside routes */}
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            {/*this wrapper will RequireAuth and protect all routes below, any role allowed to the protected routes */}
            <Route element={<Prefetch />}>
              {/*this wrapper will prefetch for all inside routes */}
              <Route path="dashboard" element={<DashboardLayout />}>
                {" "}
                {/*this will wrap around components that are protected by this route*/}
                <Route index element={<Dashboard />} />{" "}
                {/*  index will show as a default in the dashboard layout*/}
                <Route path="studentsDash/" element={<StudentsDash />} />
                <Route path="financesDash/" element={<FinancesDash />} />
              </Route>{" "}
              <Route path="myProfile" element={<DashboardLayout />}>
                {" "}
                {/*this will wrap around components that are protected by this route*/}
                <Route index element={<MyProfile />} />{" "}
                {/*  index will show as a default in the dashboard layout*/}
                <Route path="resetPassword/" element={<ResetPassword />} />
                <Route path="myDetails/:id/" element={<MyDetails />} />
                <Route path="editMyProfile/:id/" element={<EditMyProfile />} />
              </Route>{" "}
              {/* end of dashboard route */}
              <Route path="students" element={<DashboardLayout />}>
                <Route path="studentsParents">
                  <Route index element={<Students />} />

                  <Route path="students/" element={<StudentsList />} />
                  <Route path="newStudent/" element={<NewStudentForm />} />
                  <Route path="newFamily/" element={<NewFamily />} />
                  <Route
                    path="studentDocumentsList/:id/"
                    element={<StudentDocuments />}
                  />
                  <Route
                    path="studentDocuments/upload/:id/"
                    //element={<StudentDocumentsForm />}
                  />
                  <Route
                    path="studentDetails/:id/"
                    element={<StudentDetails />}
                  />
                  <Route path="editStudent/:id/" element={<EditStudent />} />
                  <Route path="editFamily/:id/" element={<EditFamily />} />
                  <Route path="families/" element={<FamiliesList />} />
                  <Route
                    path="familyDetails/:id/"
                    element={<FamilyDetails />}
                  />
                  {/* <Route path=":id/" element={<ParentDetails />}/> */}
                </Route>{" "}
                {/* end of studentsParents route */}
                <Route path="admissions">
                  <Route index element={<Students />} />

                  <Route path="admissions/" element={<AdmissionsList />} />
                  <Route path="newAdmission/" element={<NewAdmissionForm />} />
                  <Route path="editAdmission/:id" element={<EditAdmission />} />
                  <Route
                    path="admissionDetails/:id"
                    element={<AdmissionDetails />}
                  />
                </Route>{" "}
                {/* end of Admissions route */}
                <Route path="Enrolments">
                  <Route index element={<Students />} />

                  <Route path="enrolments/" element={<EnrolmentsList />} />
                  <Route path="unenrolments/" element={<UnEnrolmentsList />} />
                  <Route path="newEnrolment/" element={<NewEnrolmentForm />} />
                  <Route path="editEnrolment/:id" element={<EditEnrolment />} />
                  <Route
                    path="enrolmentDetails/:id"
                    element={<EnrolmentDetails />}
                  />
                </Route>{" "}
                {/* end of Enrolments route */}
              </Route>{" "}
              {/* end of Students route */}
              <Route path="academics" element={<DashboardLayout />}>
                <Route index element={<Academics />} />
                <Route path="sections">
                  <Route index element={<Academics />} />
                  <Route
                    path="nurserySectionsList/"
                    element={<NurserySectionsList />}
                  />
                  <Route
                    path="schoolSectionsList/"
                    element={<SchoolSectionsList />}
                  />
                  <Route path="newSection/" element={<NewSectionForm />} />
                  <Route path="editSection/:id" element={<EditSection />} />
                  <Route
                    path="sectionDetails/:id"
                    element={<SectionDetails />}
                  />
                </Route>{" "}
                {/* end of sections route */}
                <Route path="plannings">
                  <Route index element={<Academics />} />
                  <Route
                    path="animatorsAssignments/"
                    element={<AnimatorsAssignmentsList />}
                  />
                  <Route
                    path="NewAnimatorsAssignmentForm/"
                    element={<NewAnimatorsAssignmentForm />}
                  />
                  <Route
                    path="editAnimatorsAssignment/:id"
                    element={<EditAnimatorsAssignment />}
                  />

                  <Route
                    path="sectionsPlannings/"
                    element={<SectionsPlannings />}
                  />
                  <Route path="sitesPlannings/" element={<SitesPlannings />} />
                  <Route
                    path="animatorsPlannings/"
                    element={<AnimatorsPlannings />}
                  />
                  <Route
                    path="classroomsPlannings/"
                    element={<ClassroomsPlannings />}
                  />
                  <Route path="myPlanning/" element={<MyPlanning />} />
                </Route>{" "}
                {/* end of schoolPlannings route */}
                {/* <Route path="nurseryPlannings" > 					 */}
                {/* <Route index element={<NurseryPlannings />} />  */}
                {/* </Route>  */}
                {/* end of nurseryPlannings route */}
                {/* <Route path="collectionDrop" > 					 */}
                {/* <Route index element={<CollectionDrop />} />  */}
                {/* </Route>  */}
                {/* end of collectionDrop route */}
              </Route>{" "}
              {/* end of academics route */}
              <Route path="finances" element={<DashboardLayout />}>
                <Route index element={<Finances />} />
                <Route path="expenses">
                  <Route index element={<Finances />} />
                  <Route path="expensesList/" element={<ExpensesList />} />
                  <Route path="newExpense/" element={<NewExpenseForm />} />
                  <Route path="editExpense/:id" element={<EditExpense />} />
                </Route>{" "}
                {/* end of expenses route */}
                <Route path="invoices">
                  <Route index element={<Finances />} />
                  <Route path="invoicesList/" element={<InvoicesList />} />
                  {/* <Route path="newInvoice/" element={<NewInvoiceForm />} /> */}
                  <Route path="editInvoice/:id" element={<EditInvoice />} />
                  <Route
                    path="invoiceDetails/:id"
                    element={<InvoiceDetails />}
                  />
                </Route>{" "}
                {/* end of invoices route */}
                <Route path="payments">
                  <Route index element={<Finances />} />
                  <Route path="paymentsList/" element={<PaymentsList />} />
                  <Route path="newPayment/" element={<NewPaymentForm />} />
                  <Route path="editPayment/:id" element={<EditPayment />} />
                </Route>{" "}
                {/* end of payments route */}
              </Route>{" "}
              {/* end of finances route */}
              <Route path="hr" element={<DashboardLayout />}>
                <Route index element={<HR />} />
                <Route path="employees">
                  <Route path="employeesList" element={<EmployeesList />} />
                  <Route path="newEmployee" element={<NewEmployeeForm />} />
                  <Route path="editEmployee/:id/" element={<EditEmployee />} />
                  <Route
                    path="employeeDetails/:id/"
                    element={<EmployeeDetails />}
                  />
                  <Route
                    path="employeeDocumentsList/:id/"
                    element={<EmployeeDocuments />}
                  />
                </Route>{" "}
                {/* end of employees route */}
                <Route path="payslips">
                  <Route path="payslipsList" element={<PayslipsList />} />
                  <Route path="newPayslip" element={<NewPayslipForm />} />
                  <Route path="editPayslip/:id/" element={<EditPayslip />} />
                  <Route
                    path="payslipDetails/:id/"
                    element={<PayslipDetails />}
                  />
                </Route>{" "}
                {/* end of payslips route */}
                <Route path="leaves">
                  <Route path="leavesList" element={<LeavesList />} />
                  <Route path="newLeave" element={<NewLeaveForm />} />
                  <Route path="editLeave/:id/" element={<EditLeave />} />
                  <Route path="leaveDetails/:id/" element={<LeaveDetails />} />
                </Route>{" "}
                {/* end of leaves route */}
                <Route path="payroll">
                  <Route index element={<HR />} />
                </Route>{" "}
                {/* end of payroll route */}
                <Route path="leave">
                  <Route index element={<HR />} />
                </Route>{" "}
                {/* end of leave route */}
              </Route>{" "}
              {/* end of HR route */}
              <Route path="desk" element={<DashboardLayout />}>
                <Route path="inquiries">
                  {" "}
                  {/* start of inquiries route */}
                  <Route index element={<Inquiries />} />
                </Route>{" "}
                {/* end of inquiries route */}
                <Route path="tasks/">
                  {" "}
                  {/* start of tasks route */}
                  <Route index element={<Tasks />} />{" "}
                  {/*the path link is in sidebarmenu*/}
                  <Route path="tasks/" element={<TasksList />} />
                  <Route path="myTasks/" element={<MyTasksList />} />{" "}
                  {/*id of the user is part of the path*/}
                  <Route path="taskDetails/:id/" element={<TaskDetails />} />
                  <Route path="newTask/" element={<NewTask />} />{" "}
                  {/*is part of the path*/}
                  <Route path=":id/" element={<EditTask />} />{" "}
                  {/*id of the task is part of the path*/}
                </Route>{" "}
                {/* end of tasks route */}
                <Route path="chat">
                  <Route index element={<Chat />} />
                </Route>{" "}
                {/* end of chat route */}
                <Route path="mails">
                  <Route index element={<Mails />} />
                </Route>{" "}
                {/* end of mails route */}
              </Route>{" "}
              {/* end of Desk route */}
              <Route path="cms" element={<DashboardLayout />}>
                <Route index element={<Cms />} />
              </Route>{" "}
              {/* end of CMS route */}
              <Route path="settings" element={<DashboardLayout />}>
                <Route index element={<DashboardSet />} />
                <Route path="dashboardSet">
                  <Route index element={<DashboardSet />} />
                </Route>{" "}
                {/* end of dashboardSet route */}
                <Route path="studentsSet">
                  <Route index element={<StudentsSet />} />
                  <Route
                    path="studentDocumentsListsList/"
                    element={<StudentDocumentsListsList />}
                  />
                  <Route
                    path="newStudentDocumentsList/"
                    element={<NewStudentDocumentsListForm />}
                  />
                  <Route
                    path="studentDocumentsList/edit/:id/"
                    element={<EditStudentDocumentsList />}
                  />

                  <Route path="services/" element={<ServicesList />} />
                  <Route path="newService/" element={<NewServiceForm />} />
                  <Route path="editService/:id" element={<EditService />} />
                </Route>{" "}
                {/* end of studentsSet route */}
                <Route path="academicsSet">
                  <Route index element={<AcademicsSet />} />{" "}
                  {/*the path link is in sidebarmenu*/}
                  <Route
                    path="academicYears/"
                    element={<AcademicYearsList />}
                  />
                  <Route
                    path="newAcademicYear/"
                    element={<NewAcademicYearForm />}
                  />
                  <Route
                    path="editAcademicYear/:id/"
                    element={<EditAcademicYear />}
                  />
                  <Route
                    path="attendedSchools/"
                    element={<AttendedSchoolsList />}
                  />
                  <Route
                    path="newSchool/"
                    element={<NewAttendedSchoolForm />}
                  />
                  <Route
                    path="editAttendedSchool/:id/"
                    element={<EditAttendedSchool />}
                  />
                  <Route path="classrooms/" element={<ClassroomsList />} />
                  <Route path="newClassroom/" element={<NewClassroomForm />} />
                  <Route
                    path="editClassroom/:id/"
                    element={<EditClassroom />}
                  />
                </Route>{" "}
                {/* end of academicsSet route */}
                <Route path="financesSet">
                  <Route index element={<FinancesSet />} />
                  <Route path="payeesList/" element={<PayeesList />} />
                  <Route path="newPayee/" element={<NewPayeeForm />} />

                  <Route path="editPayee/:id/" element={<EditPayee />} />
                  {/* <Route
                    path="payeeDetails/:id/"
                    element={<PayeeDetails />}
                  /> */}
                  <Route
                    path="expenseCategoriesList/"
                    element={<ExpenseCategoriesList />}
                  />
                  <Route
                    path="newExpenseCategory/"
                    element={<NewExpenseCategoryForm />}
                  />

                  <Route
                    path="editExpenseCategory/:id/"
                    element={<EditExpenseCategory />}
                  />
                  <Route
                    path="expenseCategoryDetails/:id/"
                    element={<ExpenseCategoryDetails />}
                  />
                </Route>{" "}
                {/* end of financesSet route */}
                <Route path="HRSet">
                  <Route index element={<HRSet />} />
                  <Route
                    path="employeeDocumentsListsList/"
                    element={<EmployeeDocumentsListsList />}
                  />
                  <Route
                    path="newEmployeeDocumentsList"
                    element={<NewEmployeeDocumentsListForm />}
                  />
                  <Route
                    path="employeeDocumentsList/edit/:id"
                    element={<EditEmployeeDocumentsList />}
                  />
                </Route>{" "}
                <Route path="documentation">
                  <Route index element={<Documentation />} />
                  <Route
                    path="documentation/"
                    element={<StudentDocumentsListsList />}
                  />

                  <Route path="gettingStarted/" element={<GettingStarted />} />
                  <Route path="keyTasks/" element={<KeyTasks />} />
                  <Route path="faqs" element={<Faqs />} />
                </Route>{" "}
                {/* end of documentation route */}
                {/* end of HRSet route */}
                <Route path="deskSet">
                  <Route index element={<DeskSet />} />
                </Route>{" "}
                {/* end of financedeskSetsdeskSetSet route */}
                <Route path="cmsSet">
                  <Route index element={<CmsSet />} />
                </Route>{" "}
                {/* end of cmsSet route */}
              </Route>{" "}
              {/* end of settings route */}
              {/* start of reports route */}
              <Route path="reports" element={<DashboardLayout />}>
                <Route index element={<StudentsReports />} />
                <Route path="studentsReports">
                  <Route index element={<StudentsReports />} />
                  <Route path="ageGroupsReport/" element={<AgeGroupsReport />} />
                  <Route path="enrolmentsReport/" element={<EnrolmentsReport/>} />
                  
                 

                 
                </Route>{" "}
                {/* end of studentsReports route */}
                <Route path="academicsReports">
                  <Route index element={<AcademicsReports />} />{" "}
                  {/*the path link is in sidebarmenu*/}
                  <Route
                    path="newAcademicYear/"
                    element={<NewAcademicYearForm />}
                  />
                  <Route
                    path="editAcademicYear/:id/"
                    element={<EditAcademicYear />}
                  />
                  <Route
                    path="attendedSchools/"
                    element={<AttendedSchoolsList />}
                  />
                  <Route path="classrooms/" element={<ClassroomsList />} />
                  <Route path="newClassroom/" element={<NewClassroomForm />} />
                  <Route
                    path="editClassroom/:id/"
                    element={<EditClassroom />}
                  />
                </Route>{" "}
                {/* end of academicsReports route */}
                <Route path="financesReports">
                  <Route index element={<FinancesReports />} />
                  <Route path="unpaidInvoices/" element={<UnpaidInvoices />} />
                  <Route path="newPayee/" element={<NewPayeeForm />} />

                  <Route path="editPayee/:id/" element={<EditPayee />} />

                  <Route
                    path="editExpenseCategory/:id/"
                    element={<EditExpenseCategory />}
                  />
                  <Route
                    path="expenseCategoryDetails/:id/"
                    element={<ExpenseCategoryDetails />}
                  />
                </Route>{" "}
                {/* end of financesReports route */}
                <Route path="HRReports">
                  <Route index element={<HRReports />} />
                  <Route
                    path="employeeDocumentsListsList/"
                    element={<EmployeeDocumentsListsList />}
                  />
                  <Route
                    path="newEmployeeDocumentsList"
                    element={<NewEmployeeDocumentsListForm />}
                  />
                  <Route
                    path="employeeDocumentsList/edit/:id"
                    element={<EditEmployeeDocumentsList />}
                  />
                </Route>{" "}
                {/* end of HRRoutes route */}
              </Route>{" "}
              {/* end of reports route */}
              <Route
                element={
                  <RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]} />
                }
              >
                {/*this wrapper will RequireAuth and protect all admin routes  below,  */}
                <Route path="admin" element={<DashboardLayout />}>
                  <Route path="usersManagement/">
                    <Route index element={<UsersManagement />} />{" "}
                    {/*the path link is in sidebarmenu*/}
                    <Route path="users/" element={<UsersList />} />
                    <Route path="newUser/" element={<NewUserForm />} />{" "}
                    {/*is part of the path*/}
                    <Route
                      path="userDetails/:id/"
                      element={<UserDetails />}
                    />{" "}
                    {/*is part of the path*/}
                    <Route path=":id/" element={<EditUser />} />{" "}
                    {/*id is part of the path*/}
                  </Route>
                  {/*end of usersManagement route*/}
                  <Route path="blabla">
                    <Route index element={<UsersList />} />
                  </Route>{" "}
                  {/* end of blabla route */}
                </Route>{" "}
                {/* end of admin route */}
              </Route>{" "}
              {/* end of RequireAuth to protect admin routes */}
            </Route>
            {/*end of the prefetch protected routes */}
          </Route>
          {/*end of the persist login protected routes */}
        </Route>{" "}
        {/*end of protected routes*/}
      </Route>{" "}
      {/* end of Public route */}
      <Route path="*" element={<NoPage />} />
    </Routes>
  );
};

export default App;
