//this is to create an active subscription to the DB to use the data instaed of the data from the state values, so we will not  refresh loading after the 60seconds default

import { store } from '../../app/store'
//import { notesApiSlice } from '../notes/notesApiSlice'
import { usersApiSlice } from '../Admin/UsersManagement/usersApiSlice'
import { employeesApiSlice } from '../HR/Employees/employeesApiSlice'
import { studentsApiSlice } from '../Students/StudentsAndParents/studentsApiSlice'
import { parentsApiSlice } from '../Students/StudentsAndParents/parentsApiSlice'
import { tasksApiSlice } from '../Desk/Tasks/tasksApiSlice'
import { academicYearsApiSlice } from '../AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
    useEffect(() => {//will run when the component mounts
        console.log('subscribing')
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())//manual subscription to each endpoint by querying
        const students = store.dispatch(studentsApiSlice.endpoints.getStudents.initiate())
        const parents = store.dispatch(parentsApiSlice.endpoints.getParents.initiate())
        const employees = store.dispatch(employeesApiSlice.endpoints.getEmployees.initiate())
        const tasks = store.dispatch(tasksApiSlice.endpoints.getTasks.initiate())
        const academicYears = store.dispatch(academicYearsApiSlice.endpoints.getAcademicYears.initiate())

        return () => {
            console.log('unsubscribing')
            users.unsubscribe()
            students.unsubscribe()
            parents.unsubscribe()
            employees.unsubscribe()
            tasks.unsubscribe()
            academicYears.unsubscribe()
        }
    }, [])

    return <Outlet />
}
export default Prefetch