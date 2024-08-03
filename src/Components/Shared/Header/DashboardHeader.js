
import NavbarHeader from "./NavbarHeader"
import AcademicYearsSelection from "./AcademicYearsSelection"
import useAuth from "../../../hooks/useAuth"
// import { useNavigate, useLocation } from "react-router";

const DashboardHeader = () => {
  const {username, userRoles}=useAuth()
  
  const content =(
    
    <header >
        <div className="bg-white h-14 px-10 flex justify-between items-center ">
        <AcademicYearsSelection/>
        
        <p className="">
         welcome back Mr {username}<br/>
         current Status {userRoles}

        </p >
        <NavbarHeader />
        </div>
       

      </header>
      

)
return content
}

export default DashboardHeader