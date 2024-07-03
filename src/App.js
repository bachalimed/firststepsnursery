import React from 'react'
import { Routes, Route } from "react-router-dom"
import PublicLayout from "./Components/PublicLayout"
import DashboardLayout from "./Components/DashboardLayout"
import Public from "./pages/Public"
import Login from "./features/auth/Login"
import Dashboard from "./features/auth/Dashboard"

import ReactDOM from "react-dom/client"



import NoPage from "./pages/NoPage"
import Academics from "./features/Academics/Academics"
import StudentsParents from "./features/StudentsParents/StudentsParents"
import HumanResources from "./pages/HumanResources"
import Desk from "./pages/Desk"
import Cms from "./pages/Cms"
import Finances from "./pages/Finances"
import Settings from "./pages/Settings"
import ResetPassword from "./pages/ResetPassword"
import ForgotPassword from "./pages/ForgotPassword"
import Logout from "./pages/Logout"

//in case we need not to show the header in some pages, we create another route
//after </Route> start another <Route path="Login" element={<Login />} />


//define user types fro access rights
const USER_TYPES ={
	PUBLIC_USER:"Public User",
	PARENT:"Parent",
	STAFF:"Staff",
	ANIMATOR:"Animator",
	FINANCE:"Finance",
	HUMAN_RESOURCE:"Human Resource",
	DIRECTOR:"Director",
	OWNER:"Owner",
	ADMIN:"Admin"
	}
const CURRENT_USER_TYPE=USER_TYPES.PUBLIC_USER;



const App = () => {
  return (
    
      <Routes>
        	<Route path="/" element={<PublicLayout/>}>       {/*the parent of all the other routes*/}
				<Route index element={<Public />} />   {/*  index will show as a default in the public layout*/}
					<Route path="login" element={<Login />} />

					<Route path="dashboard" element={<DashboardLayout />} >	 {/*this will wrap around componenets that are protected by this route*/}				
					<Route index element={<Dashboard />} />   {/*  index will show as a default in the dashboard layout*/}
						<Route path="studentsParents" > 
						<Route path="students" element={<Students />} >   {/*  index will show as a default in the dashboard layout*/}
						<Route path="parents" element={<Parents />} >   
						<Route path="newStudent" element={<NewStudent />} />   
						</Route> 

					</Route> 


				
			</Route> 
				{/* <Route path="studentsParents" element={<StudentsParents />} />
				<Route path="desk" element={<Desk />} />
				<Route path="academics" element={<Academics />} />
				<Route path="hr" element={<HumanResources />} />
				<Route path="finances" element={<Finances />} />
				<Route path="cms" element={<Cms />} />
				<Route path="settings" element={<Settings />} />
				<Route path="User/ResetPassword" element={<ResetPassword />} />
				<Route path="User/ForgotPassword" element={<ForgotPassword />} />
				<Route path="User/Logout" element={<Logout />} />
				<Route path="*" element={<NoPage />} /> 
          </Route>  */}
		  
      </Routes>
    
  )
}

export default App