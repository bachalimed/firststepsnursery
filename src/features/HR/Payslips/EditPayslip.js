import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import {
  selectPayslipById,
  useGetPayslipByIdQuery,
} from "./payslipsApiSlice"; //we will pull the user  data from the state and not use query
import EditPayslipForm from "./EditPayslipForm";
import useAuth from "../../../hooks/useAuth";

import HR from "../HR";
import LoadingStateIcon from "react-loading-icons";
const EditPayslip = () => {
  const { id } = useParams(); //pull the id from use params from the url
  //will get hte student from the state
  //const payslipToEdit = useSelector((state) => state.payslip?.entities[id]);
  // console.log("helllllow payslipToEdit", "mystu", id);
  // console.log(id, "id");
  const {
    data: payslip, //the data is renamed payslips
    isLoading: isPayslipLoading, 
    isSuccess: isPayslipSuccess,
    isError: isPayslipError,
    error: payslipError,
  } = useGetPayslipByIdQuery(
    {
      id: id,
      endpointName: "EditPayslip",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  let payslipToEdit;
  if (isPayslipSuccess) {
    // console.log(payslip, "payslip");
    payslipToEdit = payslip;
  }

  // console.log(payslipToEdit, "payslipToedit");

  let content;
  if (isPayslipSuccess) {
    content = 
      <>
        <EditPayslipForm payslip={payslipToEdit[0]} />
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
export default EditPayslip;
