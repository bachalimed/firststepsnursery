import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from './Components/PublicLayout'
import DashboardLayout from './Components/DashboardLayout'
import Public from './pages/Public'
import Login from './features/auth/Login'
import Dashboard from './features/Dashboard/Dashboard'


import StudentsParents from './features/Students/StudentsParents'
import ParentsList from './features/Students/ParentsList'
import StudentsList from './features/Students/StudentsList'
import StudentDetails from './features/Students/StudentDetails'
import ParentDetails from './features/Students/ParentDetails'
import NewStudentForm from './features/Students/NewStudentForm'
import Admissions from "./features/Students/Admissions"
import Enrolments from "./features/Students/Enrolments"
import NurseryPlannings from './features/Academics/NurseryPlannings'
import SchoolPlannings from './features/Academics/SchoolPlannings'
import CollectionDrop from './features/Academics/CollectionDrop'
import Invoices from './features/Finances/Invoices'
import Payments from './features/Finances/Payments'
import Expenses from './features/Finances/Expenses'
import EmployeesList from './features/HR/EmployeesList'
import EmployeeDetails from './features/HR/EmployeeDetails'
import Payroll from './features/HR/Payroll'
import Leave from './features/HR/Leave'
import Chat from './features/Desk/Chat'

import Inquiries from './features/Desk/Inquiries'
import Mails from './features/Desk/Mails'
import TasksList from './features/Desk/TasksList'
import Cms from './features/CMS/Cms'
import DashboardSet from './features/AppSettings/DashboardSet'
import AcademicsSet from './features/AppSettings/AcademicsSet'
import AcademicYear from './Components/Shared/Header/AcademicYear'
import CmsSet from './features/AppSettings/CmsSet'
import FinancesSet from './features/AppSettings/FinancesSet'
import StudentsSet from './features/AppSettings/StudentsSet'
import HRSet from './features/AppSettings/HRSet'
import DeskSet from './features/AppSettings/DeskSet'
import UsersList from './features/Admin/UsersList'
import EditUser from './features/Admin/EditUser'
import NewUserForm from './features/Admin/NewUserForm'
import UsersManagement from './features/Admin/UsersManagement'
import EditTask from './features/Desk/EditTask'
import NewTask from './features/Desk/NewTask'
import Logout from './features/auth/Logout'


// import ReactDOM from 'react-dom/client'

import NoPage from './pages/NoPage'
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

				<Route path="dashboard" element={<DashboardLayout />} >	 {/*this will wrap around components that are protected by this route*/}				
					<Route index element={<Dashboard />} />   {/*  index will show as a default in the dashboard layout*/}
				</Route> {/* end of dashboard route */}

				<Route path="students" element={<DashboardLayout />} >	 				
					  

					<Route path="studentsParents" > 					
					<Route index element={<StudentsParents />} /> {/*the path link is in sidebarmenu*/ }

						<Route path="students/" element={<StudentsList />}>												
							<Route path=":studentId" element={<StudentDetails />}/>
							<Route path="newStudent" element={<NewStudentForm />}/>
						</Route> {/* end of Students route */}

						<Route path="parents/" element={<ParentsList />}>
							<Route path=":parentId" element={<ParentDetails />}/>

						</Route> {/* end of Parents route */}

						<Route path="newStudent/" element={<NewStudentForm />}>
						
						
						</Route> {/* end of newStudent route */}
					
					
					
					</Route> {/* end of studentsParents route */}

					<Route path="admissions" > 					
					<Route index element={<Admissions />} /> 
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
					<Route index element={<Inquiries />} />   

					<Route path="inquiries" > 					
					<Route index element={<Inquiries />} /> 
					</Route> {/* end of inquiries route */}

					<Route path="tasks" > 					
					<Route index element={<TasksList />} /> 
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
					</Route> {/* end of studentsSet route */}

					<Route path="academicsSet" element={<AcademicsSet />} > 					
					<Route path="academicYears" element={<AcademicYear />} /> 
					


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
				
							
				<Route path="admin" element={<DashboardLayout />} >	 

					<Route path="usersManagement"	>		
						<Route  index element={<UsersManagement />} />  {/*the path link is in sidebarmenu*/ }


						<Route path="users/" element={<UsersList />}/> 						
							<Route path=":userId" element={<EditUser />}/> 		{/*id is part of the path*/}			
							<Route path="newUser" element={<NewUserForm />}/> 		{/*id is part of the path*/}			
					 
					
					</Route>{/*end of usersManagement route*/}
					
					<Route path="blabla" > 					
						<Route index element={<UsersList />} /> 
					</Route> {/* end of blabla route */}  
					
				</Route> {/* end of admin route */}



				<Route path="logout" element={<DashboardLayout />} >	 				
				<Route index element={<Logout />} />   
				</Route> {/* end of logout route */}	
			
			</Route>   {/* end of Public route */} 
			<Route path="*" element={<NoPage />} />				 
      </Routes>
    
  )
}

export default App