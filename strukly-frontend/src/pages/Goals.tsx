import React, { useState, useRef } from "react";

import type { GoalItem } from "../type/GoalItem";
import GoalsHeader from "../components/GoalsHeader";
import Card from "../components/card/card";
import ProgressBar from "../components/graph/ProgressBar";
import GoalModal from "../components/modal/GoalModal";
import FlagMascot from "../components/mascots/FlagMascot";
import FlagIcon from "../components/utilityIcons/FlagIcon";
import EditIcon from "../components/utilityIcons/EditIcon";
import DeleteIcon from "../components/utilityIcons/DeleteIcon";
import { CheckCircle2, ArrowUpCircle } from "lucide-react";

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

  const timerRef = useRef<number | null>(null);
  const colors = ["red", "blue", "green", "yellow", "purple"];

  const startEditTimer = (g: GoalItem) => {
    timerRef.current = window.setTimeout(() => {
      setSelectedGoal(g);
      setFormData({ name: g.name, price: g.price });
      setActiveModal("edit");
      if (navigator.vibrate) navigator.vibrate(50);
    }, 800);
  };

  const clearEditTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background text-text-primary">
      <GoalsHeader
        activeCount={goals.filter((g) => !g.isCompleted).length}
        onAdd={() => {
          setFormData({ name: "", price: 0 });
          setActiveModal("create");
        }}
      />

      <main className="p-5 mt-28 space-y-4">
        <p className="text-2xl font-bold">My Goals</p>
        {goals.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 ">
            <FlagMascot width={148} height={148} className="ml-8" />
            <p className="text-inactive mt-4 font-bold text-lg text-center">
              You have no goals yet.
            </p>
          </div>
        )}


        {goals.map((goal, idx) => (
          <Card
            key={goal.id}
            className={`m-0 bg-white rounded-[24px] p-5 shadow-sm border ${
              goal.isCompleted ? "border-emerald-100 bg-emerald-50/30" : "border-slate-100"
            }`}
            onMouseDown={() => startEditTimer(goal)}
            onMouseUp={clearEditTimer}
            onMouseLeave={clearEditTimer}
            onTouchStart={() => startEditTimer(goal)}
            onTouchEnd={clearEditTimer}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    goal.isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {goal.isCompleted ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <FlagIcon
                      width={32}
                      className={`text-${colors[idx % colors.length]}-500`}
                    />
                  )}
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
                  onClick={() => {
                    setSelectedGoal(goal);
                    setActiveModal("deposit");
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <ArrowUpCircle size={20} />
                </button>
                <button
                  onClick={() => {
                    setSelectedGoal(goal);
                    setFormData({ name: goal.name, price: goal.price });
                    setActiveModal("edit");
                  }}
                  className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"
                >
                  <EditIcon width={20} height={20} />
                </button>
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                >
                  <DeleteIcon width={20} height={30} />
                </button>
              </div>
            </div>

            <ProgressBar value={goal.currentAmount} max={goal.price} height={8} />
          </Card>
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
