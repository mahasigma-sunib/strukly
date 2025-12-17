import React, { useState } from 'react';

import type { GoalItem } from '../type/GoalsType';
import GoalsHeader from '../components/goals/GoalsHeader';
import GoalCard from '../components/goals/GoalCard';
import GoalModal from '../components/goals/GoalModal';

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
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
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