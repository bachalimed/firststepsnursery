
import { Link } from 'react-router-dom'


//we will  find the object corresponding to the page and extract the section tabs
const Tasks = () => {

const tasksTabs= 
{title:"Tasks",
  path:"/desk/tasks/",
  allowedRoles:["Employee", "Animator", "Academic", "Director", "Finance", "HR", "Desk", "Manager", "Admin"]
  }
let content = (
  
    <div className="flex bg-gray-300 justify-left  ">  
      <ul className='flex gap-2 px-2 py-2 bg-gray-300'>
        <Link to={'/desk/tasks/tasks/'}><li >All Tasks</li></Link>
        <Link to={'/desk/tasks/myTasks/'}><li >My Taskss </li></Link>
        <Link to={'/desk/tasks/newTask'}><li >New Task </li></Link>
        <Link to={'/desk/tasks/'}><li >Task 3</li></Link>
      </ul>
    </div>
  )
 return content
}


export default Tasks