import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Save, Calculator } from 'lucide-react';
import { format } from 'date-fns';
import { useAppStore, type WorkEntry } from '../store/useAppStore';
import { Card } from '../components/Card';
import { formatCurrency } from '../lib/utils';

export default function AddEntry() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addEntry, editEntry, entries, settings } = useAppStore();

    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [hourlyRate, setHourlyRate] = useState(settings.defaultHourlyRate.toString());

    // Load entry data if editing
    useEffect(() => {
        if (id) {
            const entry = entries.find((e) => e.id === id);
            if (entry) {
                setDate(entry.date);
                setStartTime(entry.startTime);
                setEndTime(entry.endTime);
                setHourlyRate(entry.hourlyRate.toString());
            } else {
                // Entry not found, maybe redirect?
                navigate('/');
            }
        }
    }, [id, entries, navigate]);

    // Derived calculations (no need for state/useEffect)
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    let duration = (endH + endM / 60) - (startH + startM / 60);
    if (duration < 0) duration += 24; // Handle overnight

    const totalPay = duration * Number(hourlyRate);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const entryData: WorkEntry = {
            id: id || crypto.randomUUID(),
            date,
            startTime,
            endTime,
            hourlyRate: Number(hourlyRate),
            totalPay,
        };

        if (id) {
            editEntry(id, entryData);
        } else {
            addEntry(entryData);
        }

        navigate('/');
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900 max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                >
                    <ChevronRight size={20} />
                </button>
                <h1 className="text-lg font-bold">{id ? 'עריכת רשומה' : 'הוספת רשומה'}</h1>
                <div className="w-9"></div> {/* Spacer for center alignment */}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 p-4 space-y-3 overflow-y-auto">
                <div className="space-y-3">
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">תאריך</span>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none transition text-sm"
                        />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">התחלה</span>
                            <input
                                type="time"
                                required
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none transition text-sm"
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">סיום</span>
                            <input
                                type="time"
                                required
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none transition text-sm"
                            />
                        </label>
                    </div>

                    <label className="block">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">תעריף שעתי ({settings.currencySymbol})</span>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.1"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none transition text-lg font-semibold"
                        />
                    </label>
                </div>

                {/* Live Calculation Preview */}
                <Card className="bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/20">
                    <div className="flex justify-between items-center text-primary-dark">
                        <div className="flex items-center space-x-2 space-x-reverse">
                            <Calculator size={18} />
                            <span className="font-semibold text-sm">סיכום משוער</span>
                        </div>
                    </div>
                    <div className="mt-3 flex justify-between items-end">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">סה״כ שעות</p>
                            <p className="text-lg font-bold">{duration.toFixed(2)}</p>
                        </div>
                        <div className="text-left rtl:text-right">
                            <p className="text-xs text-gray-500 font-medium">סה״כ לתשלום</p>
                            <p className="text-2xl font-bold text-primary">
                                {formatCurrency(totalPay, settings.currencySymbol)}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Spacer to push buttons down if needed */}
                <div className="flex-1"></div>

                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 space-x-reverse"
                >
                    <Save size={18} />
                    <span>{id ? 'עדכן רשומה' : 'שמור רשומה'}</span>
                </button>
            </form>
        </div>
    );
}
