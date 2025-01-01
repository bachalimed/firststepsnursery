import { useSelector } from "react-redux";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../features/AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetPaymentsStatsByYearQuery } from "../features/Finances/Payments/paymentsApiSlice"
import { useGetInvoicesStatsByYearQuery } from "../features/Finances/Invoices/invoicesApiSlice"
import { useGetExpensesStatsByYearQuery } from "../features/Finances/Expenses/expensesApiSlice"

export const useFinancesStats = () => {
  // Selected academic year
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object

  // Query the finances stats for the selected academic year
  const {
    data: payments, //the data is renamed finances
    // isLoading: isPaymentsLoading,
    isSuccess: isPaymentsSuccess,
    // isError: isPaymentsError,
    // error: paymentsError,
  } = useGetPaymentsStatsByYearQuery(
    {
      criteria: "DashFinancesTotalPaymentsStats",
      selectedYear: selectedAcademicYear?.title,
      endpointName: "useFinancesStats",
    },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const {
    data: invoices, //the data is renamed finances
    // isLoading: isInvoicesLoading,
    isSuccess: isInvoicesSuccess,
    // isError: isInvoicesError,
    // error: invoicesError,
  } = useGetInvoicesStatsByYearQuery(
    {
      criteria: "invoicesTotalStats",
      selectedYear: selectedAcademicYear?.title,
      endpointName: "useFinancesStats",
    },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const {
    data: expenses, //the data is renamed finances
    // isLoading: isExpensesLoading,
    isSuccess: isExpensesSuccess,
    // isError: isExpensesError,
    // error: expensesError,
  } = useGetExpensesStatsByYearQuery(
    {
      criteria: "expensesTotalStats",
      selectedYear: selectedAcademicYear?.title,
      endpointName: "useFinancesStats",
    },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  
  // Return the stats or an empty object if not successful
  const paymentsStats = isPaymentsSuccess ? payments : {};
   const invoicesStats = isInvoicesSuccess ? invoices : {};
   const expensesStats = isExpensesSuccess ? expenses: {};

  return {
    expensesStats,
    invoicesStats,
    paymentsStats,
    selectedAcademicYear,
    
  };
};
