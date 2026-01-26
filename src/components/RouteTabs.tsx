import { useState, useEffect } from 'react';
import { Tabs, Button, Tooltip, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { routesConfig } from '../routes';
import type { RouteConfig } from '../routes';

interface TabItem {
  key: string;
  label: string;
  path: string;
}

// 获取当前路径的标签名
const getLabelByPath = (path: string): string => {
  // 递归查找路由配置中的标签名，支持嵌套路由
  const findRouteLabel = (routes: RouteConfig[], targetPath: string, currentPath: string = ''): string | undefined => {
    for (const route of routes) {
      // 计算完整路径
      let fullPath: string;
      if (currentPath === '') {
        fullPath = route.path;
      } else if (route.path.startsWith('/')) {
        // 如果子路由路径是绝对路径，直接使用
        fullPath = route.path;
      } else {
        // 如果子路由路径是相对路径，拼接父路径
        fullPath = `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${route.path}`;
      }
      
      // 标准化路径，移除多余的斜杠
      fullPath = fullPath.replace(/\/+/g, '/');
      
      if (fullPath === targetPath) {
        return route.meta?.label;
      }
      if (route.children) {
        const label = findRouteLabel(route.children, targetPath, fullPath);
        if (label) {
          return label;
        }
      }
    }
    return undefined;
  };

  // 从路由配置中查找标签名
  const label = findRouteLabel(routesConfig, path);
  if (label) {
    return label;
  }

  // 如果路由配置中没有找到，使用默认逻辑
  return path.split('/').pop() || '未知页面';
};

const RouteTabs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeKey, setActiveKey] = useState(location.pathname);

  // 初始化标签页
  useEffect(() => {
    const currentPath = location.pathname;
    const label = getLabelByPath(currentPath);

    // 使用函数式更新安全地更新tabs状态
    setTabs(prevTabs => {
      // 在函数式更新中检查路径是否已存在
      const isPathExist = prevTabs.some(tab => tab.path === currentPath);

      if (!isPathExist) {
        return [...prevTabs, {
          key: currentPath,
          label,
          path: currentPath
        }];
      }
      return prevTabs;
    });

    setActiveKey(currentPath);    
  }, [location.pathname]);

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    const tab = tabs.find(t => t.key === key);
    if (tab) {
      navigate(tab.path);
      setActiveKey(key);
    }
  };

  // 处理标签页关闭
  const handleTabClose = (key: string) => {
    const newTabs = tabs.filter(tab => tab.key !== key);
    setTabs(newTabs);

    // 如果关闭的是当前活跃标签页，跳转到第一个标签页
    if (key === activeKey && newTabs.length > 0) {
      const firstTab = newTabs[0];
      navigate(firstTab.path);
      setActiveKey(firstTab.key);
    } else if (newTabs.length === 0) {
      // 如果所有标签页都被关闭，跳转到首页
      navigate('/');
    }
  };

  // 处理关闭其他标签页
  const handleCloseOthers = (currentKey: string) => {
    const newTabs = tabs.filter(tab => tab.key === currentKey);
    setTabs(newTabs);
  };

  // 处理关闭所有标签页
  const handleCloseAll = () => {
    setTabs([]);
    navigate('/');
  };

  // 处理关闭左侧标签页
  const handleCloseLeft = (targetKey: string) => {
    const targetIndex = tabs.findIndex(tab => tab.key === targetKey);
    const newTabs = tabs.filter((_, index) => index >= targetIndex);
    setTabs(newTabs);
  };

  // 处理关闭右侧标签页
  const handleCloseRight = (targetKey: string) => {
    const targetIndex = tabs.findIndex(tab => tab.key === targetKey);
    const newTabs = tabs.filter((_, index) => index <= targetIndex);
    setTabs(newTabs);
  };

  // 生成右键菜单项
  const generateMenuItems = (tabKey: string): MenuProps['items'] => [
    {
      label: '关闭当前',
      key: 'closeCurrent',
      onClick: () => handleTabClose(tabKey)
    },
    {
      label: '关闭左侧',
      key: 'closeLeft',
      onClick: () => handleCloseLeft(tabKey)
    },
    {
      label: '关闭右侧',
      key: 'closeRight',
      onClick: () => handleCloseRight(tabKey)
    },
    {
      label: '关闭其他',
      key: 'closeOthers',
      onClick: () => handleCloseOthers(tabKey)
    },
    {
      label: '关闭所有',
      key: 'closeAll',
      onClick: handleCloseAll
    }
  ];

  // 渲染标签页
  const renderTabs = () => {
    return tabs.map(tab => ({
      key: tab.key,
      label: (
        <Dropdown menu={{ items: generateMenuItems(tab.key) }} trigger={['contextMenu']}>
          <div className="flex items-center gap-1">
            <span>{tab.label}</span>
            <Tooltip title="关闭标签页">
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTabClose(tab.key);
                }}
                className="text-gray-400 hover:text-gray-600"
              />
            </Tooltip>
          </div>
        </Dropdown>
      ),
      children: null
    }));
  };

  return (
    <div className="bg-white px-1 flex items-center gap-2">
      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        type="card"
        size="small"
        items={renderTabs()}
        className="flex-1"
        tabBarStyle={{
          margin: 0,
          padding: 0,
          borderBottom: 'none'
        }}
      />
    </div>
  );
};

export default RouteTabs;