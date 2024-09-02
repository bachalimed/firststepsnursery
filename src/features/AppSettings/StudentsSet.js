

import { Link } from 'react-router-dom'
import AcademicYearsSelection from '../../Components/AcademicYearsSelection'

//we will  find the object corresponding to the page and extract the section tabs
const StudentsSet = () => {

const studentsSetTabs= 
{title:"Students",
  path:"/settings/studentsSet",
  allowedRoles:["Employee","Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"]
    }

let content
content = (
  
  <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6"> 
   
        <Link to={'/settings/studentsSet/studentDocumentsListsList'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">Student Documents List</li></Link>
        <Link to={'/settings/studentsSet/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">Parentblqlqllqs</li></Link>
        <Link to={'/settings/studentsSet/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">other</li></Link>
        <AcademicYearsSelection/>
    
    </div>
  )
 return content
}

export default StudentsSet