import React from 'react';
import { Shield, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from './Sidebar';

export const RoleSwitcher = () => {
  const { role, setRole } = useAppContext();

  return (
    <div className="bg-secondary/50 p-1.5 rounded-lg flex items-center gap-1 border border-border">
      <button
        onClick={() => setRole('viewer')}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200",
          role === 'viewer' 
            ? "bg-card text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <User size={16} />
        <span>Viewer</span>
      </button>
      <button
        onClick={() => setRole('admin')}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200",
          role === 'admin' 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Shield size={16} />
        <span>Admin</span>
      </button>
    </div>
  );
};
