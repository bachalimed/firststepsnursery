// Helper function to calculate the required salary
export const  calculateSalary = (year, month, arrayOfDates, basicSalary) =>{

    console.log(year, month, arrayOfDates, basicSalary,'year, month, arrayOfDates, basicSalary')
    // Helper function to check if a day is a working day (Monday to Saturday)
    function isWorkingDay(date) {
      const day = date.getDay();
      return day !== 0; // 0 represents Sunday, so we return false if it's Sunday
    }
  
    // Get the first and last day of the month
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Last day of the month
  
    // Count total working days in the month
    let totalWorkingDays = 0;
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      if (isWorkingDay(d)) {
        totalWorkingDays++;
      }
    }
  
    // Count how many of the dates in the array are working days
    let workingDaysInArray = 0;
    arrayOfDates.forEach((date) => {
      if (isWorkingDay(date)) {
        workingDaysInArray++;
      }
    });
  
    // Calculate the remaining working days in the month
    const remainingWorkingDays = totalWorkingDays - workingDaysInArray;
  
    // Calculate the salary (remaining working days * basic salary / total working days)
    const salary = (remainingWorkingDays / totalWorkingDays) * basicSalary;
  
    // Return the necessary data
    return {
      totalWorkingDays,
      workingDaysInArray,
      remainingWorkingDays,
      salary
    };
  }
  
  