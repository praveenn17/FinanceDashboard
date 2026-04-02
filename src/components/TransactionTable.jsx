import React, { useState } from 'react';
import { Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from './Sidebar';
import { format, parseISO } from 'date-fns';

export const TransactionTable = ({ transactions, onEdit }) => {
  const { role, deleteTransaction } = useAppContext();
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'date') {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  if (transactions.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Trash2 size={24} className="text-muted-foreground opacity-50" />
        </div>
        <p className="text-lg font-medium text-foreground mb-1">No transactions found</p>
        <p className="text-sm">Try adjusting your filters or add a new transaction.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <th className="p-4 font-medium min-w-[120px]">
                <button 
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  onClick={() => handleSort('date')}
                >
                  Date <ArrowUpDown size={14} className={cn("", sortField === 'date' && "text-foreground")} />
                </button>
              </th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium text-right">
                <button 
                  className="flex items-center justify-end gap-1 w-full hover:text-foreground transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  Amount <ArrowUpDown size={14} className={cn("", sortField === 'amount' && "text-foreground")} />
                </button>
              </th>
              {role === 'admin' && <th className="p-4 font-medium text-center w-24">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-muted/30 transition-colors group">
                <td className="p-4 whitespace-nowrap text-sm">
                  {format(parseISO(tx.date), 'MMM dd, yyyy')}
                </td>
                <td className="p-4 whitespace-nowrap text-sm font-medium capitalize">
                  {tx.category}
                </td>
                <td className="p-4 whitespace-nowrap text-sm">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                    tx.type === 'income' 
                      ? "bg-success/10 text-success" 
                      : "bg-destructive/10 text-destructive"
                  )}>
                    {tx.type}
                  </span>
                </td>
                <td className={cn(
                  "p-4 whitespace-nowrap text-sm font-bold text-right",
                  tx.type === 'income' ? "text-success" : "text-foreground"
                )}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                {role === 'admin' && (
                  <td className="p-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(tx)}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
