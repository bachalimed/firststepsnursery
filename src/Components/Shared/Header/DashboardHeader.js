
import NavbarHeader from './NavbarHeader'
import useAuth from '../../../hooks/useAuth'
import AcademicYearsSelection from './AcademicYearsSelection'
// import { useNavigate, useLocation } from "react-router"
import useAcademicYears from '../../../hooks/useAcademicYears'

const DashboardHeader = () => {
  const {username, userRoles}=useAuth()


  //const { allAcademicYears, currentAcademicYear } = useAcademicYears()

 

  
  const content =(
    
    <header >
        <div className="bg-white h-14 px-10 flex justify-between items-center ">
        <AcademicYearsSelection/>
        
        <p className="">
         welcome back Mr {username}<br/>
         current Status {userRoles}

        </p > current 
       
        
        <NavbarHeader />
        </div>
       

      </header>
      

)
return content
}

export default DashboardHeader