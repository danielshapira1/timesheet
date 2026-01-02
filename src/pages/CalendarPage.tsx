import { useMemo } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/Card';
import { formatCurrency, formatDuration } from '../lib/utils';

export default function CalendarPage() {
    const { entries, removeEntry, settings } = useAppStore();

    const groupedEntries = useMemo(() => {
        const groups: { [key: string]: typeof entries } = {};

        // Sort descending
        const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        sorted.forEach(entry => {
            const monthYear = format(new Date(entry.date), 'MMMM yyyy', { locale: he });
            if (!groups[monthYear]) {
                groups[monthYear] = [];
            }
            groups[monthYear].push(entry);
        });

        return groups;
    }, [entries]);

    const handleDelete = (id: string) => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק רשומה זו?')) {
            removeEntry(id);
        }
    };

    return (
        <div className="p-6 pt-10 pb-24 max-w-md mx-auto min-h-full">
            <h1 className="text-3xl font-bold mb-6">היסטוריית עבודה</h1>

            {entries.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                    <p>עדיין לא הוספת משמרות.</p>
                    <p className="text-sm">לחץ על ה- + למטה כדי להתחיל.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedEntries).map(([month, monthEntries]) => (
                        <div key={month} className="space-y-3">
                            <h2 className="text-lg font-bold text-gray-400 sticky top-0 bg-gray-50 dark:bg-gray-900 py-2 z-10 backdrop-blur-sm bg-opacity-90">
                                {month}
                            </h2>
                            {monthEntries.map((entry) => (
                                <Card key={entry.id} className="p-4 flex justify-between items-center group relative overflow-hidden">
                                    <div className="flex items-center space-x-4 space-x-reverse">
                                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                                            <span className="text-lg font-bold leading-none">{format(new Date(entry.date), 'dd')}</span>
                                            <span className="text-[10px] uppercase font-medium">{format(new Date(entry.date), 'EEE', { locale: he })}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {entry.startTime} - {entry.endTime}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {formatDuration(entry.totalPay / entry.hourlyRate)} • {formatCurrency(entry.hourlyRate, settings.currencySymbol)}/שעה
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-left rtl:text-right">
                                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                                            {formatCurrency(entry.totalPay, settings.currencySymbol)}
                                        </p>
                                    </div>

                                    {/* Quick Actions overlay on hover/focus (desktop) or always accessible on mobile via specific UI gesture, but for now a simple delete button */}
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 rounded-full shadow-sm"
                                        title="מחק"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </Card>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
