
import { Link } from 'react-router-dom'
import AcademicYearsSelection from '../../Components/AcademicYearsSelection'
import useAuth from "../../hooks/useAuth";
//we will  find the object corresponding to the page and extract the section tabs
const Tasks = () => {



const { isEmployee ,isParent,isContentManager,isAnimator,isAcademic,isFinance,isHR,isDesk , isDirector ,isManager , isAdmin  } = useAuth();
let content = (
  
  <div className="flex bg-gray-300 p-1 px-4 md:px-8 items-center justify-start space-x-4">  
  
        <AcademicYearsSelection style={{ display: isDirector || isManager || isAdmin ? 'block' : 'none' }} />
        <Link to={'/desk/tasks/tasks/'}><li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">All Tasks</li></Link>
        <Link to={'/desk/tasks/myTasks/'}><li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">My Taskss </li></Link>
        <Link to={'/desk/tasks/newTask'}><li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">New Task </li></Link>
        <Link to={'/desk/tasks/'}><li className="list-none text-gray-800 hover:text-sky-700 cursor-pointer">Task 3</li></Link>
  
    </div>
  )
 return content
}


export default Tasks