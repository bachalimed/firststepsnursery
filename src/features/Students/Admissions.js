
import { Link } from 'react-router-dom'
import { IoFileTrayStackedOutline } from 'react-icons/io5'
import AcademicYearsSelection from '../../Components/AcademicYearsSelection'
const Admissions = () => {

  const admissionsTabs={title:"Admissions",
    path:"/students/admissions",
    allowedRoles:["Parent", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"]    
    }
 
let content 
content = (
  
  <div className="flex bg-gray-300 justify-left  ">  
    <ul className='flex gap-2 px-2 py-2 bg-gray-300'>
      <Link to={'/students/admissions/allAdmissions/'}><li >All Admissions</li></Link>
      <Link to={'/students/admissions/newAdmission/'}><li >New Admission</li></Link>
      <Link to={'/students/admissions/blablabla/'}><li >blabla</li></Link>
      <AcademicYearsSelection/>
    </ul>
  </div>
)
return content
}

export default Admissions