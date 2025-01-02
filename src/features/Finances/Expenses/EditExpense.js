import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useState, useEffect } from "react";
import {
  useGetExpenseByIdQuery,
} from "./expensesApiSlice"; //we will pull the user  data from the state and not use query
import EditExpenseForm from "./EditExpenseForm";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
//import { currentExpensesList } from "./expensesSlice";
import Finances from "../Finances";
const EditExpense = () => {
  useEffect(() => {
    document.title = "Edit Expense";
  });
  const { id } = useParams(); //pull the id from use params from the url
  //console.log(id,'id')
  const [expense, setExpense] = useState("");
  const {
    data: expenseToEdit, //the data is renamed families
    // isLoading: isExpenseLoading, //monitor several situations
    // isSuccess: isExpenseSuccess,
    // isError: isExpenseError,
    // error: expenseError,
  } = useGetExpenseByIdQuery({ id: id, endpointName: "EditExpense" } || {}, {

    //pollingInterval: 60000,
    refetchOnFocus: true, 
    refetchOnMountOrArgChange: true, 
  });
  //console.log('hiiiiiiiiiiii')
  // useEffect(() => {
  //   if (isExpenseSuccess) {
       //console.log('helllllow',expenseToEdit, 'mystu')
  //     //const expenseInit = Object.values(expenseToEdit.entities)
  //     // setExpense(expenseToEdit); // Set expense state to the first object
  //     //console.log('helllllow',expense, 'mystu')
  //   }
  // // }, [isExpenseSuccess, expenseToEdit]);
  // let expenseTE = isExpenseSuccess
  // ? Object.values(expenseToEdit.entities)
  // : null;
  let content;

  content = expenseToEdit ? (
    <>
     
      <EditExpenseForm expense={(expenseToEdit[0])} />
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
export default EditExpense;
