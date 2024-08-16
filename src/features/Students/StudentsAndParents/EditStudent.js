import { useParams } from 'react-router-dom' //because we will get the userId from the url
import { useSelector } from 'react-redux'
import { selectStudentById } from './studentsApiSlice' //we will pull the user  data from the state and not use query
import EditStudentForm from './EditStudentForm'

const EditStudent = () => {
  const { id } = useParams()//pull the id from use params from the url

  const student = useSelector(state => selectStudentById(state, id))//selectUserById is a memoized selector created in the user API
  console.log('the student is ', student, id)

  const content = student ? <EditStudentForm student={student} /> : <p>Loading...</p>


  return content
}
export default EditStudent