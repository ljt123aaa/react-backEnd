import { useState, useEffect, useMemo, useRef } from 'react';
import { Layout, Menu, Button, Space, theme, Breadcrumb } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import Avatar from '../components/Avatar';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SunOutlined,
    MoonOutlined,
} from '@ant-design/icons';
import type { SiderTheme } from 'antd/es/layout/Sider';
import type { MenuProps } from 'antd';
import { routesConfig, type RouteConfig } from '../routes';

// 模块级缓存 - 登录后只计算一次
// let cachedMenuItems: MenuProps['items'] | null = null;
// let cachedMainRoutes: RouteConfig[] | null = null;

// 将路由配置转换为菜单配置
const getMenuItems = (routes: RouteConfig[], navigate: any, parentPath = ''): MenuProps['items'] => {
    let items: MenuProps['items'] = [];
    
    routes.forEach(route => {
        // 跳过没有meta.label或hidden为true的路由
        if (!route.meta?.label || route.meta.hidden) return;

        // 正确拼接路径，避免出现 '//home' 这样的问题
        let path = '';
        if (parentPath === '' || parentPath === '/') {
            // 顶级路由
            path = route.path;
        } else if (route.path === '') {
            // 处理空路径（默认子路由）
            path = parentPath;
        } else {
            // 子路由，使用相对路径
            path = `${parentPath}/${route.path}`;
        }

        // 确保路径格式正确（去掉重复的斜杠）
        path = path.replace(/\/+/g, '/');

        // 调试：打印处理的路由信息
        // console.log(`Processing route: ${route.path}, parent: ${parentPath}, final: ${path}`);

        // 创建菜单项
        const menuItem: any = {
            key: path,
            label: route.meta.label,
            icon: route.meta.icon,
        };

        // 递归处理子路由
        if (route.children && route.children.length > 0) {
            // 有子路由的菜单，不要设置onClick，使用默认的展开/折叠行为
            menuItem.children = getMenuItems(route.children, navigate, path);
        } else {
            // 没有子路由的菜单，设置onClick导航
            menuItem.onClick = () => {
                // console.log('Menu item clicked:', route.meta?.label, 'Path:', path);
                navigate(path);
            };
        }

        items.push(menuItem);
    });

    return items;
};

