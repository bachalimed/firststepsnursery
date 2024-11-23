import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import {
  selectExpenseCategoryById,
  useGetExpenseCategoryByIdQuery,
} from "./expenseCategoriesApiSlice"; //we will pull the user  data from the state and not use query
import EditExpenseCategoryForm from "./EditExpenseCategoryForm";
import useAuth from "../../../../hooks/useAuth";

import FinancesSet from "../../FinancesSet";
import LoadingStateIcons from "react-loading-icons";
const EditExpenseCategory = () => {
  const { id } = useParams(); //pull the id from use params from the url
  //will get hte student from the state
  //const expenseCategoryToEdit = useSelector((state) => state.expenseCategory?.entities[id]);
 // console.log("helllllow expenseCategoryToEdit", "mystu", id);
  //console.log(id, "id");
  const {
    data: expenseCategory, //the data is renamed expenseCategories
    isLoading: isExpenseCategoryLoading, //monitor several situations is loading...
    isSuccess: isExpenseCategoriesuccess,
    isError: isExpenseCategoryError,
    error: expenseCategoryError,
  } = useGetExpenseCategoryByIdQuery(
    {
      id: id,
      endpointName: "EditExpenseCategory",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  let expenseCategoryToEdit;
  if (isExpenseCategoriesuccess) {
    //console.log(expenseCategory, "expenseCategory");
    expenseCategoryToEdit = expenseCategory[0];
  }

  //console.log(expenseCategoryToEdit, "expenseCategoryToedit");

  let content;
  if (isExpenseCategoriesuccess) {
    content = 
      <>
        <EditExpenseCategoryForm expenseCategory={expenseCategoryToEdit} />
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
export default EditExpenseCategory;
