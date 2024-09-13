import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from './Components/PublicLayout'
import DashboardLayout from './Components/DashboardLayout'
import Public from './pages/Public'
import Login from './features/auth/Login'
import Dashboard from './features/Dashboard/Dashboard'


import StudentsParents from './features/Students/StudentsParents'
import StudentsList from './features/Students/StudentsAndParents/Students/StudentsList'
import FamiliesList from './features/Students/StudentsAndParents/Families/FamiliesList'
import EditStudent from './features/Students/StudentsAndParents/Students/EditStudent'
import EditFamily from './features/Students/StudentsAndParents/Families/EditFamily'

import NewStudentForm from './features/Students/StudentsAndParents/Students/NewStudentForm'
import StudentDetails from './features/Students/StudentsAndParents/Students/StudentDetails'

import StudentDocuments from './features/Students/StudentsAndParents/Students/StudentDocuments'
import EditStudentForm from './features/Students/StudentsAndParents/Students/EditStudentForm'
import StudentDocumentsListsList from './features/AppSettings/StudentsSet/StudentDocumentsLists/StudentDocumentsListsList'
import StudentDocumentsList from './features/Students/StudentsAndParents/Students/StudentDocumentsList'
import StudentDocumentsForm from './features/Students/StudentsAndParents/Students/StudentDocumentsList'
import NewStudentDocumentsListForm from './features/AppSettings/StudentsSet/StudentDocumentsLists/NewStudentDocumentsListForm'
import EditStudentDocumentsList from './features/AppSettings/StudentsSet/StudentDocumentsLists/EditStudentDocumentsList'

import NewFamily from './features/Students/StudentsAndParents/Families/NewFamily'
import FamilyDetails from './features/Students/StudentsAndParents/Families/FamilyDetails'

import Admissions from "./features/Students/Admissions"
import AllAdmissions from "./features/Students/Admissions/AllAdmissions"
import EditAdmission from "./features/Students/Admissions/EditAdmission"
import NewAdmissionForm from './features/Students/Admissions/NewAdmissionForm'

import Enrolments from "./features/Students/Enrolments"
import NurseryPlannings from './features/Academics/NurseryPlannings'
import SchoolPlannings from './features/Academics/SchoolPlannings'
import CollectionDrop from './features/Academics/CollectionDrop'
import Invoices from './features/Finances/Invoices'
import Payments from './features/Finances/Payments'
import Expenses from './features/Finances/Expenses'
import EmployeesList from './features/HR/Employees/EmployeesList'
import EmployeeDetails from './features/HR/Employees/EmployeeDetails'
import Payroll from './features/HR/Payroll'
import Leave from './features/HR/Leave'
import Chat from './features/Desk/Chat'

import Inquiries from './features/Desk/Inquiries'
import Mails from './features/Desk/Mails'

import Cms from './features/CMS/Cms'
import DashboardSet from './features/AppSettings/DashboardSet'
import AcademicsSet from './features/AppSettings/AcademicsSet'
//import AcademicYearsSelection from './Components/Shared/Header/AcademicYearsSelection'
import CmsSet from './features/AppSettings/CmsSet'
import FinancesSet from './features/AppSettings/FinancesSet'
import StudentsSet from './features/AppSettings/StudentsSet'
import HRSet from './features/AppSettings/HRSet'
import DeskSet from './features/AppSettings/DeskSet'

import UsersManagement from './features/Admin/UsersManagement'
import UsersList from './features/Admin/UsersManagement/UsersList'
import EditUser from './features/Admin/UsersManagement/EditUser'
import NewUserForm from './features/Admin/UsersManagement/NewUserForm'
import UserDetails from './features/Admin/UsersManagement/UserDetails'


import Tasks from './features/Desk/Tasks'
import TasksList from './features/Desk/Tasks/TasksList'
import MyTasksList from './features/Desk/Tasks/MyTasksList'
import EditTask from './features/Desk/Tasks/EditTask'
import NewTask from './features/Desk/Tasks/NewTask'
import TaskDetails from './features/Desk/Tasks/TaskDetails'

import Prefetch from './features/auth/Prefetch'// this will keep a subscription to the states and prevend the expiry of cached data, we will wrap it around the protected pages 
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from'./features/auth/RequireAuth'
import {ROLES} from  './config/UserRoles'
// import ReactDOM from 'react-dom/client'

