import { useParams } from 'react-router-dom' //because we will get the userId from the url
import { useSelector } from 'react-redux'
import { selectUserById } from './usersApiSlice' //we will pull the user  data from the state and not use query
import EditUserForm from './EditUserForm'

const EditUser = () => {
  const { id } = useParams()//pull the id from use params from the url


  const user = useSelector(state => selectUserById(state, id))//selectUserById is a memoized selector created in the user API
  console.log('the user is ', user, id)

  const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>

  return content
}
export default EditUser
