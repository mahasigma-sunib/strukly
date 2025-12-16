import React from 'react';
import { Target, CheckCircle2, ArrowUpCircle, Edit3, Trash2 } from 'lucide-react';
import type { GoalItem } from './types';
import ProgressBar from './ProgressBar';

interface Props {
  goal: GoalItem;
  onDeposit: (goal: GoalItem) => void;
  onEdit: (goal: GoalItem) => void;
  onDelete: (id: string) => void;
}

const GoalCard: React.FC<Props> = ({ goal, onDeposit, onEdit, onDelete }) => {
  const progress = Math.min((goal.currentAmount / Math.max(goal.price, 1)) * 100, 100);

  return (
    <div
      key={goal.id}
      className={`bg-white rounded-[24px] p-5 shadow-sm border ${
        goal.isCompleted ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              goal.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'
            }`}
          >
            {goal.isCompleted ? <CheckCircle2 size={24} /> : <Target size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-tight">{goal.name}</h3>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Rp {goal.currentAmount.toLocaleString()} / Rp {goal.price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onDeposit(goal)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <ArrowUpCircle size={20} />
          </button>
          <button
            onClick={() => onEdit(goal)}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"
          >
            <Edit3 size={18} />
          </button>
          <button onClick={() => onDelete(goal.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <ProgressBar percent={progress} completed={goal.isCompleted} />
    </div>
  );
};

export default GoalCard;
