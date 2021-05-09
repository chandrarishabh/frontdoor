import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {AUTHENTICATION} from './hooks/useAuth';


function ProtectedRoute({children, ...props}) {
    return (
        <Route {...props}>
            {children}
            {/* {AUTHENTICATION.token?children:<Redirect to='/login'/>} */}
        </Route>
    )
}

export default ProtectedRoute;
