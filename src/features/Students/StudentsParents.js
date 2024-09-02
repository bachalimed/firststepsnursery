
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
  
    <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6">  
      
        <Link to={'/students/studentsParents/students/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >Students</li></Link>
        <Link to={'/students/studentsParents/parents/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer" >Parents</li></Link>
        <Link to={'/students/studentsParents/families/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">Families</li></Link>
        <Link to={'/students/studentsParents/newStudent/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">New Student</li></Link>
    
        <Link to={'/students/studentsParents/newParent/'}><li className="list-none text-gray-800 hover:text-blue-500 cursor-pointer">New Parent</li></Link>
        <AcademicYearsSelection/>
        
     
    </div>
  )
 return content
}

export default StudentsParents