

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
  
    <div className="flex bg-gray-300 justify-left  ">  
      <ul className='flex gap-2 px-2 py-2 bg-gray-300'>
        <Link to={'/settings/studentsSet/studentDocumentsListsList'}><li >Student Documents List</li></Link>
        <Link to={'/settings/studentsSet/'}><li >Parentblqlqllqs</li></Link>
        <Link to={'/settings/studentsSet/'}><li >other</li></Link>
        <AcademicYearsSelection/>
      </ul>
    </div>
  )
 return content
}

export default StudentsSet