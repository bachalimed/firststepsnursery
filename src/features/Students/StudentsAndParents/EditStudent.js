import { useParams } from 'react-router-dom' //because we will get the userId from the url
import { useSelector } from 'react-redux'
import { selectStudentById } from './studentsApiSlice' //we will pull the user  data from the state and not use query
import EditStudentForm from './EditStudentForm'
import useAuth from '../../../hooks/useAuth'

const EditStudent = () => {
  const { id } = useParams()//pull the id from use params from the url

  // const student = useSelector((state) => selectStudentById(state.student, id))//selectUserById is a memoized selector created in the user API
  const student = useSelector((state) => {console.log('State:', state.student)
    return selectStudentById(state.student, id)
  })
  console.log('the student is ', student, id)

  const content = student ? <EditStudentForm student={student} /> : <p>Loading...</p>


  return content
}
export default EditStudent