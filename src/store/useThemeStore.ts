import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
    siderTheme: string,
    setSiderTheme: (theme: string) => void,
    initializeTheme: () => void,
}

// 初始化主题
const initializeTheme = () => {
    try {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            const parsedTheme = JSON.parse(storedTheme);
            const theme = parsedTheme.state?.siderTheme || 'light';
            if (theme === 'light') {
                document.documentElement.classList.add('light');
            } else {
                document.documentElement.classList.remove('light');
            }
        } else {
            // 默认添加 light 类
            document.documentElement.classList.add('light');
        }
    } catch (error) {
        console.error('Failed to initialize theme:', error);
        // 出错时默认添加 light 类
        document.documentElement.classList.add('light');
    }
};

// 立即执行初始化
initializeTheme();

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            siderTheme: 'light',
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
