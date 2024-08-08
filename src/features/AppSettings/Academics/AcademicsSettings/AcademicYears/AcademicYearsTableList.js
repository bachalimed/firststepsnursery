// import React from 'react'
// import { AcademicYears } from '../../Components/lib/Consts/AcademicYears'
// import DataTable from 'react-data-table-component'
// // import { Link } from 'react-router-dom';
// // import {useEffect, useState} from 'react';

// const AcademicYearsTableList = () => {

//   const column =[
//     	{ 
// 		name: "ID",
// 		selector:row=>row.ID,
// 		sortable:true
// 		 }, 
//     	{ 
// 		name: "First Name",
// 		selector:row=>row.academicYearName.firstName+" " +row.academicYearName.middleName,
// 		sortable:true
// 		 }, 
//     	{ 
// 		name: "Last Name",
// 		selector:row=>row.academicYearName.lastName,
// 		sortable:true
// 		 }, 
// 		{name: "DOB",
// 			selector:row=>row.academicYearDob.$date.$numberLong,
// 			sortable:true
// 		}, 
// 		{name: "Father",
// 			selector:row=>row.academicYearParent.academicYearFather.$oid,
// 			sortable:true
// 		}, 
// 		{name: "Mother",
// 			selector:row=>row.academicYearParent.academicYearMother.$oid,
// 			sortable:true
// 		}, 
// 		{name: "Sex",
// 			selector:row=>row.academicYearSex,
// 			sortable:true,
// 			removableRows:true
// 		}
//   ]
// //fetching the data
 
// 	// const [records, setRecords] = useState([]);
// 	// const ()=>{setRecords=AcademicYears};
// //setting the filter
// 	// const handleFilter=(event)=>{
// 	// 	const newData =AcademicYears.filter(row=>row.name.toLowerCase().includes(event.target.value.toLowerCase()));
// 	// 	setRecords=newData;
// 	// }
//   return (
//     <div className=' flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200' >
//        {/* <div>
// 			<input type="text" placeholder="search" onChange={handleFilter}/>
// 		 </div> */}
		 
// 		 <DataTable
// 			columns={column}
// 			data={AcademicYears}
// 			pagination
// 			selectableRows
// 			removableRows
// 			pageSizeControl>
// 		 </DataTable>

//     </div>
//   )
// }

// export default AcademicYearsTableList;