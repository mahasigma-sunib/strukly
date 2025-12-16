import React, { useState } from 'react';
import { 
  Plus, Target, // Wallet, MoreVertical, 
  Trash2, Edit3, ArrowUpCircle, X, 
  CheckCircle2 // TrendingUp 
} from 'lucide-react';

// --- Interface Data ---
interface GoalItem {
  id: string;
  name: string;
  price: number;
  currentAmount: number;
  isCompleted: boolean;
}

const WishlistApp: React.FC = () => {
  // 1. Get Goal Item List (State Management)
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);
  
  // UI States
  const [activeModal, setActiveModal] = useState<'create' | 'deposit' | 'edit' | null>(null);
  const [tempAmount, setTempAmount] = useState<number>(0);
  const [formData, setFormData] = useState({ name: '', price: 0 });

  // --- Handlers (Mempresentasikan 7 Use Cases) ---

  // Use Case: Create Goal Item
  const handleCreate = () => {
    const newGoal: GoalItem = {
      id: Math.random().toString(36).substring(7),
      name: formData.name,
      price: formData.price,
      currentAmount: 0,
      isCompleted: false
    };
    setGoals([...goals, newGoal]);
    setActiveModal(null);
  };

  // Use Case: Deposit Goal Item
  const handleDeposit = () => {
    if (!selectedGoal) return;
    setGoals(goals.map(g => {
      if (g.id === selectedGoal.id) {
        const newTotal = g.currentAmount + tempAmount;
        return { 
          ...g, 
          currentAmount: newTotal,
          // Use Case: Mark Goal Item (Auto mark if reached)
          isCompleted: newTotal >= g.price 
        };
      }
      return g;
    }));
    setActiveModal(null);
  };

  // Use Case: Update Goal Item
  const handleUpdate = () => {
    if (!selectedGoal) return;
    setGoals(goals.map(g => g.id === selectedGoal.id ? { ...g, name: formData.name, price: formData.price } : g));
    setActiveModal(null);
  };

  // Use Case: Delete Goal Item
  const handleDelete = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900">
      {/* HEADER SECTION */}
      <header className="p-6 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">WISHLIST</h1>
            <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block mt-1">
              {goals.filter(g => !g.isCompleted).length} ACTIVE TARGETS
            </p>
          </div>
          <button 
            onClick={() => { setFormData({name: '', price: 0}); setActiveModal('create'); }}
            className="bg-slate-900 text-white p-3 rounded-2xl hover:scale-105 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      {/* LIST SECTION (Get Goal Item List) */}
      <main className="p-6 space-y-4">
        {goals.map((goal) => {
          const progress = Math.min((goal.currentAmount / goal.price) * 100, 100);
          
          return (
            <div key={goal.id} className={`bg-white rounded-[24px] p-5 shadow-sm border ${goal.isCompleted ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${goal.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {goal.isCompleted ? <CheckCircle2 size={24} /> : <Target size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 leading-tight">{goal.name}</h3>
                    <p className="text-xs font-medium text-slate-400 mt-1">
                      Rp {goal.currentAmount.toLocaleString()} / Rp {goal.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {/* Actions Menu */}
                <div className="flex gap-1">
                  <button onClick={() => { setSelectedGoal(goal); setActiveModal('deposit'); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <ArrowUpCircle size={20} />
                  </button>
                  <button onClick={() => { setSelectedGoal(goal); setFormData({name: goal.name, price: goal.price}); setActiveModal('edit'); }} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDelete(goal.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ease-out ${goal.isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </main>

      {/* MODAL SYSTEM (Create, Edit, Deposit) */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800 uppercase italic">
                {activeModal === 'create' && 'Add New Goal'}
                {activeModal === 'edit' && 'Update Goal'}
                {activeModal === 'deposit' && 'Add Savings'}
              </h2>
              <button onClick={() => setActiveModal(null)} className="p-2 bg-slate-100 rounded-full text-slate-500"><X size={20}/></button>
            </div>

            <div className="space-y-4">
              {activeModal !== 'deposit' ? (
                <>
                  <input 
                    type="text" placeholder="Goal Name" value={formData.name}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    type="number" placeholder="Target Price (Rp)" value={formData.price || ''}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all"
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-2">Berapa yang ingin kamu tabung?</p>
                  <input 
                    type="number" autoFocus placeholder="0" 
                    className="w-full text-center text-3xl font-black bg-transparent border-b-2 border-blue-500 outline-none p-4"
                    onChange={(e) => setTempAmount(Number(e.target.value))}
                  />
                </div>
              )}

              <button 
                onClick={activeModal === 'create' ? handleCreate : activeModal === 'edit' ? handleUpdate : handleDeposit}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl mt-4 shadow-xl shadow-slate-200 uppercase tracking-widest active:scale-95 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistApp;