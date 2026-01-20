import Routes from './routes/index'
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useThemeStore } from './store/useThemeStore.ts';

function App() {
  const siderTheme = useThemeStore((state: { siderTheme: string }) => state.siderTheme);
  
  return (
    <ConfigProvider locale={zhCN} theme={{
      algorithm: siderTheme === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
    }}>
      <Routes />
    </ConfigProvider>
  )
}

export default App
