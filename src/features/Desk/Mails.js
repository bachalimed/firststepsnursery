
import { Link } from 'react-router-dom'
import AcademicYearsSelection from '../../Components/AcademicYearsSelection'

//we will  find the object corresponding to the page and extract the section tabs
const Mails = () => {

const mailsTabs= 
{title:"Mails",
  path:"/desk/mails",
  allowedRoles:["Employee", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"]
}

let content = (
  
  <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6"> 
  
        <Link to={'/desk/mails/mails/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >All Mails</li></Link>
        <Link to={'/desk/mails/myMails/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >My Mailss </li></Link>
        <Link to={'/desk/mails/newTask'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >New Task </li></Link>
        <Link to={'/desk/mails/'}><li >Task 3</li></Link>
        <AcademicYearsSelection/>
  
    </div>
  )
 return content
}

export default Mails