import { useParams } from 'react-router-dom'//because we need the id of the note from the url
import { useSelector } from 'react-redux'
import { selectTaskById } from './tasksApiSlice'
import { selectAllUsers } from '../../Admin/UsersManagement/usersApiSlice'
import EditTaskForm from './EditTaskForm'
import LoadingStateIcon from '../../../Components/LoadingStateIcon'
const EditTask = () => {
    const { id } = useParams()//get the task id from url

    const task = useSelector(state => selectTaskById(state, id))//get the specific task by its id 
    const users = useSelector(selectAllUsers)//get all the users

    const content = task && users ? <EditTaskForm task={task} users={users} /> : <p><LoadingStateIcon/></p>//check if we have task and users data

    return content
}
export default EditTask