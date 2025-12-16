import React, { useState } from 'react';

import { Plus, Target, Trash2, Edit3, ArrowUpCircle, X, CheckCircle2 } from 'lucide-react';

// --- Types ---
export type GoalItem = {
  id: string;
  name: string;
  price: number;
  currentAmount: number;
  isCompleted: boolean;
};

// --- Local components (inlined) ---
const GoalsHeader: React.FC<{ activeCount: number; onAdd: () => void }> = ({ activeCount, onAdd }) => (
  <header className="p-6 bg-white border-b border-slate-100 sticky top-0 z-10">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800">WISHLIST</h1>
        <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block mt-1">{activeCount} ACTIVE TARGETS</p>
      </div>
      <button onClick={onAdd} className="bg-slate-900 text-white p-3 rounded-2xl hover:scale-105 transition-transform"><Plus size={24} /></button>
    </div>
  </header>
);

const GoalCard: React.FC<{ goal: GoalItem; onDeposit: (g: GoalItem) => void; onEdit: (g: GoalItem) => void; onDelete: (id: string) => void }> = ({ goal, onDeposit, onEdit, onDelete }) => (
  <div className={`bg-white rounded-[24px] p-5 shadow-sm border ${goal.isCompleted ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${goal.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
          {goal.isCompleted ? <CheckCircle2 size={24} /> : <Target size={24} />}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 leading-tight">{goal.name}</h3>
          <p className="text-xs font-medium text-slate-400 mt-1">Rp {goal.currentAmount.toLocaleString()} / Rp {goal.price.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-1">
        <button onClick={() => onDeposit(goal)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><ArrowUpCircle size={20} /></button>
        <button onClick={() => onEdit(goal)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Edit3 size={18} /></button>
        <button onClick={() => onDelete(goal.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
      </div>
    </div>

    <div className="mt-1">
      {/* use graph ProgressBar */}
      <div className="w-full"><div className="w-full bg-neutral-700 rounded-full overflow-hidden h-2"><div className={`${goal.currentAmount > goal.price ? 'bg-red-500' : 'bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400'} h-full transition-all`} style={{ width: `${Math.max(0, Math.min(100, (goal.currentAmount / Math.max(goal.price, 1)) * 100))}%` }} /></div></div>
    </div>
  </div>
);

const GoalModal: React.FC<{
  activeModal: 'create' | 'deposit' | 'edit' | null;
  formData: { name: string; price: number };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; price: number }>>;
  tempAmount: number;
  setTempAmount: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ activeModal, formData, setFormData, tempAmount, setTempAmount, onClose, onConfirm }) => {
  if (!activeModal) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-800 uppercase italic">
            {activeModal === 'create' && 'Add New Goal'}{activeModal === 'edit' && 'Update Goal'}{activeModal === 'deposit' && 'Add Savings'}
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          {activeModal !== 'deposit' ? (
            <>
              <input type="text" placeholder="Goal Name" value={formData.name} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input type="number" placeholder="Target Price (Rp)" value={formData.price || ''} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all" onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2">Berapa yang ingin kamu tabung?</p>
              <input type="number" autoFocus placeholder="0" className="w-full text-center text-3xl font-black bg-transparent border-b-2 border-blue-500 outline-none p-4" onChange={(e) => setTempAmount(Number(e.target.value))} value={tempAmount || ''} />
            </div>
          )}

          <button onClick={onConfirm} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl mt-4 shadow-xl shadow-slate-200 uppercase tracking-widest active:scale-95 transition-all">Confirm</button>
        </div>
      </div>
    </div>
  );
};

// --- Page (uses local components) ---
const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);
  const [activeModal, setActiveModal] = useState<'create' | 'deposit' | 'edit' | null>(null);
  const [tempAmount, setTempAmount] = useState<number>(0);
  const [formData, setFormData] = useState({ name: '', price: 0 });

  const handleCreate = () => {
    const newGoal: GoalItem = { id: Math.random().toString(36).substring(7), name: formData.name, price: formData.price, currentAmount: 0, isCompleted: false };
    setGoals((g) => [...g, newGoal]);
    setActiveModal(null);
  };

  const handleDeposit = () => {
    if (!selectedGoal) return;
    setGoals((g) => g.map((item) => (item.id === selectedGoal.id ? ({ ...item, currentAmount: item.currentAmount + tempAmount, isCompleted: item.currentAmount + tempAmount >= item.price }) : item)));
    setActiveModal(null);
  };

  const handleUpdate = () => {
    if (!selectedGoal) return;
    setGoals((g) => g.map((it) => (it.id === selectedGoal.id ? { ...it, name: formData.name, price: formData.price } : it)));
    setActiveModal(null);
  };

  const handleDelete = (id: string) => setGoals((g) => g.filter((it) => it.id !== id));

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900">
      <GoalsHeader activeCount={goals.filter((g) => !g.isCompleted).length} onAdd={() => { setFormData({ name: '', price: 0 }); setActiveModal('create'); }} />

      <main className="p-6 space-y-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onDeposit={(g) => { setSelectedGoal(g); setActiveModal('deposit'); }} onEdit={(g) => { setSelectedGoal(g); setFormData({ name: g.name, price: g.price }); setActiveModal('edit'); }} onDelete={handleDelete} />
        ))}
      </main>

      <GoalModal activeModal={activeModal} formData={formData} setFormData={setFormData} tempAmount={tempAmount} setTempAmount={setTempAmount} onClose={() => setActiveModal(null)} onConfirm={activeModal === 'create' ? handleCreate : activeModal === 'edit' ? handleUpdate : handleDeposit} />
    </div>
  );
};

export default GoalsPage;