import { useState } from 'react';
import { Button } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';

export default function Fullscreen() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleFullscreen = () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    }

    return (
        <Button type="text" size="large" onClick={handleFullscreen}>
            {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </Button>
    );
}