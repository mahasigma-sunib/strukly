// Page.tsx
import BudgetProgressCard from '../components/progressbar/BudgetProgressBar';

export default function BudgetPage() {
  return (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BudgetProgressCard
            title="Current Budget!"
            month={1}
            year={2024}
            budget={1000000}
            unusedBudget={1000000}
          />
          
        </div>
      
  );
}