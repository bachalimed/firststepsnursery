

import AcademicYearsSelection from '../../Components/AcademicYearsSelection'
import { Link } from 'react-router-dom'


//we will  find the object corresponding to the page and extract the section tabs
const AcademicsSet = () => {

const academicsSetTabs= 
{title:"Academics",
  path:"/settings/academicsSet",
  allowedRoles:["Employee","Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
    sectionTabs:[
    {title:"Academic Years",
    path:"academicYears/",
    allowedRoles:[ "Academic", "Director","Manager", "Admin"]
    },

    {title:"Schools",
    path:"attendedSchools/",
    allowedRoles:[ "Academic", "Director","Manager", "Admin"]
    },
    
    {title:"bloblo",
    path:"/settings/bloblo/",
    allowedRoles:["Employee","Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"]
  }
    
  ]
    }

let content
content = (
  
    <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6">  
     
        <Link to={'/settings/academicsSet/academicYears/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">Academic Years</li></Link>
        <Link to={'/settings/academicsSet/attendedSchools/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">attendedSchools </li></Link>
        <Link to={'/settings/academicsSet'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">option3</li></Link>
        <AcademicYearsSelection/>
    
    </div>
  )
 return content
}

export default AcademicsSet