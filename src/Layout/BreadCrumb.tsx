import { useMemo } from 'react';
import { routesConfig, type RouteConfig } from '../routes';
import { Breadcrumb } from 'antd';
import type { Location } from 'react-router-dom';

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

export default function BreadCrumb({ location }: { location: Location }) {
    // 面包屑生成优化 - 路径变化时才重新计算
    const breadcrumbItems = useMemo(() => {
        return getBreadcrumbItems(location.pathname, routesConfig);
    }, [location.pathname]);

    return (
        <Breadcrumb
            className='ml-4'
            items={breadcrumbItems.map((item, index) => ({
                title: (
                    <span
                    // onClick={() => index !== breadcrumbItems.length - 1 && navigate(item.path)}
                    // className={index === breadcrumbItems.length - 1 ? 'cursor-default' : 'cursor-pointer'}
                    >
                        {item.label}
                    </span>
                ),
                key: item.path
            }))}
        />
    )
}
