import { Button } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useState } from 'react';

export default function Theme({ siderTheme, setSiderTheme }: { siderTheme: string, setSiderTheme: (theme: string) => void }) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleThemeChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isAnimating) return;

        setIsAnimating(true);

        // 获取鼠标坐标
        const { clientX, clientY } = e;
        
        // 计算最大半径
        const radius = Math.hypot(
            Math.max(clientX, window.innerWidth - clientX),
            Math.max(clientY, window.innerHeight - clientY),
        );

        // 设置 CSS 变量
        const htmlEl = document.documentElement;
        htmlEl.style.setProperty('--x', `${clientX}px`);
        htmlEl.style.setProperty('--y', `${clientY}px`);
        htmlEl.style.setProperty('--r', `${radius}px`);

        // 切换主题
        const changeTheme = () => {
            setSiderTheme(siderTheme === 'light' ? 'dark' : 'light');
        };

        // 使用 View Transition API
        if ('startViewTransition' in document) {
            document.startViewTransition(() => {
                changeTheme();
            });
        } else {
            changeTheme();
        }

        // 动画结束后重置状态
        setTimeout(() => {
            setIsAnimating(false);
        }, 500);
    };

    return (
        <Button 
            type="text" 
            size="large" 
            onClick={handleThemeChange}
            disabled={isAnimating}
        >
            {siderTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
        </Button>
    )
}