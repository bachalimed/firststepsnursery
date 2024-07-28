import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import {jwtDecode} from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isEmployee= false
    let isParent= false
    let isContentManager= false
    let isAnimator= false
    let isAcademic= false
    let isFinance= false
    let isHR= false
    let isDesk= false
    let isDirector= false
    let isManager= false
    let isAdmin= false
    
    let status1 = ""
    let status2 = ""

    if (token) {
        const decoded = jwtDecode(token)
        const { username, userRoles } = decoded.UserInfo//coming from the backend in the token.userInfo

       
        isEmployee= userRoles.includes('Employee')
        isParent= userRoles.includes('Parent')
        isContentManager= userRoles.includes('ContentManager')
        isAnimator= userRoles.includes('Animator')
        isAcademic= userRoles.includes('Academic')
        isFinance= userRoles.includes('Finance')
        isHR= userRoles.includes('HR')
        isDesk= userRoles.includes('Desk')
        isDirector= userRoles.includes('Director')
        isManager = userRoles.includes('Manager')
        isAdmin = userRoles.includes('Admin')

     //will get the higher status as it is executed in order
        if (isParent) status1 = "Parent"
        if (isEmployee) status2 = "Employee"
        if (isDesk) status2 = "Desk"
        if (isAnimator) status2 = "Animator"
        if (isContentManager) status2 = "ContentManager"
        if (isAcademic) status2 = "Academic"
        if (isFinance) status2 = "Finance"
        if (isHR) status2 = "HR"
        if (isManager) status2 = "Manager"
        if (isDirector) status2 = "Director"
        if (isAdmin) status2 = "Admin"

        return { username, userRoles, status1, status2, isEmployee, isManager, isParent, isContentManager, isAnimator, isAcademic, isFinance, isHR, isDesk, isDirector,  isAdmin }
    }

    return { username: '', userRoles: [], isEmployee, isManager, isParent, isContentManager, isAnimator, isAcademic, isFinance, isHR, isDesk, isDirector,  isAdmin, status1, status2 }
}
export default useAuth