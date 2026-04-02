import React, { useMemo } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAppContext } from '../../context/AppContext';

export const PieChart = () => {
  const { transactions, theme } = useAppContext();

  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = {};

    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort by highest expense
  }, [transactions]);

  // Vibrant color palette for charts
  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'];

  const colors = {
    tooltipBg: theme === 'dark' ? '#1e293b' : '#ffffff',
    tooltipBorder: theme === 'dark' ? '#334155' : '#e2e8f0',
    text: theme === 'dark' ? '#f8fafc' : '#0f172a'
  };

  if (data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
        No expense data available.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: colors.tooltipBg, 
              borderColor: colors.tooltipBorder,
              borderRadius: '8px',
              color: colors.text
            }}
            itemStyle={{ color: colors.text }}
            formatter={(value) => [`$${value}`, 'Amount']}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span style={{ color: theme === 'dark' ? '#cbd5e1' : '#475569' }}>{value}</span>}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
