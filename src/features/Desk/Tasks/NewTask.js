
//it is not a form like new UserForm
import { useSelector } from 'react-redux'
import { selectAllUsers } from '../../Admin/UsersManagement/usersApiSlice'
import NewTaskForm from './NewTaskForm'

const Newtask = () => {
    const users = useSelector(selectAllUsers)//this will get all users, this will retrun an empty array if no users and will show a blanc page when we are not logged in
    //for this reason we will check the array length 
    if (!users?.length) return <p>Not Currently Available</p>

   
    const content = <NewTaskForm users={users} />//if we have users, the notes will use that info and we pass users in props from the new Task Form
    return content
}
export default Newtask