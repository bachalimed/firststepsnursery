import { useState, useEffect } from "react"
import { useUpdateTaskMutation, useDeleteTaskMutation } from "./tasksApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import Tasks from "../Tasks"
import useAuth from '../../../hooks/useAuth'

const EditTaskForm = ({ task, users }) => {

    const {isManager, isAcademic,  isDirector,  isAdmin}=useAuth()

    const [updateTask, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateTaskMutation()

    const [deleteTask, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteTaskMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState(task.title)
    const [text, setText] = useState(task.text)
    const [completed, setCompleted] = useState(task.completed)
    const [userId, setUserId] = useState(task.user)

    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/tasks')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const onSaveTaskClicked = async (e) => {
        if (canSave) {
            await updateTask({ id: task.id, user: userId, title, text, completed })
        }
    }

    const onDeleteTaskClicked = async () => {
        await deleteTask({ id: task.id })
    }

    const created = new Date(task.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(task.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}

            > {user.username}</option >
        )
    })

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validTitleClass = !title ? "form__input--incomplete" : ''
    const validTextClass = !text ? "form__input--incomplete" : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    // define the delete button that will only be visible if user is in the allowed roles above
    
    let deleteButton = null
    if (isManager || isAdmin || isAcademic || isDirector) {
        deleteButton = (
            <button
                className="icon-button"
                title="Delete"
                onClick={onDeleteTaskClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>
        )
    }


    const content = (
        <>
            <Tasks/>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Task #{task.ticket}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveTaskClicked}
                            disabled={!canSave||isLoading}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        {deleteButton}
                    </div>
                </div>
                <label className="form__label" htmlFor="task-title">
                    Title:</label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="task-title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className="form__label" htmlFor="task-text">
                    Text:</label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="task-text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />
                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="task-completed">
                            WORK COMPLETE:
                            <input
                                className="form__checkbox"
                                id="task-completed"
                                name="completed"
                                type="checkbox"
                                checked={completed}
                                onChange={onCompletedChanged}
                            />
                        </label>

                        <label className="form__label form__checkbox-container" htmlFor="task-username">
                            ASSIGNED TO:</label>
                        <select
                            id="task-username"
                            name="username"
                            className="form__select"
                            value={userId}
                            onChange={onUserIdChanged}
                        >
                            {options}
                        </select>
                    </div>
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>
                </div>
            </form>
        </>
    )

    return content
}

export default EditTaskForm