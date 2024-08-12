

//the page has to have sections in the file sidebarMenu or it will generate an error


import { useGetTasksQuery } from "./tasksApiSlice"
import Task from "./Task"
import SectionTabs from '../../../Components/Shared/Tabs/SectionTabs'




const TasksList = () => {
    const {
        data: tasks,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTasksQuery('notesList', {//notesList is a label that will be seen in redux devtools, this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
        pollingInterval: 60000,//will refetch data every 60seconds
        refetchOnFocus: true,//when we focus on another window then come back to the window ti will refetch data
        refetchOnMountOrArgChange: true//refetch when we remount the component
    })

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids } = tasks//only taking the ids, next we will get the entities

        const tableContent = ids?.length
            ? ids.map(taskId => <Task key={taskId} taskId={taskId} />)
            : null

        content = (
            <><SectionTabs/>
            <table className="table table--tasks">
                <thead className="table__thead">
                    <tr>
                        
                        {/* <th scope="col" className="table__th task__status">Completion</th> */}
                        <th scope="col" className="table__th task__status">state</th>
                        <th scope="col" className="table__th task__status">Tasks Subject</th>
                        <th scope="col" className="table__th task__status">Task Priority</th>
                        <th scope="col" className="table__th task__created">Task Description</th>
                        <th scope="col" className="table__th task__updated">Task Creator</th>
                        <th scope="col" className="table__th task__username">Task Due Date</th>
                        <th scope="col" className="table__th task__edit">Task Responsible</th>
                        <th scope="col" className="table__th task__title">Task Reference</th>
                        <th scope="col" className="table__th task__title">Task Completion Date</th>
                        <th scope="col" className="table__th task__title">Task Action</th>
                        <th scope="col" className="table__th task__title">Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
            </>
        )
    }

    return content
}
export default TasksList
