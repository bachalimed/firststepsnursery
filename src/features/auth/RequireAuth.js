//needed to protect routes so even if the user does not see the links, he can type the url and caanot access it, we3 will wrap this around protected routes we need to protect
import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation()
    const { userRoles } = useAuth()

    const content = (
        userRoles.some(role => allowedRoles.includes(role))//if it is true at least once, it will return true
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />//this will send the user back to the previous page and not to login if he clicks backspace
    )

    return content
}
export default RequireAuth