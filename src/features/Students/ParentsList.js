
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import SectionTabs from '../../Components/Shared/Tabs/SectionTabs'

import { useSelector } from 'react-redux'//help get the ids
import { selectStudentById } from './studentsApiSlice'//use the memoized selector

const Student = ({ studentId }) => {//studentId is used in StudentsList from the get query
    const student = useSelector(state => selectStudentById(state, studentId))

    const navigate = useNavigate()

    if (student) {//if student exists we get all the data 
        const handleEdit = () => navigate(`/admin/students/${studentId}`)//the path to be set in app.js and to be checked with server.js in backend, this is editing page of student
 
         const studentDob = new Date(student.studentDob).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })

        return (
            
            <tr className="table__row student">
                will only show if student is active
                <td className={`table__cell ${student.studentIsActive}`}>{student.studentName.firstName+" "+student.studentName.middleName+" "+student.studentName.lastName}</td>
                <td className={`table__cell ${student.studentIsActive}`}>{studentDob}</td>
                <td className={`table__cell ${student.studentIsActive}`}>{student.studentSex}</td>
                <td className={`table__cell ${student.studentIsActive}`}>{student.studentIsActive}</td>
                
                <td className={`table__cell ${student.studentIsActive}`}>
                    <button
                        className=""
                        onClick={handleEdit}//we call handle edit if the button is clicked
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
           
        )

    } else return null//if we do not have a student
}
export default Student