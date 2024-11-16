import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  selectPaymentById,
  useGetPaymentByIdQuery,
} from "./paymentsApiSlice"; //we will pull the user  data from the state and not use query
import EditPaymentForm from "./EditPaymentForm";
import useAuth from "../../../hooks/useAuth";
import LoadingStateIcons from "../../../Components/LoadingStateIcon";
//import { currentPaymentsList } from "./paymentsSlice";
import Finances from "../Finances";
const EditPayment = () => {
  const { id } = useParams(); //pull the id from use params from the url
  console.log(id,'id')
  const [payment, setPayment] = useState("");
  const {
    data: paymentToEdit, //the data is renamed families
    isLoading: isPaymentLoading, //monitor several situations
    isSuccess: isPaymentSuccess,
    isError: isPaymentError,
    error: paymentError,
  } = useGetPaymentByIdQuery({ id: id, endpointName: "EditPayment" } || {}, {
    // "dry" will not ppoulate children fully
    //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
    //pollingInterval: 60000,//will refetch data every 60seconds
    refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
    refetchOnMountOrArgChange: true, //refetch when we remount the component
  });
  //console.log('hiiiiiiiiiiii')
  // useEffect(() => {
  //   if (isPaymentSuccess) {
       //console.log('helllllow',paymentToEdit, 'mystu')
  //     //const paymentInit = Object.values(paymentToEdit.entities)
  //     // setPayment(paymentToEdit); // Set payment state to the first object
  //     //console.log('helllllow',payment, 'mystu')
  //   }
  // // }, [isPaymentSuccess, paymentToEdit]);
  // let paymentTE = isPaymentSuccess
  // ? Object.values(paymentToEdit.entities)
  // : null;
  let content;

  content = paymentToEdit ? (
    <>
     
      <EditPaymentForm payment={paymentToEdit} />
    </>
  ) : (
    <>
      <Finances />
      <LoadingStateIcons />
    </>
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditPayment;
