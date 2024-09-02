
import { Link } from 'react-router-dom'
import { BsQuestionSquare } from 'react-icons/bs'
import AcademicYearsSelection from '../../Components/AcademicYearsSelection'
//we will  find the object corresponding to the page and extract the section tabs
const Inquiries = () => {

const inquiriesTabs= 
{title:"Inquiries",
  icon: <BsQuestionSquare/>,
  path:"/desk/inquiries/",
  allowedRoles:["Employee", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"]
  }

let content = (
  
  <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6">  
  
        <Link to={'/desk/inquiries/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >all Inquiries</li></Link>
        <Link to={'/desk/inquiries/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >New Inquiry </li></Link>
        <Link to={'/desk/inquiries/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >Inquiry 3</li></Link>
        <AcademicYearsSelection/>

    </div>
  )
 return content
}

export default Inquiries