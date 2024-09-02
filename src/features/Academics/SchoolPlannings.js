import { Link } from 'react-router-dom'
import { MdOutlineBusinessCenter } from "react-icons/md"
import AcademicYearsSelection from '../../Components/AcademicYearsSelection'
const SchoolPlannings = () => {
 

const schoolPlanningsTabs = {title:"School Plannings",
  icon: <MdOutlineBusinessCenter/>,
  path:"/academics/schoolPlannings",
  allowedRoles:["Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
  
  }

  let content 
  content = (
  
    <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6">  
     
        <Link to={'/academics/schoolPlannings/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >Week Planning</li></Link>
        <Link to={'/academics/schoolPlannings/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >Day plan</li></Link>
        <Link to={'/academics/schoolPlannings/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >New Student</li></Link>
        <AcademicYearsSelection/>
      
    </div>
  )
 return content
}

export default SchoolPlannings