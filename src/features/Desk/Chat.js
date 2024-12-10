

import { Link } from 'react-router-dom'
import AcademicYearsSelection from '../../Components/AcademicYearsSelection'

//we will  find the object corresponding to the page and extract the section tabs
const Chat = () => {

const studentsParentTabs= 
{title:"Chat",

  path:"/desk/Chat",
  allowedRoles:["Employee", "Animator", "Academic", "Director",  "Desk", "Manager", "Admin"]
}

let content
content = (
  
  <div className="flex bg-gray-300 p-1 px-4 md:px-8 items-center justify-start space-x-4">  
     
        <AcademicYearsSelection/>
        <Link to={'/desk/chat/'}><li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">Students</li></Link>
        <Link to={'/desk/chat/'}><li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">Parents</li></Link>
        <Link to={'/desk/chat/'}><li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">New Student</li></Link>
  
    </div>
  )
 return content
}

export default Chat