import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
    siderTheme: string,
    setSiderTheme: (theme: string) => void,
    initializeTheme: () => void,
}

// 获取存储的主题
const getStoredTheme = () => {
    try {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            const parsedTheme = JSON.parse(storedTheme);
            return parsedTheme.state?.siderTheme || 'light';
        }
    } catch (error) {
        console.error('Failed to get stored theme:', error);
    }
    return 'light';
};

// 初始化主题
const initializeTheme = () => {
    try {
        const theme = getStoredTheme();
        if (theme === 'light') {
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.remove('light');
        }
    } catch (error) {
        console.error('Failed to initialize theme:', error);
        // 出错时默认添加 light 类
        document.documentElement.classList.add('light');
    }
};

// 立即执行初始化
initializeTheme();

// 获取初始主题
const initialTheme = getStoredTheme();

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            siderTheme: initialTheme,
            setSiderTheme: (theme: string) => {
                set({ siderTheme: theme});
                // 同步切换 HTML 类名
                if (theme === 'light') {
                    document.documentElement.classList.add('light');
                } else {
                    document.documentElement.classList.remove('light');
                }
            },
            initializeTheme: initializeTheme,
        }),
        {
            name: 'theme',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
