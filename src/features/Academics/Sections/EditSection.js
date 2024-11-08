import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import { selectSectionById } from "./sectionsApiSlice"; //we will pull the user  data from the state and not use query
import EditSectionForm from "./EditSectionForm";
import {
  
  useUpdateSectionMutation,
  useGetSectionByIdQuery,
  useDeleteSectionMutation,
} from "./sectionsApiSlice";
import useAuth from "../../../hooks/useAuth";
import { currentSectionsList } from "./sectionsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { GiConsoleController } from "react-icons/gi";
import Sections from "../Sections";
const EditSection = () => {
  const { id } = useParams(); //pull the id from use params from the url
  //console.log(id, "idddddddd");
  const {
    data: secToEdit, //the data is renamed families
    isLoading: isSectionLoading, //monitor several situations
    isSuccess: isSectionSuccess,
    isError: isSectionError,
    error: sectionError,
  } = useGetSectionByIdQuery(
    { id: id, endpointName: "EditSection" }, ////in the backend we populate studetn to get his name
    {
      // "dry" will not ppoulate children fully
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  let content;
  const sectionToEdit = isSectionSuccess
    ? Object.values(secToEdit.entities)
    : [];
    
    if (sectionToEdit.length===1) {
    console.log(sectionToEdit, "sectionToEdit ");
const section=sectionToEdit[0][0]
    content = (
      <>
        <EditSectionForm section={section} />;
      </>
    );
  } else {
    content = (
      <>
        <Sections />
        <LoadingStateIcon />
      </>
    );
  }

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditSection;
