import React, { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { SummaryCard } from '../components/SummaryCard';
import { LineChart } from '../components/Charts/LineChart';
import { PieChart } from '../components/Charts/PieChart';

export const Dashboard = () => {
  const { transactions } = useAppContext();

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    
    transactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, [transactions]);

  // Simplistic mock trends logic for visual effect (randomized slightly based on amounts for demo)
  const incomeTrend = totalIncome > 0 ? 12 : 0; 
  const expenseTrend = totalExpense > 0 ? 8 : 0;
  const balanceTrend = balance > 0 ? 15 : -5;

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your finances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Balance" 
          amount={balance} 
          icon={Wallet} 
          trend={true}
          trendValue={Math.abs(balanceTrend)}
          isPositive={balanceTrend >= 0}
        />
        <SummaryCard 
          title="Total Income" 
          amount={totalIncome} 
          icon={TrendingUp} 
          trend={true}
          trendValue={incomeTrend}
          isPositive={true}
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={totalExpense} 
          icon={TrendingDown} 
          trend={true}
          trendValue={expenseTrend}
          isPositive={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="font-semibold text-lg mb-6">Balance Trend</h3>
          <LineChart />
        </div>
        
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="font-semibold text-lg mb-6">Expenses by Category</h3>
          <PieChart />
        </div>
      </div>
    </div>
  );
};
