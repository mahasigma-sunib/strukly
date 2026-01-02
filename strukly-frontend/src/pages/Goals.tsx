import React, { useState } from "react";

import Card from "../components/card/Card";
import Drawer from "../components/drawer/Drawer";
import FlagMascot from "../components/mascots/FlagMascot";
import Popup from "../components/popup/PopUp";

import GoalDrawer from "../components/drawer/GoalDrawer";
import GoalsHeader from "../components/GoalsHeader";
import GoalList from "../components/card/GoalListCard";
import GoalModal from "../components/modal/GoalModal";
import GoalPopup from "../components/popup/GoalPopup";

import type { GoalItem } from "../type/GoalItem";

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);
  const [activeModal, setActiveModal] = useState<
    "create" | "deposit" | "edit" | null
  >(null);
  const [tempAmount, setTempAmount] = useState<number>(0);
  const [formData, setFormData] = useState({ name: "", price: 0 });
  const [errorMessage, setErrorMessage] = useState("");

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);

  const handleCreate = () => {
    if (!formData.name.trim()) {
      setErrorMessage("A goal name must be filled");
      return;
    }

    if (formData.price <= 0) {
      setErrorMessage("Target price must be greater than 0!");
      return;
    }

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

    const remaining = selectedGoal.price - selectedGoal.currentAmount;

    if (tempAmount > remaining) {
      setErrorMessage(
        `The input amount greater than target, Maximal: Rp ${remaining.toLocaleString()}`
      );
      return;
    }

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
    setErrorMessage("");
    setActiveModal(null);
    setTempAmount(0);
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

  const handleDelete = (id: string | undefined) =>
    setGoals((g) => g.filter((it) => it.id !== id));

  const handleOpenUpdate = (goal: GoalItem) => {
    setSelectedGoal(goal);
    setFormData({
      name: goal.name,
      price: goal.price,
    });
    setActiveModal("edit");
  };

  return (
    <div className="min-h-screen pb-20 bg-background text-text-primary">
      <GoalsHeader
        activeCount={goals.filter((g) => !g.isCompleted).length}
        onAdd={() => {
          setFormData({ name: "", price: 0 });
          setActiveModal("create");
        }}
      />

      <main className="ml-5 mr-4 mt-6 space-y-4">
        {goals.length === 0 && (
          <div>
            <div className="mt-6 mb-2 font-bold text-2xl">
              <p>My Goals</p>
            </div>
            <div className="flex flex-col items-center justify-center mt-20 ">
              <FlagMascot width={148} height={148} className="ml-8" />
              <p className="text-inactive mt-4 font-bold text-lg text-center">
                You have no goals yet.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* Active goals */}
          {activeGoals.length > 0 && (
            <div>
              <div className="flex flex-row justify-between items-center">
                <p className="font-bold text-2xl">My Goals</p>
                <p className="text-base px-3 py-1 font-bold text-[#f14c1a] bg-secondary-hover/30 rounded-full ">
                  {activeGoals.length} Active Goals
                </p>
              </div>
              <div className="space-y-4">
                {activeGoals.map((goal, idx) => (
                  <Card
                    key={goal.id}
                    className="mx-0 w-full rounded-2xl p-5 active:bg-slate-100"
                  >
                    <GoalList goal={goal} idx={idx} onHold={setSelectedGoal} />
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Popup
            // visible={!!selectedGoal}
            visible={true}
            onClose={() => setSelectedGoal(null)}
          >
            <GoalPopup></GoalPopup>
          </Popup>

          {/* Completed goals */}
          {completedGoals.length > 0 && (
            <div>
              <div className="flex flex-row justify-between items-center">
                <p className="font-bold text-2xl">Completed</p>
                <p className="text-base font-bold text-[#198010] bg-status-success/10 px-2 py-1 rounded-full">
                  {completedGoals.length} Completed Goals
                </p>
              </div>
              <div className="space-y-4">
                {completedGoals.map((goal) => (
                  <Card key={goal.id} className="mx-0 w-full rounded-2xl p-5">
                    <GoalList goal={goal} idx={null} onHold={setSelectedGoal} />
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

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
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default GoalsPage;
