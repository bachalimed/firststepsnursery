import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import {
  selectPayeeById,
  useGetPayeeByIdQuery,
} from "./payeesApiSlice"; //we will pull the user  data from the state and not use query
import EditPayeeForm from "./EditPayeeForm";
import useAuth from "../../../../hooks/useAuth";
import { currentPayeesList } from "./payeesSlice";
import FinancesSet from "../../FinancesSet";
import LoadingStateIcons from "react-loading-icons";
const EditPayee = () => {
  const { id } = useParams(); //pull the id from use params from the url
  //will get hte student from the state
  //const payeeToEdit = useSelector((state) => state.payee?.entities[id]);
 // console.log("helllllow payeeToEdit", "mystu", id);
  //console.log(id, "id");
  const {
    data: payee, //the data is renamed payees
    isLoading: isPayeeLoading, //monitor several situations is loading...
    isSuccess: isPayeeSuccess,
    isError: isPayeeError,
    error: payeeError,
  } = useGetPayeeByIdQuery(
    {
      id: id,
      endpointName: "EditPayee",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  let payeeToEdit;
  if (isPayeeSuccess) {
    //console.log(payee, "payee");
    payeeToEdit = payee[0];
  }

  //console.log(payeeToEdit, "payeeToedit");

  let content;
  if (isPayeeSuccess) {
    content = 
      <>
        <EditPayeeForm payee={payeeToEdit} />
      </>
    
  } 
  // else {
  //   content = 
  //     <>
  //       <FinancesSet />
  //       <LoadingStateIcons />
  //     </>
    
  // }

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditPayee;
