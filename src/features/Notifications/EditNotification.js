import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import {
  selectNotificationById,
  useGetNotificationByIdQuery,
} from "./notificationsApiSlice"; //we will pull the user  data from the state and not use query
import EditNotificationForm from "./EditNotificationForm";
import useAuth from "../../../hooks/useAuth";
import { currentNotificationsList } from "./notificationsSlice";
import LoadingStateIcons from "react-loading-icons";
const EditNotification = () => {
  const { id } = useParams(); //pull the id from use params from the url

  //will get hte student from the state
  const notificationToEdit = useSelector((state) => state.notification?.entities[id]);
  //console.log('helllllow',notificationToEdit.userFullName.userFirstName, 'mystu', id)

  let content;

  content = notificationToEdit ? (
    <EditNotificationForm notification={notificationToEdit} />
  ) : (
    <LoadingStateIcons />
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditNotification;