import NoPage from './pages/NoPage'
import AcademicYearsList from './features/AppSettings/AcademicsSet/AcademicYears/AcademicYearsList'
import AcademicYearDetails from './features/AppSettings/AcademicsSet/AcademicYears/AcademicYearDetails'
import AttendedSchoolList from './features/AppSettings/AcademicsSet/attendedSchools/AttendedSchoolsList'
import AttendedSchoolsList from './features/AppSettings/AcademicsSet/attendedSchools/AttendedSchoolsList'
import NewAttendedSchoolForm from './features/AppSettings/AcademicsSet/attendedSchools/NewAttendedSchoolForm'
import NewAcademicYearForm from './features/AppSettings/AcademicsSet/AcademicYears/NewAcademicYearForm'

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
        	<Route path="/" element={<PublicLayout/>}>       {/*the parent of all the other routes*/}
				<Route index element={<Public />} />   {/*  index will show as a default in the public layout*/}
				<Route path="login" element={<Login />} />


				{/*protected routes after this */}


					<Route element={<PersistLogin/>}>{/*this wrapper will persist login  for all inside routes */}
					<Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]}/>}>{/*this wrapper will RequireAuth and protect all routes below, any role allowed to the protected routes */}
						<Route element={<Prefetch/>}>{/*this wrapper will prefetch for all inside routes */}

							<Route path="dashboard" element={<DashboardLayout />} >	 {/*this will wrap around components that are protected by this route*/}				
								<Route index element={<Dashboard />} />   {/*  index will show as a default in the dashboard layout*/}
							</Route> {/* end of dashboard route */}

							<Route path="students" element={<DashboardLayout />} >	 												
								<Route path="studentsParents" > 					
								<Route index element={<StudentsParents />} /> 
									<Route path="students/" element={<StudentsList />}/>												
									<Route path="newStudent/" element={<NewStudentForm />}/>												
									<Route path="newFamily/" element={<NewFamily />}/>												
									<Route path="studentDocumentsList/:id/" element={<StudentDocuments />}/>												
									<Route path="studentDocuments/upload/:id/" element={<StudentDocumentsForm />}/>	
									<Route path="studentDetails/:id/" element={<StudentDetails/>}/>
									<Route path="edit/:id/" element={<EditStudent/>}/>
									<Route path="editFamily/:id/" element={<EditFamily/>}/>
									
																					
										{/* <Route path=":id/" element={<EditStudentForm/>}/> */}
										
									


									<Route path="families/" element={<FamiliesList />}/>
									<Route path="familyDetails/:id/" element={<FamilyDetails/>}/>
										{/* <Route path=":id/" element={<ParentDetails />}/> */}
										
									

																											
																													
								</Route> {/* end of studentsParents route */}

								<Route path="admissions" > 					
								<Route index element={<Admissions />} /> 
									<Route path="allAdmissions/" element={<AllAdmissions/>}>												
									<Route path="newAdmission" element={<NewAdmissionForm/>}/>
									<Route path=":admission" element={<EditAdmission/>}/>
									</Route> {/* end of admissions route */}

								</Route> {/* end of Admissions route */}

								<Route path="enrolments" > 					
								<Route index element={<Enrolments />} /> 
								</Route> {/* end of Enrolments route */}
							</Route> {/* end of Students route */}


							<Route path="academics" element={<DashboardLayout />} >	 				
								<Route index element={<SchoolPlannings />} />   

								<Route path="schoolPlannings" > 					
								<Route index element={<SchoolPlannings />} /> 
								</Route> {/* end of schoolPlannings route */}

								<Route path="nurseryPlannings" > 					
								<Route index element={<NurseryPlannings />} /> 
								</Route> {/* end of nurseryPlannings route */}

								<Route path="collectionDrop" > 					
								<Route index element={<CollectionDrop />} /> 
								</Route> {/* end of collectionDrop route */}
							</Route> {/* end of academics route */}

							<Route path="finances" element={<DashboardLayout />} >	 				
								<Route index element={<SchoolPlannings />} />   

								<Route path="invoices" > 					
								<Route index element={<Invoices />} /> 
								</Route> {/* end of invoices route */}

								<Route path="payments" > 					
								<Route index element={<Payments />} /> 
								</Route> {/* end of payments route */}

								<Route path="expenses" > 					
								<Route index element={<Expenses />} /> 
								</Route> {/* end of expenses route */}
							</Route> {/* end of finances route */}

							<Route path="HR" element={<DashboardLayout />} >	 				
								<Route index element={<EmployeesList />} />   

								<Route path="employees/" element={<EmployeesList />} > 					
								
								<Route path=":employeeId" element={<EmployeeDetails />}/>

								</Route> {/* end of employees route */}

								<Route path="payroll" > 					
								<Route index element={<Payroll />} /> 
								</Route> {/* end of payroll route */}

								<Route path="leave" > 					
								<Route index element={<Leave />} /> 
								</Route> {/* end of leave route */}
							</Route> {/* end of HR route */}


							<Route path="desk" element={<DashboardLayout />} >	 											
								<Route path="inquiries" > 	{/* start of inquiries route */}				
								<Route index element={<Inquiries />} /> 

								</Route> {/* end of inquiries route */}

								<Route path="tasks/" > 	{/* start of tasks route */}				
								<Route index element={<Tasks />} /> {/*the path link is in sidebarmenu*/ }							
									<Route path="tasks/" element={<TasksList />}/> 						
									<Route path="myTasks/" element={<MyTasksList />}/> {/*id of the user is part of the path*/}						
									<Route path="taskDetails/:id/" element={<TaskDetails />}/> 						
									<Route path="newTask/" element={<NewTask />}/> 		{/*is part of the path*/}			
									<Route path=":id/" element={<EditTask />}/> 		{/*id of the task is part of the path*/}		
								</Route> {/* end of tasks route */}

								<Route path="chat" > 					
								<Route index element={<Chat />} /> 
								</Route> {/* end of chat route */}

								<Route path="mails" > 					
								<Route index element={<Mails />} /> 
								</Route> {/* end of mails route */}
							</Route> {/* end of Desk route */}

							<Route path="cms" element={<DashboardLayout />} >	 				
							<Route index element={<Cms />} />   
							</Route> {/* end of CMS route */}
							
							<Route path="settings" element={<DashboardLayout />} >	 				
								<Route index element={<DashboardSet />} />   

								<Route path="dashboardSet" > 					
								<Route index element={<DashboardSet />} /> 
								</Route> {/* end of dashboardSet route */}

								<Route path="studentsSet" > 					
								<Route index element={<StudentsSet />} />
									<Route path="studentDocumentsListsList/" element={<StudentDocumentsListsList />} /> 									
									<Route path="newStudentDocumentsList" element={<NewStudentDocumentsListForm />}/>
									<Route path="studentDocumentsList/edit/:id" element={<EditStudentDocumentsList />}/>


								</Route> {/* end of studentsSet route */}

								<Route path="academicsSet">
								<Route index  element={<AcademicsSet />} /> 	{/*the path link is in sidebarmenu*/ }				
									
									<Route path="academicYears/" element={<AcademicYearsList />} /> 									
									<Route path="newAcademicYear" element={<NewAcademicYearForm />}/>
								
									<Route path="attendedSchools/" element={<AttendedSchoolsList />} /> 									
									<Route path="newSchool/" element={<NewAttendedSchoolForm />}/>
									


								</Route> {/* end of academicsSet route */}



								<Route path="financesSet" > 					
								<Route index element={<FinancesSet />} /> 
								</Route> {/* end of financesSet route */}

								<Route path="HRSet" > 					
								<Route index element={<HRSet />} /> 
								</Route> {/* end of HRSet route */}

								<Route path="deskSet" > 					
								<Route index element={<DeskSet />} /> 
								</Route> {/* end of financedeskSetsdeskSetSet route */}

								<Route path="cmsSet" > 					
								<Route index element={<CmsSet />} /> 
								</Route> {/* end of cmsSet route */}
							</Route> {/* end of settings route */}
							
							<Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]}/>}>{/*this wrapper will RequireAuth and protect all admin routes  below,  */}			
							<Route path="admin" element={<DashboardLayout />} >	 

								<Route path="usersManagement/"	>		
								<Route  index element={<UsersManagement />} />  {/*the path link is in sidebarmenu*/ }
									<Route path="users/" element={<UsersList />}/> 						
									<Route path="newUser/" element={<NewUserForm />}/> 		{/*is part of the path*/}			
									<Route path="userDetails/:id/" element={<UserDetails />}/> 		{/*is part of the path*/}			
									<Route path=":id/" element={<EditUser />}/> 		{/*id is part of the path*/}																
								</Route>{/*end of usersManagement route*/}
								
								<Route path="blabla" > 					
									<Route index element={<UsersList />} /> 
								</Route> {/* end of blabla route */}  
								
							</Route> {/* end of admin route */}
							</Route> {/* end of RequireAuth to protect admin routes */}



								
							</Route>{/*end of the prefetch protected routes */}
						</Route>{/*end of the persist login protected routes */}
			
			</Route> {/*end of protected routes*/}


			</Route>   {/* end of Public route */} 
			<Route path="*" element={<NoPage />} />				 
      </Routes>
    
  )
}

export default App