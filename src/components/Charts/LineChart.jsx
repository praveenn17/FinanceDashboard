import React, { useMemo } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { format, parseISO, isAfter } from 'date-fns';

export const LineChart = () => {
  const { transactions, theme } = useAppContext();

  // Process data for chart: cumulative balance over time
  const data = useMemo(() => {
    // Sort transactions by date
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let currentBalance = 0;
    const dailyBalance = {};

    sorted.forEach((t) => {
      if (t.type === 'income') {
        currentBalance += t.amount;
      } else {
        currentBalance -= t.amount;
      }
      dailyBalance[t.date] = currentBalance;
    });

    return Object.entries(dailyBalance).map(([date, balance]) => ({
      date: format(parseISO(date), 'MMM dd'),
      balance
    }));
  }, [transactions]);

  const colors = {
    line: theme === 'dark' ? '#8b5cf6' : '#6366f1', // primary color varied slightly
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    text: theme === 'dark' ? '#94a3b8' : '#64748b',
    tooltipBg: theme === 'dark' ? '#1e293b' : '#ffffff',
    tooltipBorder: theme === 'dark' ? '#334155' : '#e2e8f0',
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke={colors.text} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke={colors.text} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: colors.tooltipBg, 
              borderColor: colors.tooltipBorder,
              borderRadius: '8px',
              color: theme === 'dark' ? '#f8fafc' : '#0f172a'
            }}
            itemStyle={{ color: colors.line }}
            formatter={(value) => [`$${value}`, 'Balance']}
          />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke={colors.line} 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
