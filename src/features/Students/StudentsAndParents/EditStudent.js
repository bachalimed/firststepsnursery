import { useParams } from 'react-router-dom' //because we will get the userId from the url
import { useSelector } from 'react-redux'
import {  selectStudentById, useGetStudentByIdQuery } from './studentsApiSlice' //we will pull the user  data from the state and not use query
import EditStudentForm from './EditStudentForm'
import useAuth from '../../../hooks/useAuth'
import { currentStudentsList } from './studentsSlice'


const EditStudent = () => {
  const { id } = useParams()//pull the id from use params from the url
  

//will get hte student from the state
  const studentToEdit = useSelector(state=> state.student?.entities[id])
  console.log('helllllow',studentToEdit, 'mystu')


  let content

  // const{data:StudentToEdit,
  //   isLoading,
  //   isError,
  //     isSuccess
  // }=useGetStudentByIdQuery({id:id ,endpointName: 'studentsById'}||{},{//this param will be passed in req.params to select only students for taht year
  //   //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
  //   pollingInterval: 60000,//will refetch data every 60seconds
  //   refetchOnFocus: true,//when we focus on another window then come back to the window ti will refetch data
  //   refetchOnMountOrArgChange: true//refetch when we remount the component
  // })
  
  // if (isLoading){content = <h1>is loading</h1>}
  // if (isSuccess){
   ///console.log('hi',StudentToEdit.entities[id] )
  

   content = studentToEdit ? <EditStudentForm student={studentToEdit} /> : <p>Loading...</p>

//}
//if(isError){<h1>is error</h1>}
  return content
}
export default EditStudent