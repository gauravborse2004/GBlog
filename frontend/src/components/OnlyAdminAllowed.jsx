import { RouteIndex, RouteSignIn } from '@/helpers/RouteName'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const OnlyAdminAllowed = () => {
    const user = useSelector((state) => state.auth.authUser);
    if (user && user?.user?.id && user.user.role === 'admin') {
        return (
            <Outlet />
        )
    } else {
        return <Navigate to={RouteSignIn} />
    }

}

export default OnlyAdminAllowed