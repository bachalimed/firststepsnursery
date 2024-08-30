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
  
    <div className="flex bg-gray-300 justify-left  ">  
      <ul className='flex gap-2 px-2 py-2 bg-gray-300'>
        <Link to={'/academics/schoolPlannings/'}><li >Week Planning</li></Link>
        <Link to={'/academics/schoolPlannings/'}><li >Day plan</li></Link>
        <Link to={'/academics/schoolPlannings/'}><li >New Student</li></Link>
        <AcademicYearsSelection/>
      </ul>
    </div>
  )
 return content
}

export default SchoolPlannings