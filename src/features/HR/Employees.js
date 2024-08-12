import { Link } from 'react-router-dom'


//we will  find the object corresponding to the page and extract the section tabs
const Employees = () => {

const employeesTabs= 
{title:"Employees",
  path:"/hr/employees/",
  allowedRoles:["Employee","Animator", "Academic", "Director", "HR", "Desk", "Manager", "Admin"]
  }

let content
content = (
  
    <div className="flex bg-gray-300 justify-left  ">  
      <ul className='flex gap-2 px-2 py-2 bg-gray-300'>
        <Link to={'/hr/employees/employees/'}><li >All Employees</li></Link>
        <Link to={'/hr/employees/newEmployee'}><li >New Employee </li></Link>
        <Link to={'/hr/employees/'}><li >option3</li></Link>
      </ul>
    </div>
  )
 return content
}

export default Employees