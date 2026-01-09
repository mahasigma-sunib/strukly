import React, { useState } from "react";
import axios from "axios";

import useGoals from "../store/GoalsStore";
import { useLoadGoals } from "../hooks/useLoadGoals";
import type { GoalItem } from "../type/GoalItem";

import Card from "../components/card/Card";
import FlagMascot from "../components/mascots/FlagMascot";
import Popup from "../components/popup/PopUp";

import GoalsHeader from "../components/GoalsHeader";
import GoalList from "../components/card/GoalListCard";
import GoalModal from "../components/modal/GoalModal";
import GoalPopup from "../components/popup/GoalPopUp";

const GoalsPage: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);
  const [activeModal, setActiveModal] = useState<
    "create" | "deposit" | "edit" | "delete" | null
  >(null);
  const [tempAmount, setTempAmount] = useState<number>(0);
  const [formData, setFormData] = useState({ name: "", price: 0 });
  const [errorMessage, setErrorMessage] = useState("");

  useLoadGoals();
  const {
    items: goals,
    addGoal,
    depositGoal,
    updateGoal,
    deleteGoal,
  } = useGoals();

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      setErrorMessage("A goal name must be filled");
      return;
    }

    if (formData.name.length > 250) {
      setErrorMessage(
        "A goal name must be less than or equal to 250 characters"
      );
      return;
    }

    if (formData.price <= 0) {
      setErrorMessage("Target price must be greater than 0!");
      return;
    }

    const newGoal: GoalItem = {
      id: "",
      name: formData.name,
      price: formData.price,
      deposit: 0, //deposited
      isCompleted: false,
      createdAt: new Date(),
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/goals`,
        newGoal,
        { withCredentials: true }
      );

      newGoal.id = res.data.goal.id;
      newGoal.createdAt = res.data.goal.createdAt;
      addGoal(newGoal);
    } catch (err) {
      console.log(err);
    }

    setActiveModal(null);
  };

  const handleDeposit = async () => {
    if (!selectedGoal) return;

    if (tempAmount <= 0) {
      setErrorMessage(`The input amount must be greater than zero!`);
      return;
    }

    const remaining = selectedGoal.price - selectedGoal.deposit;

    if (tempAmount > remaining) {
      setErrorMessage(
        `The input amount greater than target, Maximal: Rp ${remaining.toLocaleString()}`
      );
      return;
    }

    const isComplete = tempAmount === remaining ? true : false;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/goals/deposit/${selectedGoal.id}`,
        { amount: tempAmount },
        { withCredentials: true }
      );
      if (isComplete) {
        await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/goals/complete/${
            selectedGoal.id
          }`,
          {},
          { withCredentials: true }
        );
      }
      depositGoal(selectedGoal.id, tempAmount, isComplete);
    } catch (error) {
      console.log(error);
    }

    setErrorMessage("");
    setActiveModal(null);
    setSelectedGoal(null);
    setTempAmount(0);
  };

  const handleUpdate = async () => {
    if (!selectedGoal) return;

    if (!formData.name.trim()) {
      setErrorMessage("A goal name must be filled");
      return;
    }

    if (formData.price < selectedGoal.deposit) {
      setErrorMessage("New goal price must be less than current amount!");
      return;
    }

    if (formData.price <= 0) {
      setErrorMessage("Target price must be greater than 0!");
      return;
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/goals/${selectedGoal.id}`,
        { name: formData.name, price: formData.price },
        { withCredentials: true }
      );
      updateGoal(selectedGoal.id, formData.name, formData.price);
    } catch (error) {
      console.log(error);
    }

    setErrorMessage("");
    setActiveModal(null);
    setSelectedGoal(null);
  };

  const handleDelete = async () => {
    if (!selectedGoal) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/goals/${selectedGoal.id}`,
        { withCredentials: true }
      );
      deleteGoal(selectedGoal.id);
    } catch (error) {
      console.log(error);
    }
    setActiveModal(null);
    setSelectedGoal(null);
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

      <main className=" mt-6 space-y-4">
        {goals.length === 0 && (
          <div>
            <div className="ml-5 mr-4 mt-6 mb-2 font-bold text-2xl">
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
                <p className="font-bold text-2xl ml-5 mr-4">My Goals</p>
                <p className="ml-5 mr-4 text-base px-3 py-1 font-bold text-[#f14c1a] bg-secondary-hover/30 rounded-full ">
                  {activeGoals.length} Active Goals
                </p>
              </div>

              <div className="space-y-4">
                {activeGoals.map((goal, idx) => (
                  <Card
                    key={goal.id}
                    // className="mx-0 w-full rounded-2xl p-5 active:bg-slate-100"
                  >
                    <GoalList goal={goal} idx={idx} onHold={setSelectedGoal} />
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed goals */}
          {completedGoals.length > 0 && (
            <div>
              <div className="flex flex-row justify-between items-center">
                <p className="ml-5 mr-4 font-bold text-2xl">Completed</p>
                <p className="ml-5 mr-4 text-base font-bold text-[#198010] bg-status-success/10 px-2 py-1 rounded-full">
                  {completedGoals.length} Completed Goals
                </p>
              </div>
              <div className="space-y-4">
                {completedGoals.map((goal) => (
                  <Card key={goal.id}>
                    <GoalList goal={goal} idx={null} onHold={setSelectedGoal} />
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Popup
            visible={!!selectedGoal && !activeModal}
            onClose={() => setSelectedGoal(null)}
          >
            <GoalPopup
              goalName={selectedGoal?.name}
              onAddSaving={() => setActiveModal("deposit")}
              onEdit={() => {
                setFormData({
                  name: selectedGoal!.name,
                  price: selectedGoal!.price,
                });
                setActiveModal("edit");
              }}
              onDelete={() => setActiveModal("delete")}
              onClose={() => {
                setActiveModal(null);
                setErrorMessage("");
                setSelectedGoal(null);
              }}
            />
          </Popup>
        </div>
      </main>

      <GoalModal
        activeModal={activeModal}
        formData={formData}
        setFormData={setFormData}
        tempAmount={tempAmount}
        setTempAmount={setTempAmount}
        onClose={() => {
          setActiveModal(null);
          setErrorMessage("");
        }}
        onConfirm={
          activeModal === "create"
            ? handleCreate
            : activeModal === "edit"
            ? handleUpdate
            : activeModal === "deposit"
            ? handleDeposit
            : handleDelete
        }
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default GoalsPage;
