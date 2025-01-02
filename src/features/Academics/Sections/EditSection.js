import { useParams } from "react-router-dom"; //because we will get the userId from the url
import {  useEffect } from "react";
import EditSectionForm from "./EditSectionForm";
import {
  useGetSectionByIdQuery,
} from "./sectionsApiSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import Academics from "../Academics";
const EditSection = () => {
  useEffect(()=>{document.title="Edit Section"})
  const { id } = useParams(); //pull the id from use params from the url
  //console.log(id, "idddddddd");
  const {
    data: secToEdit, //the data is renamed families
    // isLoading: isSectionLoading, //monitor several situations
    isSuccess: isSectionSuccess,
    // isError: isSectionError,
    // error: sectionError,
  } = useGetSectionByIdQuery(
    { id: id, endpointName: "EditSection" }, ////in the backend we populate studetn to get his name
    {
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  let content;
  const sectionToEdit = isSectionSuccess
    ? Object.values(secToEdit.entities)
    : [];

  if (sectionToEdit.length === 1) {
    //console.log(sectionToEdit, "sectionToEdit ");
    const section = sectionToEdit[0][0];
    content = (
      <>
        <EditSectionForm section={section} />;
      </>
    );
  } else {
    content = (
      <>
        <Academics />
        <LoadingStateIcon />
      </>
    );
  }

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditSection;
