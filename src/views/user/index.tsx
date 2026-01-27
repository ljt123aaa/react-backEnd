import { memo } from 'react';

const User = memo(() => {
    console.log('用户管理');

    return (
        <div>用户管理（待开发）</div>
    );
});

export default User;