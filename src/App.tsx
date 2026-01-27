import Routes from './routes/index'
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useThemeStore } from './store/useThemeStore.ts';

function App() {
  // Zustand v5 不再需要 shallow 选择器，直接使用箭头函数即可
  const siderTheme = useThemeStore((state) => state.siderTheme);
  
  return (
    <ConfigProvider locale={zhCN} theme={{
      algorithm: siderTheme === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
    }}>
      <Routes />
    </ConfigProvider>
  )
}

export default App
