import React, { useState } from "react";

import type { GoalItem } from "../type/GoalItem";
import GoalsHeader from "../components/GoalsHeader";
import GoalCard from "../components/card/GoalCard";
import GoalModal from "../components/modal/GoalModal";
import FlagMascot from "../components/mascots/FlagMascot";

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);
  const [activeModal, setActiveModal] = useState<
    "create" | "deposit" | "edit" | null
  >(null);
  const [tempAmount, setTempAmount] = useState<number>(0);
  const [formData, setFormData] = useState({ name: "", price: 0 });

  const handleCreate = () => {
    const newGoal: GoalItem = {
      id: Math.random().toString(36).substring(7),
      name: formData.name,
      price: formData.price,
      currentAmount: 0,
      isCompleted: false,
    };
    setGoals((g) => [...g, newGoal]);
    setActiveModal(null);
  };

  const handleDeposit = () => {
    if (!selectedGoal) return;
    setGoals((g) =>
      g.map((item) =>
        item.id === selectedGoal.id
          ? {
              ...item,
              currentAmount: item.currentAmount + tempAmount,
              isCompleted: item.currentAmount + tempAmount >= item.price,
            }
          : item
      )
    );
    setActiveModal(null);
  };

  const handleUpdate = () => {
    if (!selectedGoal) return;
    setGoals((g) =>
      g.map((it) =>
        it.id === selectedGoal.id
          ? { ...it, name: formData.name, price: formData.price }
          : it
      )
    );
    setActiveModal(null);
  };

  const handleDelete = (id: string) =>
    setGoals((g) => g.filter((it) => it.id !== id));

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background pb-24 text-text-primary">
      <GoalsHeader
        activeCount={goals.filter((g) => !g.isCompleted).length}
        onAdd={() => {
          setFormData({ name: "", price: 0 });
          setActiveModal("create");
        }}
      />

      <main className="p-6 space-y-4">
        {goals.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 ">
            <FlagMascot width={148} height={148} className="ml-8" />
            <p className="text-inactive mt-4 font-bold text-lg text-center">
              You have no goals yet.
            </p>
          </div>
        )}

        {goals.map((goal, idx) => (
          <GoalCard
            key={goal.id}
            colorIdx={idx}
            goal={goal}
            onDeposit={(g) => {
              setSelectedGoal(g);
              setActiveModal("deposit");
            }}
            onEdit={(g) => {
              setSelectedGoal(g);
              setFormData({ name: g.name, price: g.price });
              setActiveModal("edit");
            }}
            onDelete={handleDelete}
          />
        ))}
      </main>

      {/* <FlagMascot></FlagMascot> */}

      <GoalModal
        activeModal={activeModal}
        formData={formData}
        setFormData={setFormData}
        tempAmount={tempAmount}
        setTempAmount={setTempAmount}
        onClose={() => setActiveModal(null)}
        onConfirm={
          activeModal === "create"
            ? handleCreate
            : activeModal === "edit"
            ? handleUpdate
            : handleDeposit
        }
      />
    </div>
  );
};

export default GoalsPage;
