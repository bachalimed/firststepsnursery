// export const calculateSalary = (year, month, arrayOfDates, basicSalary) => {
//   // Helper function to check if a day is a working day (Monday to Saturday)
//   const isWorkingDay = (date) => {
//     const day = date.getDay();
//     return day !== 0; // Exclude Sundays (0)
//   };

//   // Get the first and last day of the month
//   const startDate = new Date(year, month, 1);
//   const endDate = new Date(year, month + 1, 0); // Last day of the month

//   // Count total working days in the month
//   let totalWorkingDays = 0;
//   for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
//     if (isWorkingDay(d)) {
//       totalWorkingDays++;
//     }
//   }

//   // Ensure `arrayOfDates` contains Date objects
//   const validDates = arrayOfDates.map((date) =>
//     date instanceof Date ? date : new Date(date)
//   );

//   // Count how many of the dates in the array are working days
//   const workingDaysInArray = validDates.reduce(
//     (count, date) => (isWorkingDay(date) ? count + 1 : count),
//     0
//   );

//   // Calculate the remaining working days in the month
//   const remainingWorkingDays = totalWorkingDays - workingDaysInArray;

//   // Calculate the salary (remaining working days * basic salary / total working days)
//   const salary =
//     totalWorkingDays > 0
//       ? (remainingWorkingDays / totalWorkingDays) * basicSalary
//       : 0;

//   // Return the necessary data
//   return {
//     totalWorkingDays,
//     workingDaysInArray,
//     remainingWorkingDays,
//     salary,
//   };
// };