// 生成面包屑项
const getBreadcrumbItems = (pathname: string, routes: RouteConfig[]): { path: string; label: string }[] => {
    const items: { path: string; label: string }[] = [];

    // 查找根路由下的所有子路由
    const rootRoute = routes.find(route => route.path === '/');
    const mainRoutes = rootRoute?.children || [];

    // 递归查找当前路径的完整层级
    const findRouteHierarchy = (currentRoutes: RouteConfig[], currentPath: string, parentPath = ''): { path: string; label: string }[] => {
        const hierarchy: { path: string; label: string }[] = [];
        
        for (const route of currentRoutes) {
            // 构建完整路径
            let fullPath = '';
            if (parentPath === '/' && route.path.startsWith('/')) {
                fullPath = route.path;
            } else if (route.path === '') {
                fullPath = parentPath;
            } else {
                fullPath = parentPath + (route.path.startsWith('/') ? '' : '/') + route.path;
            }
            fullPath = fullPath.replace(/\/+/g, '/');

            // 如果找到匹配的路径
            if (fullPath === currentPath) {
                // 如果有meta.label且不隐藏，添加到层级中
                if (route.meta?.label && !route.meta.hidden) {
                    hierarchy.unshift({ path: fullPath, label: route.meta.label });
                }
                return hierarchy;
            }

            // 如果有子路由，递归查找
            if (route.children && route.children.length > 0) {
                const childHierarchy = findRouteHierarchy(route.children, currentPath, fullPath);
                if (childHierarchy.length > 0) {
                    // 如果当前路由有meta.label且不隐藏，添加到层级中
                    if (route.meta?.label && !route.meta.hidden) {
                        hierarchy.push({ path: fullPath, label: route.meta.label });
                    }
                    hierarchy.push(...childHierarchy);
                    return hierarchy;
                }
            }
        }

        return hierarchy;
    };

    // 查找并添加完整的面包屑层级
    const routeHierarchy = findRouteHierarchy(mainRoutes, pathname, '/');
    items.push(...routeHierarchy);

    return items;
};

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);
    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    // const [siderTheme, setSiderTheme] = useState('light');
    const siderTheme = useThemeStore((state) => state.siderTheme);
    const setSiderTheme = useThemeStore((state) => state.setSiderTheme);
    const {
        token: { colorBgContainer, colorText },
    } = theme.useToken();

    // 使用 useRef 实现真正的一次性计算
    const menuItemsRef = useRef<MenuProps['items'] | null>(null);
    const mainRoutesRef = useRef<RouteConfig[] | null>(null);

    // 首次渲染时计算并缓存
    if (!mainRoutesRef.current) {
        mainRoutesRef.current = routesConfig.find(route => route.path === '/')?.children || [];
    }

    if (!menuItemsRef.current) {
        console.log('Generating menu items (ONLY ONCE after login)');
        menuItemsRef.current = getMenuItems(mainRoutesRef.current, navigate);
    }

    // 获取缓存的结果
    const menuItems = menuItemsRef.current;

    // 面包屑生成优化 - 路径变化时才重新计算
    const breadcrumbItems = useMemo(() => {
        console.log('Generating breadcrumb items for:', location.pathname);
        return getBreadcrumbItems(location.pathname, routesConfig);
    }, [location.pathname]);    

    // 根据当前路径确定选中的菜单项
    const selectedKeys = [location.pathname];

    // 计算需要展开的菜单键
    const calculateOpenKeys = (pathname: string): string[] => {
        const keys: string[] = [];
        const pathSegments = pathname.split('/').filter(Boolean);

        // 从根路径开始，逐步构建父路径
        let currentPath = '';
        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            // 只添加有子路由的父路径
            if (index < pathSegments.length - 1) {
                keys.push(currentPath);
            }
        });

        return keys;
    };

    // 当路径变化时，更新展开的菜单
    useEffect(() => {
        const newOpenKeys = calculateOpenKeys(location.pathname);
        setOpenKeys(newOpenKeys);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Layout className='h-full'>
            <Sider breakpoint="md" onBreakpoint={(broken) => {
                setCollapsed(broken);
            }} theme={siderTheme as SiderTheme} trigger={null} collapsible collapsed={collapsed}>
                <div className={`flex justify-center items-center py-4 text-xl font-bold ${collapsed ? 'hidden' : ''} border-r border-r-solid ${siderTheme === 'light' ? 'border-r-[#e8e8e8]' : 'border-r-[transparent]'}`} style={{ color: colorText }}>金涛管理系统</div>
                <Menu
                    theme={siderTheme as SiderTheme}
                    mode="inline"
                    selectedKeys={selectedKeys}
                    openKeys={openKeys}
                    onOpenChange={(keys) => setOpenKeys(keys)}
                    items={menuItems}
                />
            </Sider>
            <Layout className='h-full'>
                <Header className='!pr-4 !pl-2' style={{ padding: 0, background: colorBgContainer }}>
                    <Space className='w-full justify-between'>
                        <div className='flex items-center'>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                            />
                            <Breadcrumb
                                className='ml-4'
                                items={breadcrumbItems.map((item, index) => ({
                                    title: (
                                        <span
                                            onClick={() => index !== breadcrumbItems.length - 1 && navigate(item.path)}
                                            className={index === breadcrumbItems.length - 1 ? 'cursor-default' : 'cursor-pointer'}
                                        >
                                            {item.label}
                                        </span>
                                    ),
                                    key: item.path
                                }))}
                            />
                        </div>
                        <div className='flex items-center'>
                            <Button type="text" size='large' icon={siderTheme === 'light' ? <MoonOutlined /> : <SunOutlined />} onClick={() => setSiderTheme(siderTheme === 'light' ? 'dark' : 'light')} />
                            <div className={`text-lg font-bold mx-4 flex items-center`}>
                                <Avatar size={55} className="mr-4" />
                                <span>admin</span>
                            </div>
                            <Button onClick={handleLogout}>退出登录</Button>
                        </div>
                    </Space>
                </Header>
                <Content className='h-full p-4'>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
