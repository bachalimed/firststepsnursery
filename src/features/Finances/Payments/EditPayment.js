import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useState, useEffect } from "react";
import {
  useGetPaymentByIdQuery,
} from "./paymentsApiSlice"; //we will pull the user  data from the state and not use query
import EditPaymentForm from "./EditPaymentForm";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import Finances from "../Finances";
const EditPayment = () => {
  useEffect(() => {
    document.title = "Edit Payment";
  });
  const { id } = useParams(); //pull the id from use params from the url
  // console.log(id,'id')
  const [payment, setPayment] = useState("");
  const {
    data: paymentToEdit, //the data is renamed families
    // isLoading: isPaymentLoading, //monitor several situations
    // isSuccess: isPaymentSuccess,
    // isError: isPaymentError,
    // error: paymentError,
  } = useGetPaymentByIdQuery({ id: id, endpointName: "EditPayment" } || {}, {
   
    refetchOnFocus: true, 
    refetchOnMountOrArgChange: true, 
  });
 
  let content;

  content = paymentToEdit ? (
    <>
     
      <EditPaymentForm payment={paymentToEdit} />
    </>
  ) : (
    <>
      <Finances />
      <LoadingStateIcon />
    </>
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditPayment;
