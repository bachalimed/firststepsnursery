import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from './Components/PublicLayout'
import DashboardLayout from './Components/DashboardLayout'
import Public from './pages/Public'
import Login from './features/auth/Login'
import Dashboard from './features/Dashboard/Dashboard'


import StudentsParents from './features/Students/StudentsParents'
import Parents from './features/Students/Parents'
import Students from './features/Students/Students'
import Admissions from "./features/Students/Admissions"
import Enrolments from "./features/Students/Enrolments"
import NurseryPlannings from './features/Academics/NurseryPlannings'
import SchoolPlannings from './features/Academics/SchoolPlannings'
import CollectionDrop from './features/Academics/CollectionDrop'
import Invoices from './features/Finances/Invoices'
import Payments from './features/Finances/Payments'
import Expenses from './features/Finances/Expenses'
import Employees from './features/HR/Employees'
import Payroll from './features/HR/Payroll'
import Leave from './features/HR/Leave'
import Chat from './features/Desk/Chat'

import Inquiries from './features/Desk/Inquiries'
import Mails from './features/Desk/Mails'
import Tasks from './features/Desk/Tasks'
import Cms from './features/CMS/Cms'
import DashboardSet from './features/AppSettings/DashboardSet'
import AcademicsSet from './features/AppSettings/AcademicsSet'
import CmsSet from './features/AppSettings/CmsSet'
import FinancesSet from './features/AppSettings/FinancesSet'
import StudentsSet from './features/AppSettings/StudentsSet'
import HRSet from './features/AppSettings/HRSet'
import DeskSet from './features/AppSettings/DeskSet'
import User from './features/Admin/User'
import Logout from './features/auth/Logout'


// import ReactDOM from 'react-dom/client'

// import NoPage from './pages/NoPage'
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
					<Route index element={<StudentsParents />} />   

					<Route path="studentsParents" > 					
					<Route index element={<StudentsParents />} /> 
						<Route path="parents" >
						<Route index element={<Parents />} />
						</Route> {/* end of Parents route */}
					
						<Route path="students" >
						<Route index element={<Students />} />
						</Route> {/* end of Students route */}
					
					
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
					<Route index element={<Employees />} />   

					<Route path="employees" > 					
					<Route index element={<Employees />} /> 
					</Route> {/* end of staff route */}

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
					<Route index element={<Tasks />} /> 
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

					<Route path="academicsSet" > 					
					<Route index element={<AcademicsSet />} /> 
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
				<Route index element={<User />} /> 

					<Route path="users" > 					
					<Route index element={<User />} /> 
					</Route> {/* end of users route */} 

					<Route path="blabla" > 					
					<Route index element={<User />} /> 
					</Route> {/* end of blabla route */}  

				</Route> {/* end of admin route */}

				<Route path="logout" element={<DashboardLayout />} >	 				
				<Route index element={<Logout />} />   
				</Route> {/* end of logout route */}	
			
			</Route>   {/* end of Public route */} 
								 
      </Routes>
    
  )
}

export default App