import Avatar from '../components/Avatar';
import RouteTabs from '../components/RouteTabs';
import SiderComponent from './Sider';
import BreadCrumbComponent from './BreadCrumb';
import FullscreenComponent from './Fullscreen';
import Theme from './Theme';
// import Spin from './Spin';

import { useState, useEffect } from 'react';
import { Layout, Button, Space, theme, Skeleton } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const { Header, Content } = Layout;

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);
    const [collapsed, setCollapsed] = useState(false);
    // const [siderTheme, setSiderTheme] = useState('light');
    const siderTheme = useThemeStore((state) => state.siderTheme);
    const setSiderTheme = useThemeStore((state) => state.setSiderTheme);
    const [spinning, setSpinning] = useState(false);
    const {
        token: { colorBgContainer, colorText },
    } = theme.useToken();
    const loadingTime = 500;

    // 页面加载和路由切换时显示进度条
    useEffect(() => {
        NProgress.configure({
            showSpinner: false,
        });
        NProgress.start();
        setSpinning(true);

        // 模拟加载完成
        const timer = setTimeout(() => {
            NProgress.done();
            setSpinning(false);
        }, loadingTime);

        return () => {
            clearTimeout(timer);
        };
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <Layout className='h-full'>
                <SiderComponent siderTheme={siderTheme} collapsed={collapsed} colorText={colorText} setCollapsed={setCollapsed} />

                <Layout className='h-full'>
                    <Header className='!pr-4 !pl-2 !h-[50px] flex items-center' style={{ padding: 0, background: colorBgContainer }}>
                        <Space className='w-full justify-between'>
                            <div className='flex items-center'>
                                <Button
                                    type="text"
                                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                    onClick={() => setCollapsed(!collapsed)}
                                />
                                <div className={`${collapsed ? 'hidden' : ''}`}>
                                    <BreadCrumbComponent location={location} />
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <FullscreenComponent />
                                <Theme siderTheme={siderTheme} setSiderTheme={setSiderTheme} />
                                <div className={`text-lg font-bold mx-4 flex items-center`}>
                                    <Avatar size={40} className="mr-4" />
                                    <span>admin</span>
                                </div>
                                <Button onClick={handleLogout}>退出登录</Button>
                            </div>
                        </Space>
                    </Header>

                    <RouteTabs />

                    <Content className='h-full p-4'>
                        {spinning ? (
                            <div className="w-full">
                                <Skeleton
                                    active
                                    paragraph={{ rows: 10 }}
                                    title
                                    className="w-full"
                                />
                            </div>
                        ) : (
                            <Outlet />
                        )}
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}
