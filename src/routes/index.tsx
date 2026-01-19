import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Home from "../views/home";
import MainLayout from "../Layout/MainLayout";
import Login from "../views/Login";
import User from "../views/user/index";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = useAuthStore((state) => state.token);
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default function Routes() {
    const routes = useRoutes([
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/',
            element: (
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
            ),
            children: [
                { index: true, element: <Navigate to="/home" /> },
                { path: '/home', element: <Home /> },
                { path: '/user', element: <User /> },
            ],
        },
        {
            path: '*',
            element: <Navigate to="/home" />
        }
    ]);

    return routes;
}