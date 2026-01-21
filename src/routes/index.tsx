import React from "react";
import { Navigate, useRoutes, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Home from "../views/home";
import MainLayout from "../Layout/MainLayout";
import Login from "../views/Login";
import User from "../views/user/index";
import { HomeOutlined, UserOutlined, UnorderedListOutlined, ScissorOutlined, StrikethroughOutlined } from '@ant-design/icons';
import NotFound from "../views/404";
import AgentManagement from "../views/agent/index";
import AgentLogs from "../views/agent/log";

// 定义路由元数据类型
export interface RouteMeta {
    label: string;
    icon?: React.ReactNode;
    hidden?: boolean;
}

// 定义路由配置类型
export interface RouteConfig {
    path: string;
    element: React.ReactNode;
    meta?: RouteMeta;
    children?: RouteConfig[];
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = useAuthStore((state) => state.token);
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// 导出路由配置
export const routesConfig: RouteConfig[] = [
    {
        path: '/login',
        element: <Login />,
        meta: { label: '登录', hidden: true },
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: '/', // 根路径默认渲染首页
                element: <Home />,
                meta: { label: '首页', icon: <HomeOutlined /> },
            },
            {
                path: '/user',
                element: <User />,
                meta: { label: '用户管理', icon: <UserOutlined /> },
            },
            // 添加代理管理嵌套路由（修正默认子路由）
            {
                path: '/agent',
                element: <Outlet />, // 父路由通过Outlet渲染子路由
                meta: {
                    label: '代理管理',
                    icon: <UnorderedListOutlined />
                },
                children: [
                    // 修正：默认子路由用空字符串，访问/agent时默认渲染AgentManagement
                    {
                        path: 'index', // 空路径 = 默认子路由
                        element: <AgentManagement />,
                        meta: { label: '代理中心', icon: <ScissorOutlined /> },
                    },
                    // 代理日志子页面，完整路径 /agent/logs
                    {
                        path: 'logs',
                        element: <AgentLogs />,
                        meta: {
                            label: '代理日志',
                            icon: <StrikethroughOutlined />
                        },
                    },
                ],
            },
            // 移除：把/404从鉴权路由的children中移出，避免未登录时访问404被拦截
        ],
    },
    // 新增：单独配置404路由，不包裹鉴权，所有用户都能访问
    {
        path: '/404',
        element: <NotFound />,
        meta: { label: '404', hidden: true },
    },
];

export default function Routes() {
    // 使用useRoutes创建路由树
    const routes = useRoutes([
        ...routesConfig,
        // 所有未匹配的路径，重定向到/404（此时/404已单独配置，无需鉴权）
        {
            path: '*',
            element: <Navigate to="/404" replace />
        },
    ]);

    return routes;
}