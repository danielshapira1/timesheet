import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WorkEntry {
    id: string;
    date: string; // ISO date string YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    hourlyRate: number;
    totalPay: number;
    note?: string;
}

interface AppState {
    entries: WorkEntry[];
    settings: {
        defaultHourlyRate: number;
        currencySymbol: string;
        theme: 'light' | 'dark' | 'system';
        userName: string;
    };
    addEntry: (entry: WorkEntry) => void;
    editEntry: (id: string, updatedEntry: WorkEntry) => void;
    removeEntry: (id: string) => void;
    updateSettings: (settings: Partial<AppState['settings']>) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            entries: [],
            settings: {
                defaultHourlyRate: 35,
                currencySymbol: '₪',
                theme: 'system',
                userName: 'דניאל', // Default placeholder
            },
            addEntry: (entry) =>
                set((state) => ({ entries: [...state.entries, entry] })),
            editEntry: (id, updatedEntry) =>
                set((state) => ({
                    entries: state.entries.map((entry) =>
                        entry.id === id ? updatedEntry : entry
                    ),
                })),
            removeEntry: (id) =>
                set((state) => ({
                    entries: state.entries.filter((e) => e.id !== id),
                })),
            updateSettings: (newSettings) =>
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                })),
        }),
        {
            name: 'timesheet-storage',
            version: 1,
            migrate: (persistedState: any, version) => {
                if (version === 0) {
                    persistedState.settings.defaultHourlyRate = 35;
                }
                return persistedState;
            },
        }
    )
);
