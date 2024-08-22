

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
  
    <div className="flex bg-gray-300 justify-left  ">  
      <ul className='flex gap-4 px-2 py-2 bg-gray-300'>
        <Link to={'/settings/academicsSet/academicYears/'}><li >Academic Years</li></Link>
        <Link to={'/settings/academicsSet/attendedSchools/'}><li >attendedSchools </li></Link>
        <Link to={'/settings/academicsSet'}><li >option3</li></Link>
      </ul>
    </div>
  )
 return content
}

export default AcademicsSet