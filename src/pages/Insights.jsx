import React, { useMemo } from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../components/Sidebar';
import { startOfMonth, isSameMonth, subMonths } from 'date-fns';

export const Insights = () => {
  const { transactions } = useAppContext();

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const expenses = transactions.filter(t => t.type === 'expense');
    
    // 1. Highest spending category
    const categoryTotals = {};
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    
    let highestCategory = '';
    let highestAmount = 0;
    for (const [cat, amt] of Object.entries(categoryTotals)) {
      if (amt > highestAmount) {
        highestAmount = amt;
        highestCategory = cat;
      }
    }

    // 2. Month over month comparison (Current month vs Last month)
    const now = new Date();
    const currentMonthExpenses = expenses.filter(t => isSameMonth(new Date(t.date), now))
      .reduce((sum, t) => sum + t.amount, 0);
      
    const lastMonthExpenses = expenses.filter(t => isSameMonth(new Date(t.date), subMonths(now, 1)))
      .reduce((sum, t) => sum + t.amount, 0);

    let comparisonText = '';
    let isWarning = false;
    
    if (lastMonthExpenses === 0) {
      comparisonText = `You've spent $${currentMonthExpenses.toFixed(2)} this month. Need more history for comparison.`;
    } else {
      const diff = currentMonthExpenses - lastMonthExpenses;
      const percentage = Math.abs((diff / lastMonthExpenses) * 100).toFixed(0);
      if (diff > 0) {
        comparisonText = `You spent ${percentage}% more than last month. Watch your spending!`;
        isWarning = true;
      } else {
        comparisonText = `Great job! You spent ${percentage}% less compared to last month.`;
      }
    }

    // 3. Largest single transaction
    const largestTx = [...transactions].sort((a, b) => b.amount - a.amount)[0];

    return {
      highestCategory: { name: highestCategory, amount: highestAmount },
      comparison: { text: comparisonText, isWarning },
      largest: largestTx
    };
  }, [transactions]);

  if (!insights) {
    return (
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Insights</h1>
          <p className="text-muted-foreground mt-2">Discover patterns in your finances.</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground mt-6">
          <Lightbulb size={32} className="mx-auto mb-4 opacity-50" />
          <p>Not enough data to generate insights yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Insights</h1>
        <p className="text-muted-foreground mt-2">Discover patterns in your finances based on your activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Highest Category */}
        {insights.highestCategory.amount > 0 && (
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
                <Target size={24} />
              </div>
              <h3 className="font-semibold text-foreground">Top Expense Area</h3>
            </div>
            <p className="text-muted-foreground mb-4 flex-1">
              Your highest spending category is <span className="font-semibold text-foreground capitalize">{insights.highestCategory.name}</span>.
            </p>
            <div className="pt-4 border-t border-border">
              <span className="text-2xl font-bold text-foreground">
                ${insights.highestCategory.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-sm text-muted-foreground ml-2">Total spent</span>
            </div>
          </div>
        )}

        {/* Mom Comparison */}
        <div className={cn(
          "bg-card rounded-2xl p-6 shadow-sm border flex flex-col hover:shadow-md transition-shadow",
          insights.comparison.isWarning ? "border-destructive/30" : "border-border"
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "p-2.5 rounded-xl",
              insights.comparison.isWarning ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
            )}>
              {insights.comparison.isWarning ? <AlertTriangle size={24} /> : <TrendingUp size={24} />}
            </div>
            <h3 className="font-semibold text-foreground">Monthly Comparison</h3>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed flex-1">
            {insights.comparison.text}
          </p>
        </div>

        {/* Largest Transaction */}
        {insights.largest && (
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Lightbulb size={24} />
              </div>
              <h3 className="font-semibold text-foreground">Largest Transaction</h3>
            </div>
            <p className="text-muted-foreground mb-4 flex-1">
              Your largest recorded transaction was for <span className="font-semibold text-foreground capitalize">{insights.largest.category}</span>.
            </p>
            <div className="pt-4 border-t border-border flex justify-between items-end">
              <div>
                <span className={cn(
                  "text-2xl font-bold",
                  insights.largest.type === 'income' ? 'text-success' : 'text-foreground'
                )}>
                  {insights.largest.type === 'income' ? '+' : '-'}${insights.largest.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                insights.largest.type === 'income' ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>
                {insights.largest.type}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
