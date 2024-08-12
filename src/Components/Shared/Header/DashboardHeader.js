
import NavbarHeader from './NavbarHeader'
import useAuth from '../../../hooks/useAuth'
import AcademicYearsSelection from './AcademicYearsSelection'
// import { useNavigate, useLocation } from "react-router"
import useAcademicYears from '../../../hooks/useAcademicYears'

const DashboardHeader = () => {
  const {userId, username, userRoles, canEdit, canDelete, canAdd, canCreate}=useAuth()


  //const { allAcademicYears, currentAcademicYear } = useAcademicYears()


  
  const content =(
    
    <header >
        <div className="bg-white h-14 px-10 flex justify-between items-center ">
        <AcademicYearsSelection/>
        
        <p className="">
         welcome back Mr {username} id: {userId}<br/>
         current Status: {userRoles}<br/>
         current actions:  {canEdit?'canEdit':''} ,{canDelete?'canDelete':''},{canAdd?'canAdd':''},{canCreate?'canCreate':''}

        </p > current 
       
        
        <NavbarHeader />
        </div>
       

      </header>
      

)
return content
}

export default DashboardHeader