import { useState } from 'react';
import { Layout, Menu, Button, Space, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SunOutlined,
    MoonOutlined,
} from '@ant-design/icons';
import type { SiderTheme } from 'antd/es/layout/Sider';

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const [collapsed, setCollapsed] = useState(false);
    // const [siderTheme, setSiderTheme] = useState('light');
    const siderTheme = useThemeStore((state) => state.siderTheme);
    const setSiderTheme = useThemeStore((state) => state.setSiderTheme);
    const {
        token: { colorBgContainer, colorText },
    } = theme.useToken();    

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Layout className='h-full'>
            <Sider className='h-full' theme={siderTheme as SiderTheme} trigger={null} collapsible collapsed={collapsed}>
                <div className={`flex justify-center items-center border-r-[1px] border-[#e8e8e8] py-4 text-xl font-bold ${collapsed ? 'hidden' : ''} text-[${colorText}]`}>金涛管理系统</div>
                <Menu className='flex-1' theme={siderTheme as SiderTheme} mode="inline" defaultSelectedKeys={['1']} items={[
                    {
                        label: '首页',
                        key: '1',
                        onClick: () => navigate('/'),
                    },
                    {
                        label: '用户管理',
                        key: '2',
                        onClick: () => navigate('/user'),
                    },
                ]} />
            </Sider>
            <Layout className='h-full'>
                <Header className='!pr-4 !pl-2' style={{ padding: 0, background: colorBgContainer }}>
                    <Space className='w-full justify-between'>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                        />
                        <div>
                            <Button type="text" icon={siderTheme === 'light' ? <MoonOutlined /> : <SunOutlined />} onClick={() => setSiderTheme(siderTheme === 'light' ? 'dark' : 'light')} />
                            <span className={`text-lg font-bold text-[${colorText}] mr-4`}>admin</span>
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
