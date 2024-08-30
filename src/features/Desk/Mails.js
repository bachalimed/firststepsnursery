
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
  
    <div className="flex bg-gray-300 justify-left  ">  
      <ul className='flex gap-2 px-2 py-2 bg-gray-300'>
        <Link to={'/desk/mails/mails/'}><li >All Mails</li></Link>
        <Link to={'/desk/mails/myMails/'}><li >My Mailss </li></Link>
        <Link to={'/desk/mails/newTask'}><li >New Task </li></Link>
        <Link to={'/desk/mails/'}><li >Task 3</li></Link>
        <AcademicYearsSelection/>
      </ul>
    </div>
  )
 return content
}

export default Mails