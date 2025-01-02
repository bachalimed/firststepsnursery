import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useEffect } from "react";
import {
  useGetLeaveByIdQuery,
} from "./leavesApiSlice"; //we will pull the user  data from the state and not use query
import EditLeaveForm from "./EditLeaveForm";
import HR from "../HR";
import LoadingStateIcon from "react-loading-icons";
const EditLeave = () => {
  useEffect(() => {
    document.title = "Edit Leave";
  });
  const { id } = useParams(); //pull the id from use params from the url
  //will get hte student from the state
  //const leaveToEdit = useSelector((state) => state.leave?.entities[id]);
 // console.log("helllllow leaveToEdit", "mystu", id);
  //console.log(id, "id");
  const {
    data: leave, //the data is renamed leaves
    // isLoading: isLeaveLoading, 
    isSuccess: isLeaveSuccess,
    // isError: isLeaveError,
    // error: leaveError,
  } = useGetLeaveByIdQuery(
    {
      id: id,
      endpointName: "EditLeave",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  let leaveToEdit;
  if (isLeaveSuccess) {
    // console.log(leave, "leave");
    leaveToEdit = leave[0];
  }

  // console.log(leaveToEdit, "leaveToedit");

  let content;
  if (isLeaveSuccess) {
    content = 
      <>
        <EditLeaveForm leave={leaveToEdit} />
      </>
    
  } 
  // else {
  //   content = 
  //     <>
  //       <HR />
  //       <LoadingStateIcon />
  //     </>
    
  // }

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditLeave;
