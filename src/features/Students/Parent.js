import React from 'react';
import { Parents } from '../../Components/lib/Consts/Parents';
import DataTable from 'react-data-table-component';
// import { Link } from 'react-router-dom';
// import {useEffect, useState} from 'react';

const ParentsList = () => {

  const column =[
    	{ 
		name: "ID",
		selector:row=>row.ID,
		sortable:true
		 }, 
    	{ 
		name: "First Name",
		selector:row=>row.parentName.firstName+" " +row.parentName.middleName,
		sortable:true
		 }, 
    	{ 
		name: "Last Name",
		selector:row=>row.parentName.lastName,
		sortable:true
		 }, 
		{name: "DOB",
			selector:row=>row.parentDob.$date.$numberLong,
			sortable:true
		}, 
		{name: "Father",
			selector:row=>row.parentParent.parentFather.$oid,
			sortable:true
		}, 
		{name: "Mother",
			selector:row=>row.parentParent.parentMother.$oid,
			sortable:true
		}, 
		{name: "Sex",
			selector:row=>row.parentSex,
			sortable:true,
			removableRows:true
		}
  ]
//fetching the data
 
	// const [records, setRecords] = useState([]);
	// const ()=>{setRecords=Parents};
//setting the filter
	// const handleFilter=(event)=>{
	// 	const newData =Parents.filter(row=>row.name.toLowerCase().includes(event.target.value.toLowerCase()));
	// 	setRecords=newData;
	// }
  return (
    <div className=' flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200' >
       {/* <div>
			<input type="text" placeholder="search" onChange={handleFilter}/>
		 </div> */}
		 
		 <DataTable
			columns={column}
			data={Parents}
			pagination
			selectableRows
			removableRows
			pageSizeControl>
		 </DataTable>

    </div>
  )
}

export default ParentsList;

