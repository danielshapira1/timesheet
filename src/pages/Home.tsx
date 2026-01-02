import { useMemo } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { TrendingUp, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency, formatDuration } from '../lib/utils';
import { Card, CardContent } from '../components/Card';

export default function Home() {
    const navigate = useNavigate();
    const { entries, settings } = useAppStore();
    const userName = settings.userName;

    const stats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyEntries = entries.filter((entry) => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        });

        const totalIncome = monthlyEntries.reduce((sum, entry) => sum + entry.totalPay, 0);

        const totalHours = monthlyEntries.reduce((sum, entry) => {
            const [startH, startM] = entry.startTime.split(':').map(Number);
            const [endH, endM] = entry.endTime.split(':').map(Number);
            let duration = (endH + endM / 60) - (startH + startM / 60);
            if (duration < 0) duration += 24; // Handle overnight shifts
            return sum + duration;
        }, 0);

        return { totalIncome, totalHours, count: monthlyEntries.length };
    }, [entries]);

    const recentEntries = useMemo(() => {
        return [...entries]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
    }, [entries]);

    const currentMonthName = format(new Date(), 'MMMM', { locale: he });

    return (
        <div className="p-6 pt-8 space-y-6 max-w-md mx-auto">
            {/* Header */}
            <header className="flex justify-between items-end">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                        {format(new Date(), 'EEEE, d בMMMM', { locale: he })}
                    </p>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        היי, {userName} 👋
                    </h1>
                </div>
                {/* Placeholder for Profile/Notifs */}
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-lg">👤</span>
                </div>
            </header>

            {/* Main Stats Card - Emphasis on Income */}
            <Card className="bg-gradient-to-br from-primary to-blue-600 border-none text-white shadow-lg shadow-blue-500/20">
                <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">הכנסה חודשית ({currentMonthName})</p>
                            <h2 className="text-4xl font-bold tracking-tight">
                                {formatCurrency(stats.totalIncome, settings.currencySymbol)}
                            </h2>
                        </div>
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <TrendingUp size={24} className="text-white" />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center space-x-4 space-x-reverse text-blue-50">
                        <div className="flex items-center">
                            <Clock size={16} className="ml-1.5 opacity-80" />
                            <span className="font-semibold">{formatDuration(stats.totalHours)}</span>
                        </div>
                        <div className="w-px h-4 bg-blue-400/50"></div>
                        <div className="flex items-center">
                            <CalendarIcon size={16} className="ml-1.5 opacity-80" />
                            <span className="font-semibold">{stats.count} משמרות</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">פעילות אחרונה</h2>
                    <span className="text-sm text-primary font-medium cursor-pointer hover:underline">הכל</span>
                </div>

                <div className="space-y-3">
                    {recentEntries.length === 0 ? (
                        <Card className="text-center py-8">
                            <p className="text-gray-500">אין עדיין משמרות החודש.</p>
                        </Card>
                    ) : (
                        recentEntries.map((entry) => (
                            <Card
                                key={entry.id}
                                onClick={() => navigate(`/edit/${entry.id}`)}
                                className="p-4 flex justify-between items-center transition hover:bg-gray-50 dark:hover:bg-gray-800/50 active:scale-[0.99] cursor-pointer"
                            >
                                <div className="flex items-center space-x-3 space-x-reverse">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                        {format(new Date(entry.date), 'dd/MM')}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">משמרת רגילה</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {entry.startTime} - {entry.endTime}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-left rtl:text-right">
                                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                                        +{formatCurrency(entry.totalPay, settings.currencySymbol)}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {formatDuration(entry.totalPay / entry.hourlyRate)}
                                    </p>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
