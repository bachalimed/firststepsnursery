import { Link } from 'react-router-dom'
import { LuSchool } from 'react-icons/lu'
import AcademicYearsSelection from '../../Components/AcademicYearsSelection'
const NurseryPlannings = () => {
 

const NurseryPlanningsTabs = {title:"Nursery Plannings",
  icon: <LuSchool/>,
  path:"/academics/nurseryPlannings",
  allowedRoles:["Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"]
  }

  let content 
  content = (
  
    <div className="flex bg-gray-300 justify-left  ">  
      <ul className='flex gap-2 px-2 py-2 bg-gray-300'>
        <Link to={'/academics/schoolPlannings/'}><li >nurs Planning</li></Link>
        <Link to={'/academics/schoolPlannings/'}><li >ners plan</li></Link>
        <Link to={'/academics/schoolPlannings/'}><li >new pppl anning</li></Link>
        <AcademicYearsSelection/>
      </ul>
    </div>
  )
 return content
}

export default NurseryPlannings 