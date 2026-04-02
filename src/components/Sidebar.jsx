import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, BarChart3, Moon, Sun, Wallet } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { RoleSwitcher } from './RoleSwitcher';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Sidebar = () => {
  const { theme, toggleTheme } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: ReceiptText },
    { name: 'Insights', path: '/insights', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-card shadow-sm border border-border"
      >
        <span className="sr-only">Toggle menu</span>
        <div className="w-5 h-5 flex flex-col justify-center space-y-1">
          <span className="block w-full h-0.5 bg-foreground rounded-full"></span>
          <span className="block w-full h-0.5 bg-foreground rounded-full"></span>
          <span className="block w-full h-0.5 bg-foreground rounded-full"></span>
        </div>
      </button>

      <div className={cn(
        "inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col fixed",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-center py-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg text-primary-foreground">
              <Wallet size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
              FinDash
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} className="transition-transform group-hover:scale-110" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          <RoleSwitcher />
          
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
          >
            <span className="text-sm font-medium">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
