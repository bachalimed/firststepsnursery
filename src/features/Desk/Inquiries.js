
import { Link } from 'react-router-dom'
import { BsQuestionSquare } from 'react-icons/bs'

//we will  find the object corresponding to the page and extract the section tabs
const Inquiries = () => {

const inquiriesTabs= 
{title:"Inquiries",
  icon: <BsQuestionSquare/>,
  path:"/desk/inquiries/",
  allowedRoles:["Employee", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"]
  }

let content = (
  
    <div className="flex bg-gray-300 justify-left  ">  
      <ul className='flex gap-2 px-2 py-2 bg-gray-300'>
        <Link to={'/desk/inquiries/'}><li >all Inquiries</li></Link>
        <Link to={'/desk/inquiries/'}><li >New Inquiry </li></Link>
        <Link to={'/desk/inquiries/'}><li >Inquiry 3</li></Link>
      </ul>
    </div>
  )
 return content
}

export default Inquiries