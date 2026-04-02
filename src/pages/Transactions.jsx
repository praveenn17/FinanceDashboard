import React, { useState, useMemo } from 'react';
import { Plus, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { TransactionTable } from '../components/TransactionTable';
import { Filters } from '../components/Filters';
import { format } from 'date-fns';

export const Transactions = () => {
  const { transactions, role, addTransaction, editTransaction } = useAppContext();
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    category: '',
    type: 'expense'
  });

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch = tx.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === 'all' || tx.type === filterType;
      const matchCategory = filterCategory === 'all' || tx.category === filterCategory;
      return matchSearch && matchType && matchCategory;
    });
  }, [transactions, searchQuery, filterType, filterCategory]);

  const handleOpenModal = (tx = null) => {
    if (tx) {
      setEditingTx(tx);
      setFormData({
        date: tx.date,
        amount: tx.amount,
        category: tx.category,
        type: tx.type
      });
    } else {
      setEditingTx(null);
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        amount: '',
        category: '',
        type: 'expense'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTx(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editingTx) {
      editTransaction(editingTx.id, payload);
    } else {
      addTransaction(payload);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6 fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-2">Manage and track your financial history.</p>
        </div>
        {role === 'admin' && (
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>
        )}
      </div>

      <Filters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
      />

      <TransactionTable 
        transactions={filteredTransactions} 
        onEdit={handleOpenModal}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-lg border border-border p-6 scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {editingTx ? 'Edit Transaction' : 'New Transaction'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`py-2 px-4 rounded-lg font-medium border transition-colors ${
                      formData.type === 'income' 
                        ? 'bg-success/10 border-success/30 text-success' 
                        : 'bg-transparent border-input text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`py-2 px-4 rounded-lg font-medium border transition-colors ${
                      formData.type === 'expense' 
                        ? 'bg-destructive/10 border-destructive/30 text-destructive' 
                        : 'bg-transparent border-input text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-transparent border border-input rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-muted-foreground">$</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-transparent border border-input rounded-lg pl-7 pr-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                <input 
                  type="text" 
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-transparent border border-input rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent capitalize"
                  placeholder="e.g. Food, Salary, Rent"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2 rounded-lg font-medium border border-input text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
