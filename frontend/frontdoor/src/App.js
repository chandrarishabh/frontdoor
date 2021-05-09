import React from 'react';
import { Redirect, Route } from 'react-router-dom'
import Login from './pages/login/Login';
import ProtectedRoute from './ProtectedRoute';
import Home from './pages/home/Home';

function App() {
     
    return (
        <>
            <Route path="/login">
                <Login/>
            </Route>
            <ProtectedRoute path="/home">
                <Home/>
            </ProtectedRoute>

        </>
    )
}

export default App
