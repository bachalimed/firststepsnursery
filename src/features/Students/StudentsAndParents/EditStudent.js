import { useParams } from 'react-router-dom' //because we will get the userId from the url
import { useSelector } from 'react-redux'
import { selectAllStudents, selectStudentById, useGetStudentByIdQuery } from './studentsApiSlice' //we will pull the user  data from the state and not use query
import EditStudentForm from './EditStudentForm'
import useAuth from '../../../hooks/useAuth'


const EditStudent = () => {
  const { id } = useParams()//pull the id from use params from the url
  const{data:ImportedStudent,
    isLoading,
    isError,
      isSuccess
  }=useGetStudentByIdQuery({id:id ,endpointName: 'studentsById'}||{},{//this param will be passed in req.params to select only students for taht year
    //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
    pollingInterval: 60000,//will refetch data every 60seconds
    refetchOnFocus: true,//when we focus on another window then come back to the window ti will refetch data
    refetchOnMountOrArgChange: true//refetch when we remount the component
  })
  
  let content
  if (isLoading){content = <h1>is loading</h1>}
  if (isSuccess){
   console.log('hi',ImportedStudent.entities[id] )
  //const studentToEdit = useSelector((state) => selectStudentById(state, id ))//selectUserById is a memoized selector created in the user API, the issue i cannot select a specific student because it is imported by getstudetnbyid which does not store inteh same stae positin tags
  // so i manually update hte state in students list and import all the list which is many or one student
  //const {entities} = ImportedStudent
  
  //  const studentToEdit = useSelector((state) => {console.log('Statesss:', state.student.entities[id])
    
  //    return selectStudentById(studentToEdit, id)
  //  })
  //console.log('the student is ', ImportedStudent.entities[id], id)

   content = ImportedStudent ? <EditStudentForm student={ImportedStudent.entities[id]} /> : <p>Loading...</p>

}
if(isError){<h1>is error</h1>}
  return content
}
export default EditStudent