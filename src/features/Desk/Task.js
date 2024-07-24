import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectTaskById } from './tasksApiSlice'


const TaskList = ({ taskId }) => {

    const task = useSelector(state => selectTaskById(state, taskId))

    const navigate = useNavigate()

    if (task) {
        const created = new Date(task.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })//mongo provides createdAt and updatedAT automatically??, en-us needs to be set to local area time

        const updated = new Date(task.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })

        const handleEdit = () => navigate(`/desk/tasks/${taskId}`)//we will be editing task information here later

        return (
            <tr className="table__row">
                {/* <td className="table__cell task__status">
                    {task.taskCompletionDate//task gets a different class if completed or not, we can use our state from db
                        ? <span className="task__status--completed">Completed</span>
                        : <span className="task__status--open">Open</span>
                    }
                </td> */}
            
                <td className="table__cell task__created">{task.taskState}</td>
                <td className="table__cell task__created">{task.taskSubject}</td>
                <td className="table__cell task__created">{task.taskPriority}</td>
                <td className="table__cell task__created">{task.taskDescription}</td>
                <td className="table__cell task__created">{task.taskCreator}</td>
                <td className="table__cell task__created">{task.taskDueDate.split('T')[0]}</td>
                <td className="table__cell task__created">{task.taskResponsible}</td>
                <td className="table__cell task__created">{task.taskReference}</td>
                <td className="table__cell task__updated">{task.taskCompletionDate.split('T')[0]}</td>
                <td className="table__cell task__title">{task.taskAction.actionDescription}</td>
                <td className="table__cell task__username">{updated}</td>

                <td className="table__cell">
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}
export default TaskList
