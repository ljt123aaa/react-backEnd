import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button, Form, Input, message } from 'antd';
import { generateSecureToken } from '../utils/index';

export default function Login() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            form.setFieldsValue({
                username: 'admin',
                password: '123456'
            });
        }
    }, [form]);

    const onFinish = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));

            if (values.username === 'admin' && values.password === '123456') {
                login(generateSecureToken());
                message.success('登录成功');
                navigate('/', { replace: true });
            } else {
                message.error('用户名或密码错误');
            }
        } catch (error) {
            message.error('登录失败');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='w-[500px] p-10 pb-1 bg-white rounded-md shadow-md'>
                <h2 className='text-2xl font-bold text-center'>后台管理系统</h2>
                <Form
                    layout='vertical'
                    form={form}
                    autoComplete="off"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                        label="用户名"
                    >
                        <Input placeholder="用户名：admin" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入密码' }]}
                        label="密码"
                    >
                        <Input.Password placeholder="密码：123456" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
