import React from 'react';
import { cn } from './Sidebar';

export const SummaryCard = ({ title, amount, icon: Icon, trend, trendValue, isPositive }) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-muted-foreground font-medium text-sm">{title}</h3>
        <div className={cn(
          "p-2 rounded-lg",
          title === 'Total Balance' ? "bg-primary/10 text-primary" : 
          title === 'Total Income' ? "bg-success/10 text-success" : 
          "bg-destructive/10 text-destructive"
        )}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
      
      <div className="mb-2">
        <span className="text-3xl font-bold text-foreground">
          ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {trend && (
        <div className="flex items-center gap-2 mt-auto">
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          )}>
            {isPositive ? '+' : '-'}{trendValue}%
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
};
