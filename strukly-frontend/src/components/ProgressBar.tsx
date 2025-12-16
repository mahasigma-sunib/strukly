import React from 'react';

interface Props {
  percent: number;
  completed?: boolean;
}

const ProgressBar: React.FC<Props> = ({ percent, completed = false }) => {
  return (
    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-700 ease-out ${completed ? 'bg-emerald-500' : 'bg-blue-500'}`}
        style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
      />
    </div>
  );
};

export default ProgressBar;
