import { Link } from 'react-router-dom'
import { FaListCheck } from "react-icons/fa6"
import AcademicYearsSelection from '../../Components/AcademicYearsSelection'
const Enrolments = () => {

  const enrolmentTabs = {title:"Enrolments",
    icon: <FaListCheck/>,
    path:"/students/enrolments",
    allowedRoles:["Parent", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],    
        }


    let content 
    content = (
  
      <div className="flex bg-gray-300 justify-left  ">  
        <ul className='flex gap-2 px-2 py-2 bg-gray-300'>
          <Link to={'/students/admissions/allEnrolments'}><li >All Enrolments</li></Link>
          <Link to={'/students/admissions/newEnrolment'}><li >New Enrolment</li></Link>
          <Link to={'/students/admissions/ffefef'}><li >blabla</li></Link>
          <AcademicYearsSelection/>
        </ul>
      </div>
    )
   return content
  }
  
  export default Enrolments