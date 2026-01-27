import { useState, useRef, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { SiderTheme } from 'antd/es/layout/Sider';
import type { MenuProps } from 'antd';
import { routesConfig, type RouteConfig } from '../routes';
const { Sider } = Layout;

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

export default function SiderComponent({ siderTheme, collapsed, colorText, setCollapsed }: { siderTheme: string, collapsed: boolean, colorText: string, setCollapsed: (collapsed: boolean) => void }) {

    const navigate = useNavigate();

    const [openKeys, setOpenKeys] = useState<string[]>([]);

    // 使用 useRef 实现真正的一次性计算
    const menuItemsRef = useRef<MenuProps['items'] | null>(null);
    const mainRoutesRef = useRef<RouteConfig[] | null>(null);

    // 首次渲染时计算并缓存
    if (!mainRoutesRef.current) {
        mainRoutesRef.current = routesConfig.find(route => route.path === '/')?.children || [];
    }

    if (!menuItemsRef.current) {
        // console.log('Generating menu items (ONLY ONCE after login)');
        menuItemsRef.current = getMenuItems(mainRoutesRef.current, navigate);
    }

    // 获取缓存的结果
    const menuItems = menuItemsRef.current;

    // 根据当前路径确定选中的菜单项
    const selectedKeys = [location.pathname];

    // 当路径变化时，更新展开的菜单
    useEffect(() => {
        const newOpenKeys = calculateOpenKeys(location.pathname);
        setOpenKeys(newOpenKeys);
    }, [location.pathname]);

    return (
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
    );
}
