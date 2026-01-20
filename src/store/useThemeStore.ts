import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
    siderTheme: string,
    setSiderTheme: (theme: string) => void,
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            siderTheme: 'light',
            setSiderTheme: (theme: string) => {
                set({ siderTheme: theme})
            },
        }),
        {
            name: 'theme',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
