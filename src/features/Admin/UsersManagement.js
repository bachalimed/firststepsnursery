import { Link } from 'react-router-dom'

import SearchBar from '../../Components/Shared/SearchBar'
//we will  find the object corresponding to the page and extract the section tabs
const UsersManagement = () => {

const usersManagementTabs= 
{title:"Users Management",
  path:"/admin/usersManagement/",
  allowedRoles:[ "Admin"],
  spaced:false,
  sectionTabs:[
    {title:"All Users",
    path:"/admin/usersManagement/users/"},
    
    {title:"New User",
    path:"/admin/usersManagement/newUser/"}
  ]
}

let content
content = (
  
    <div className="flex bg-gray-300 justify-left  ">  
      <ul className='flex gap-2 px-2 py-2 bg-gray-300'>
        <Link to={'/admin/usersManagement/users/'}><li >All Users</li></Link>
        <Link to={'/admin/usersManagement/newUser'}><li >New User </li></Link>
        <Link to={'/admin/usersManagement/'}><li >option3</li></Link>
      </ul>
      {/* <SearchBar/> */}

    </div>
  



)
 return content
}

export default UsersManagement