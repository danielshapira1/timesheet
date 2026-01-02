import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, symbol: string = '₪') {
    return new Intl.NumberFormat('he-IL', {
        style: 'currency',
        currency: 'ILS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount).replace('ILS', symbol); // Manually replacing to ensure symbol preference
}

export function formatDuration(decimalHours: number) {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours} ש׳ ${minutes > 0 ? `${minutes} ד׳` : ''}`;
}
