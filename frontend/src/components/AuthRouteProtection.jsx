import {  RouteSignIn } from '@/helpers/RouteName'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AuthRouteProtechtion = () => {
     const user = useSelector((state) => state.auth.authUser);
    if (user && user?.user?.id) {
        return (
            <Outlet />
        )
    } else {
        return <Navigate to={RouteSignIn} />
    }

}

export default AuthRouteProtechtion