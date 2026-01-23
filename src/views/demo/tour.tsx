import React, { useRef, useState } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Divider, Space, Tour } from 'antd';
import type { TourProps } from 'antd';

const App: React.FC = () => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);

    const [open, setOpen] = useState<boolean>(false);
    const steps: TourProps['steps'] = [
        {
            title: '上传文件',
            description: '将文件拖放到此处上传。',
            cover: (
                <img
                    draggable={false}
                    alt="tour.png"
                    src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
                />
            ),
            target: () => ref1.current,
        },
        {
            title: '保存',
            description: '保存您的更改。',
            target: () => ref2.current,
        },
        {
            title: '更多操作',
            description: '点击查看其他操作。',
            target: () => ref3.current,
        },
    ];
    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)}>
                开始漫游引导
            </Button>
            <Divider />
            <Space>
                <Button ref={ref1}>上传文件</Button>
                <Button ref={ref2} type="primary">
                    保存
                </Button>
                <Button ref={ref3} icon={<EllipsisOutlined />}>
                    更多操作
                </Button>
            </Space>
            <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
        </>
    );
};

export default App;