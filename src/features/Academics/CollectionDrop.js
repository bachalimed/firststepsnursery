

import { Link } from 'react-router-dom'
import { HiMiniArrowsUpDown } from 'react-icons/hi2'

//we will  find the object corresponding to the page and extract the section tabs
const CollectionDrop = () => {

const CollectionDropTabs= 
{title:"Collection&Drop",
  path:"/academics/collectionDrop",
  allowedRoles:["Parent","ContentManager", "Animator", "Academic", "Director",  "Desk", "Manager", "Admin"]
}


let content 
content = (
  
    <div className="flex bg-gray-300 justify-left  ">  
      <ul className='flex gap-2 px-2 py-2 bg-gray-300'>
        <Link to={'/academics/collectionDrop/'}><li >drop1 </li></Link>
        <Link to={'/academics/collectionDrop/'}><li >drop2</li></Link>
        <Link to={'/academics/collectionDrop/'}><li >drop3</li></Link>
      </ul>
    </div>
  )
 return content
}

export default CollectionDrop