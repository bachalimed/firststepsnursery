

import { Link } from 'react-router-dom'
import AcademicYearsSelection from '../../Components/AcademicYearsSelection'

//we will  find the object corresponding to the page and extract the section tabs
const CmsSet = () => {

const cmsTabs= 
{title:"CMS",
  path:"/settings/cmsSet",
  allowedRoles:["Employee","Parent","ContentManager", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"]
    }

let content
content = (
  
    <div className="flex bg-gray-300 justify-left  ">  
      <ul className='flex gap-2 px-2 py-2 bg-gray-300'>
        <Link to={'/settings/cmsSet'}><li >page</li></Link>
        <Link to={'/settings/cmsSet'}><li >new post</li></Link>
        <Link to={'/settings/cmsSet'}><li >New Student</li></Link>
        <AcademicYearsSelection/>
      </ul>
    </div>
  )
 return content
}

export default CmsSet