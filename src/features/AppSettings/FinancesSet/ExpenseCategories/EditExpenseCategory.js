import { useParams } from "react-router-dom"; //because we will get the userId from the url
import {
  useGetExpenseCategoryByIdQuery,
} from "./expenseCategoriesApiSlice"; //we will pull the user  data from the state and not use query
import EditExpenseCategoryForm from "./EditExpenseCategoryForm";
import LoadingStateIcon from "react-loading-icons";
import { useEffect } from "react";
const EditExpenseCategory = () => {
  useEffect(()=>{document.title="Edit Expense Category"})

  const { id } = useParams(); //pull the id from use params from the url
  //will get hte student from the state
  //const expenseCategoryToEdit = useSelector((state) => state.expenseCategory?.entities[id]);
 // console.log("helllllow expenseCategoryToEdit", "mystu", id);
  //console.log(id, "id");
  const {
    data: expenseCategory, //the data is renamed expenseCategories
    // isLoading: isExpenseCategoryLoading, 
    isSuccess: isExpenseCategoriesuccess,
    // isError: isExpenseCategoryError,
    // error: expenseCategoryError,
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
  //       <LoadingStateIcon />
  //     </>
    
  // }

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditExpenseCategory;
