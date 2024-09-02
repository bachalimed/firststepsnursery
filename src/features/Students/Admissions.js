
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
  
  <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6">  

      <Link to={'/students/admissions/allAdmissions/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >All Admissions</li></Link>
      <Link to={'/students/admissions/newAdmission/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >New Admission</li></Link>
      <Link to={'/students/admissions/blablabla/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >blabla</li></Link>
      <AcademicYearsSelection/>
  
  </div>
)
return content
}

export default Admissions