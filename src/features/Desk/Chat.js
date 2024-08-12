

import { Link } from 'react-router-dom'


//we will  find the object corresponding to the page and extract the section tabs
const Chat = () => {

const studentsParentTabs= 
{title:"Chat",

  path:"/desk/Chat",
  allowedRoles:["Employee", "Animator", "Academic", "Director",  "Desk", "Manager", "Admin"]
}

let content
content = (
  
    <div className="flex bg-gray-300 justify-left  ">  
      <ul className='flex gap-2 px-2 py-2 bg-gray-300'>
        <Link to={'/desk/chat/'}><li >Students</li></Link>
        <Link to={'/desk/chat/'}><li >Parents</li></Link>
        <Link to={'/desk/chat/'}><li >New Student</li></Link>
      </ul>
    </div>
  )
 return content
}

export default Chat