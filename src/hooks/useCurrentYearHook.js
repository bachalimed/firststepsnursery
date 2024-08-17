const getCurrentAcademicYear = () => {
    const today = new Date() // Get today's date
    const currentYear = today.getUTCFullYear() // Get the current year
  
    // Define the academic year start and end dates
    const startDate = new Date(Date.UTC(currentYear, 8, 1, 0, 0, 0)) // 1st September of the current year
    const endDate = new Date(Date.UTC(currentYear + 1, 7, 31, 23, 59, 59, 999)) // 31st August of the next year
  
    // Determine the academic year based on the current date
    let academicYear
    if (today >= startDate && today <= endDate) {
      academicYear = `${currentYear}/${currentYear + 1}`
    } else {
      academicYear = `${currentYear - 1}/${currentYear}`
    }
    return academicYear
  }
  export default getCurrentAcademicYear()