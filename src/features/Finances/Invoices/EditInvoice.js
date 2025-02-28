import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useState, useEffect } from "react";
import {
  useGetInvoiceByIdQuery,
} from "./invoicesApiSlice"; //we will pull the user  data from the state and not use query
import EditInvoiceForm from "./EditInvoiceForm";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import Finances from "../Finances";
const EditInvoice = () => {
  useEffect(() => {
    document.title = "Edit invoice";
  });
  const { id } = useParams(); //pull the id from use params from the url
  // console.log(id,'id')
  
  const {
    data: invoiceToEdit, //the data is renamed families
    // isLoading: isInvoiceLoading, //monitor several situations
    // isSuccess: isInvoiceSuccess,
    // isError: isInvoiceError,
    // error: invoiceError,
  } = useGetInvoiceByIdQuery({ id: id, endpointName: "EditInvoice" } || {}, {
   
    refetchOnFocus: true, 
    refetchOnMountOrArgChange: true, 
  });
  //console.log('hiiiiiiiiiiii')
  // useEffect(() => {
  //   if (isInvoiceSuccess) {
       //console.log('helllllow',invoiceToEdit, 'mystu')
  //     //const invoiceInit = Object.values(invoiceToEdit.entities)
  //     // setInvoice(invoiceToEdit); // Set invoice state to the first object
  //     //console.log('helllllow',invoice, 'mystu')
  //   }
  // // }, [isInvoiceSuccess, invoiceToEdit]);
  // let invoiceTE = isInvoiceSuccess
  // ? Object.values(invoiceToEdit.entities)
  // : null;
  let content;

  content = invoiceToEdit ? (
    <>
     
      <EditInvoiceForm invoice={invoiceToEdit} />
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
export default EditInvoice;
