// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
// import { useNavigate } from 'react-router-dom'

// import { useSelector } from 'react-redux'//help get the ids
// import { selectUserById } from './usersApiSlice'//use the memoized selector

// const User = ({ userId }) => {//userId is used in UsersList from the get query
//     const user = useSelector(state => selectUserById(state, userId))
//     const navigate = useNavigate()

//     if (user) {//if user exists we get all the data 
//         const handleEdit = () => navigate(`/admin/usersManagement/${userId}`)//the path to be set in app.js and to be checked with server.js in backend, this is editing page of user
 
//         const userRolesString = user.userRoles.toString().replaceAll(',', ', ')//replace the commas with space commas in the roles array

//        const cellStatus = user.userIsActive ? '' : 'table__cell--inactive'//to set active class or not on  user, 
//          const userDob = new Date(user.userDob).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })

//         return (
            
//             <tr className="table__row user">
//                 <td className={`table__cell ${cellStatus}`}>{user.username}</td>{/**setting table cell status to active or not based on the user status */}
//                 <td className={`table__cell ${cellStatus}`}>{user.userFullName.userFirstName+" "+user.userFullName.userMiddleName+" "+user.userFullName.userLastName}</td>
//                 <td className={`table__cell ${cellStatus}`}>{userDob}</td>
//                 <td className={`table__cell ${cellStatus}`}>{user.isEmployee}</td>
//                 <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
//                 <td className={`table__cell ${cellStatus}`}>{user.isParent}</td>
                
//                 <td className={`table__cell ${cellStatus}`}>
//                     <button
//                         className=""
//                         onClick={handleEdit}//we call handle edit if the button is clicked
//                     >
//                         <FontAwesomeIcon icon={faPenToSquare} />
//                     </button>
//                 </td>
//             </tr>
           
//         )

//     } else return null//if we do not have a user
// }
// export default User