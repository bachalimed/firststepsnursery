import { Link } from 'react-router-dom'
import AcademicYearsSelection from '../../Components/AcademicYearsSelection'

//we will  find the object corresponding to the page and extract the section tabs
const Employees = () => {

const employeesTabs= 
{title:"Employees",
  path:"/hr/employees/",
  allowedRoles:["Employee","Animator", "Academic", "Director", "HR", "Desk", "Manager", "Admin"]
  }

let content
content = (
  
  <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6">  

        <Link to={'/hr/employees/employees/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >All Employees</li></Link>
        <Link to={'/hr/employees/newEmployee'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >New Employee </li></Link>
        <Link to={'/hr/employees/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">option3</li ></Link>
    
    </div>
  )
 return content
}

export default Employees