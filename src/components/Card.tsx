import React from 'react';
import { cn } from '../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => {
    return (
        <div
            className={cn(
                'bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-shadow hover:shadow-md',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className }: CardProps) => (
    <div className={cn('flex flex-col space-y-1.5 mb-4', className)}>{children}</div>
);

export const CardTitle = ({ children, className }: CardProps) => (
    <h3 className={cn('font-bold text-lg text-gray-900 dark:text-gray-100', className)}>
        {children}
    </h3>
);

export const CardContent = ({ children, className }: CardProps) => (
    <div className={cn('', className)}>{children}</div>
);
