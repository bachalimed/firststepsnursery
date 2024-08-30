
import { useEffect } from 'react';

import { useNavigate , Link} from 'react-router-dom';
import AcademicYearsSelection from '../../Components/AcademicYearsSelection'

//we will  find the object corresponding to the page and extract the section tabs
const StudentsParents = () => {




const studentsParentTabs= 
		{title:"Students & Parents",
			path:"/students/studentsParents/",//needs to finish with this path and not /students so that section tabs could work
			allowedRoles:["Parent", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"],
			
			}




  
const content = (
  
    <div className="flex bg-gray-300 justify-left  ">  
      <ul className='flex gap-5 px-2 py-2 bg-gray-300'>
        <Link to={'/students/studentsParents/students/'}><li >Students</li></Link>
        <Link to={'/students/studentsParents/parents/'}><li >Parents</li></Link>
        <Link to={'/students/studentsParents/newStudent/'}><li >New Student</li></Link>
        <Link to={'/students/studentsParents/newParent/'}><li >New Parent</li></Link>
        <AcademicYearsSelection/>
        
        
      </ul>
    </div>
  )
 return content
}

export default StudentsParents