import React from 'react';
import { Students } from '../lib/Consts/Students';
import DataTable from 'react-data-table-component';
// import { Link } from 'react-router-dom';
// import {useEffect, useState} from 'react';

const StudentsTableList = () => {

  const column =[
    	{ 
		name: "ID",
		selector:row=>row.ID,
		sortable:true
		 }, 
    	{ 
		name: "First Name",
		selector:row=>row.studentName.firstName+" " +row.studentName.middleName,
		sortable:true
		 }, 
    	{ 
		name: "Last Name",
		selector:row=>row.studentName.lastName,
		sortable:true
		 }, 
		{name: "DOB",
			selector:row=>row.studentDob.$date.$numberLong,
			sortable:true
		}, 
		{name: "Father",
			selector:row=>row.studentParent.studentFather.$oid,
			sortable:true
		}, 
		{name: "Mother",
			selector:row=>row.studentParent.studentMother.$oid,
			sortable:true
		}, 
		{name: "Sex",
			selector:row=>row.studentSex,
			sortable:true,
			removableRows:true
		}
  ]
//fetching the data
 
	// const [records, setRecords] = useState([]);
	// const ()=>{setRecords=Students};
//setting the filter
	// const handleFilter=(event)=>{
	// 	const newData =Students.filter(row=>row.name.toLowerCase().includes(event.target.value.toLowerCase()));
	// 	setRecords=newData;
	// }
  return (
    <div className=' flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200' >
       {/* <div>
			<input type="text" placeholder="search" onChange={handleFilter}/>
		 </div> */}
		 
		 <DataTable
			columns={column}
			data={Students}
			pagination
			selectableRows
			removableRows
			pageSizeControl>
		 </DataTable>

    </div>
  )
}

export default StudentsTableList;

