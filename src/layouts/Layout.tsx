import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Calendar, Plus, BarChart, Settings } from 'lucide-react';
import { clsx } from 'clsx';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            clsx(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200',
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            )
        }
    >
        <Icon size={24} strokeWidth={2} />
        <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
);

export const Layout = () => {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-20">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe shadow-lg z-50">
                <div className="flex items-center justify-around h-full max-w-md mx-auto px-2">
                    {/* Note: In RTL, the reading order is Right-to-Left. 
              But Flexbox with 'dir=rtl' on parent (html/body) naturally flips this.
              We list items in logical order: Home -> ... -> Settings.
          */}
                    <NavItem to="/" icon={Home} label="בית" />
                    <NavItem to="/calendar" icon={Calendar} label="יומן" />

                    <div className="relative -top-5">
                        <NavLink
                            to="/add"
                            className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-xl hover:bg-primary-dark transition-transform active:scale-95"
                        >
                            <Plus size={32} />
                        </NavLink>
                    </div>

                    <NavItem to="/reports" icon={BarChart} label="דוחות" />
                    <NavItem to="/settings" icon={Settings} label="הגדרות" />
                </div>
            </nav>
        </div>
    );
};
