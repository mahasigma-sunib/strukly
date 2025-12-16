// BudgetProgressCard.tsx (Component)

// {
//   "month": 0,
//   "year": 0,
//   "budget": 0,
//   "unusedBudget": 0
// }

interface BudgetProgressCardProps {
  title: string; 
  month: number;
  year: number;
  budget: number;
  unusedBudget: number;
  showDemo?: boolean;
  unusedBudgetChange?: (value: number) => void;
}

export default function BudgetProgressCard({ 
  title,
  month,
//   year,
  budget, 
  unusedBudget,
  showDemo,
  unusedBudgetChange
}: BudgetProgressCardProps) {
  const percentage = (unusedBudget / budget) * 100;

  const getColor = () => {
    if (percentage < 50) return 'bg-[var-(--fun-color-category-housebills)]';
    if (percentage < 70) return 'bg-[var-(--fun-color-orange)]';
    if (percentage < 85) return 'bg-[var-(--fun-color-yellow)]';
    return 'bg-[var(--fun-color-category-groceries)]';
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Terpakai</span>
          <span className="font-semibold">{formatRupiah(unusedBudget)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Budget</span>
          <span className="font-semibold">{formatRupiah(budget)}</span>
        </div>
      </div>

      <div className="relative">
        <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getColor()} relative`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-800 drop-shadow-md">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        Sisa: <span className="font-semibold">{formatRupiah(budget - unusedBudget)}</span>
      </div>

      {showDemo && unusedBudgetChange && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-3">Demo - Atur pengeluaran:</p>
          <input
            type="range"
            min="0"
            max={budget}
            value={unusedBudget}
            onChange={(e) => unusedBudgetChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      <div className="w-full max-w-md p-6">
        <p className="font-bold text-gray-800">Bulan : {month}</p>
    </div>

    </div>
  );
}