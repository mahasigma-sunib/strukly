import React, { useState, useRef } from "react";
import { ArrowUpCircle } from "lucide-react";

import Card from "../components/card/Card";
import GoalsHeader from "../components/GoalsHeader";
import ProgressBar from "../components/graph/ProgressBar";
import GoalModal from "../components/modal/GoalModal";
import FlagMascot from "../components/mascots/FlagMascot";

import FlagIcon from "../components/utilityIcons/FlagIcon";
import EditIcon from "../components/utilityIcons/EditIcon";
import DeleteIcon from "../components/utilityIcons/DeleteIcon";
import CheckIcon from "../components/utilityIcons/CheckIcon";

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
    }, 600);
  };

  const clearEditTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);

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
                  <div
                    onMouseDown={(e) => {
                      if ((e.target as HTMLElement).closest("button")) return;
                      startEditTimer(goal);
                    }}
                    onMouseUp={clearEditTimer}
                    onMouseLeave={clearEditTimer}
                    onTouchStart={(e) => {
                      const touchTarget = e.target as HTMLElement;
                      if (touchTarget.closest("button")) return;
                      startEditTimer(goal);
                    }}
                    onTouchEnd={clearEditTimer}
                  >
                    <Card
                      key={goal.id}
                      className="mx-0 w-full rounded-2xl p-5 active:bg-slate-100"
                    >
                      <div className="flex justify-between w-full items-start mb-4">
                        <div className="flex flex-row gap-2 items-center w-full">
                          <div className="mx-2 rounded-2xl flex items-center justify-center">
                            <FlagIcon
                              width={44}
                              height={44}
                              className={`text-${
                                colors[idx % colors.length]
                              }-500 -rotate-20`}
                            />
                          </div>
                          <div className="flex flex-col gap-1 flex-1">
                            <p className="text-xl font-bold text-text-primary">
                              {goal.name}
                            </p>

                            <div className="flex flex-row w-full justify-between items-center">
                              <p className="text-lg font-semibold text-inactive">
                                {(() => {
                                  const progress =
                                    (goal.currentAmount / goal.price) * 100;
                                  if (progress >= 75)
                                    return <span>You're almost there!</span>;
                                  else if (progress >= 50 && progress < 75)
                                    return <span>Halfway done, nice!</span>;
                                  else if (progress >= 25 && progress < 50)
                                    return <span>Let's keep it up!</span>;
                                  else if (progress < 25 && progress >= 0)
                                    return <span>Let's get started!</span>;
                                })()}
                              </p>

                              <p className="text-lg font-bold text-text-disabled/90 mr-1">
                                {Math.ceil(
                                  (goal.currentAmount / goal.price) * 100
                                )}
                                %
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-1 ">
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
                              setFormData({
                                name: goal.name,
                                price: goal.price,
                              });
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

                      <ProgressBar
                        value={goal.currentAmount}
                        max={goal.price}
                        height={12}
                        barColor="bg-category-transportation"
                      />

                      <div className="mt-4 flex flex-row justify-between items-center">
                        <p className="font-bold text-base text-text-disabled/70">
                          Rp {goal.currentAmount.toLocaleString()}
                        </p>
                        <p className="font-bold text-base text-text-disabled/70">
                          Rp {goal.price.toLocaleString()}
                        </p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                {completedGoals.map((goal, idx) => (
                  <div
                    onMouseDown={(e) => {
                      if ((e.target as HTMLElement).closest("button")) return;
                      startEditTimer(goal);
                    }}
                    onMouseUp={clearEditTimer}
                    onMouseLeave={clearEditTimer}
                    onTouchStart={(e) => {
                      const touchTarget = e.target as HTMLElement;
                      if (touchTarget.closest("button")) return;
                      startEditTimer(goal);
                    }}
                    onTouchEnd={clearEditTimer}
                  >
                    <Card key={goal.id} className="mx-0 w-full rounded-2xl p-5">
                      <div className="flex justify-between w-full items-start mb-4">
                        <div className="flex flex-row gap-2 items-center w-full">
                          <div className="mx-2 rounded-2xl flex items-center justify-center">
                            <CheckIcon
                              width={40}
                              height={40}
                              className="mx-1"
                            />
                          </div>
                          <div className="flex flex-col gap-1 flex-1">
                            <p className="text-xl font-bold text-text-primary">
                              {goal.name}
                            </p>

                            <div className="flex flex-row w-full justify-between items-center">
                              <p className="text-lg font-semibold text-inactive">
                                Goals reached!
                              </p>

                              <p className="text-lg font-bold text-text-disabled/90 mr-1">
                                {Math.ceil(
                                  (goal.currentAmount / goal.price) * 100
                                )}
                                %
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-1 hidden">
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
                              setFormData({
                                name: goal.name,
                                price: goal.price,
                              });
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

                      <ProgressBar
                        value={goal.currentAmount}
                        max={goal.price}
                        height={12}
                        barColor="bg-status-success"
                      />

                      <div className="mt-4 flex flex-row justify-between items-center">
                        <p className="font-bold text-base text-text-disabled/70">
                          Rp {goal.currentAmount.toLocaleString()}
                        </p>
                        <p className="font-bold text-base text-text-disabled/70">
                          Rp {goal.price.toLocaleString()}
                        </p>
                      </div>
                    </Card>
                  </div>
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
