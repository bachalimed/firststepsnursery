// import { useParams } from "react-router-dom"; //because we will get the userId from the url
// import { useSelector } from "react-redux";
// import EditNotificationForm from "./EditNotificationForm";
// import LoadingStateIcon from "react-loading-icons";
// const EditNotification = () => {
//   useEffect(() => {
//     document.title = "Edit Notification";
//   });
//   const { id } = useParams(); //pull the id from use params from the url

//   //will get hte student from the state
//   const notificationToEdit = useSelector((state) => state.notification?.entities[id]);
//   //console.log('helllllow',notificationToEdit.userFullName.userFirstName, 'mystu', id)

//   let content;
// ///add another section before for loading to make links available
//   content = notificationToEdit ? (<>notification header here
//     <EditNotificationForm notification={notificationToEdit} /></>
//   ) : (
//     <>notification header here<LoadingStateIcon /></>
//   );

//   //}
//   //if(isError){<h1>is error</h1>}
//   return content;
// };
// export default EditNotification;
