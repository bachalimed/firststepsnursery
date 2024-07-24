
//it is not a form like new UserForm
import { useSelector } from 'react-redux'
import { selectAllUsers } from '../Admin/usersApiSlice'
import NewtaskForm from './NewTaskForm'

const Newtask = () => {
    const users = useSelector(selectAllUsers)//this will get all users

    const content = users ? <NewtaskForm users={users} /> : <p>Loading...</p>//if we have users, the notes will use that info and we pass users in props from the new Task Form

    return content
}
export default Newtask