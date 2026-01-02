import { Moon, Sun, Download, Trash, Globe } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/Card';
import { cn } from '../lib/utils';

export default function SettingsPage() {
    const { settings, updateSettings, entries } = useAppStore();

    const handleThemeToggle = (newTheme: 'light' | 'dark' | 'system') => {
        updateSettings({ theme: newTheme });
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ settings, entries }, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "timesheet_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="p-6 pt-10 pb-24 max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-8">הגדרות</h1>

            <div className="space-y-6">

                {/* Profile Section */}
                <section>
                    <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">פרופיל</h2>
                    <Card className="space-y-4">
                        <div>
                            <label className="text-sm block mb-1 font-medium">שם משתמש</label>
                            <input
                                type="text"
                                value={settings.userName}
                                onChange={(e) => updateSettings({ userName: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label className="text-sm block mb-1 font-medium">תעריף שעתי ברירת מחדל</label>
                            <input
                                type="number"
                                value={settings.defaultHourlyRate}
                                onChange={(e) => updateSettings({ defaultHourlyRate: Number(e.target.value) })}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </Card>
                </section>

                {/* Appearance */}
                <section>
                    <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">נראות</h2>
                    <Card className="flex p-1 bg-gray-100 dark:bg-gray-900 border-none">
                        {[
                            { id: 'light', icon: Sun, label: 'בהיר' },
                            { id: 'dark', icon: Moon, label: 'כהה' },
                            { id: 'system', icon: Globe, label: 'מערכת' },
                        ].map((themeOpt) => (
                            <button
                                key={themeOpt.id}
                                onClick={() => handleThemeToggle(themeOpt.id as 'light' | 'dark' | 'system')}
                                className={cn(
                                    "flex-1 flex flex-col items-center justify-center py-3 rounded-xl text-sm font-medium transition-all",
                                    settings.theme === themeOpt.id
                                        ? "bg-white dark:bg-gray-700 shadow-sm text-primary"
                                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                            >
                                <themeOpt.icon size={20} className="mb-1" />
                                {themeOpt.label}
                            </button>
                        ))}
                    </Card>
                </section>

                {/* Data */}
                <section>
                    <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">נתונים</h2>
                    <Card className="divide-y divide-gray-100 dark:divide-gray-700 p-0 overflow-hidden">
                        <button
                            onClick={handleExport}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition text-left rtl:text-right"
                        >
                            <span className="font-medium">ייצוא נתונים</span>
                            <Download size={18} className="text-gray-400" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition text-left rtl:text-right group">
                            <span className="font-medium text-red-500">מחיקת כל הנתונים</span>
                            <Trash size={18} className="text-red-300 group-hover:text-red-500" />
                        </button>
                    </Card>
                </section>

                <div className="text-center text-xs text-gray-400 mt-8">
                    גרסה 1.0.0 • נבנה עם ❤️
                </div>

            </div>
        </div>
    );
}
