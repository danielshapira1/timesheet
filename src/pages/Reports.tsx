import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';

export default function Reports() {
    const { entries, settings } = useAppStore();

    const data = useMemo(() => {
        const last6Months = new Map<string, number>();
        const now = new Date();

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getMonth() + 1}/${d.getFullYear()}`; // Simple key
            last6Months.set(key, 0);
        }

        entries.forEach(entry => {
            const d = new Date(entry.date);
            const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
            if (last6Months.has(key)) {
                last6Months.set(key, (last6Months.get(key) || 0) + entry.totalPay);
            }
        });

        return Array.from(last6Months).map(([name, amount]) => ({
            name: name.split('/')[0], // Just the month number for X Axis
            amount
        }));
    }, [entries]);

    const totalAllTime = entries.reduce((sum, e) => sum + e.totalPay, 0);
    const avgMonthly = totalAllTime / (data.filter(d => d.amount > 0).length || 1);

    return (
        <div className="p-6 pt-10 pb-24 max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">דוחות</h1>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>הכנסות חצי שנה אחרונה</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 -mx-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.amount > 0 ? '#3B82F6' : '#E5E7EB'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                        <p className="text-sm text-gray-500">סה״כ הכנסות</p>
                        <p className="text-xl font-bold mt-1 text-emerald-600">
                            {formatCurrency(totalAllTime, settings.currencySymbol)}
                        </p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-sm text-gray-500">ממוצע חודשי</p>
                        <p className="text-xl font-bold mt-1 text-blue-600">
                            {formatCurrency(avgMonthly, settings.currencySymbol)}
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
