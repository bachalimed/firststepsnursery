import React from 'react'

//import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Academics from "./pages/Academics";
import Students from "./pages/Students";
import HumanResources from "./pages/HumanResources";
import Desk from "./pages/Desk";
import Cms from "./pages/Cms";
import Finances from "./pages/Finances";
import Settings from "./pages/Settings";
import Layout from "./Components/Shared/Layout";

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
    <BrowserRouter>
      <Routes>
        	<Route path="/" element={<Layout/>}>
          	<Route index element={<Home />} /> 
          	<Route path="dashboard" element={<Dashboard />} />
          	<Route path="students" element={<Students />} />
          	<Route path="desk" element={<Desk />} />
          	<Route path="academics" element={<Academics />} />
          	<Route path="hr" element={<HumanResources />} />
          	<Route path="finances" element={<Finances />} />
          	<Route path="cms" element={<Cms />} />
          	<Route path="settings" element={<Settings />} />
          	<Route path="*" element={<NoPage />} /> 
          </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App