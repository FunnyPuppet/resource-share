import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type SearchState = {
    page: number
    dcc: string
    rcc: string
    keyword: string
}

type SearchActions = {
    setPage: (page: SearchState['page']) => void
    setDcc: (dcc: SearchState['dcc']) => void
    setRcc: (rcc: SearchState['rcc']) => void
    setKeyword: (keyword: SearchState['keyword']) => void
}

export const useSearchStore = create<SearchState & SearchActions>()(
    persist(
        (set) => ({
            page: 1,
            dcc: 'all',
            rcc: 'all',
            keyword: '',
            setPage: (page) => set({ page }),
            setDcc: (dcc) => set({ dcc }),
            setRcc: (rcc) => set({ rcc }),
            setKeyword: (keyword) => set({ keyword }),
        }),
        {
            name: 'resource-search',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(
                        ([key]) => !['setPage', 'setDcc', 'setRcc', 'setKeyword'].includes(key) // 排除方法
                    )
                )
        }
    )
)