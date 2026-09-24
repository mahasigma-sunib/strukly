import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { mutate } from "swr";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

import useGoals from "../store/GoalsStore";
import { mapGoal, useLoadGoals } from "../hooks/useLoadGoals";
import type { GoalItem } from "../type/GoalItem";
import type { CategoryKey } from "../utils/CategoryConfig";

import Card from "../components/card/Card";
import FlagMascot from "../components/mascots/FlagMascot";
import LoadErrorPlaceholder from "../components/placeholder/LoadErrorPlaceholder";
import Popup from "../components/popup/PopUp";

import GoalsHeader from "../components/GoalsHeader";
import GoalList from "../components/card/GoalListCard";
import GoalModal from "../components/modal/GoalModal";
import GoalPopup from "../components/popup/GoalPopUp";

const GoalsPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);
  const [activeModal, setActiveModal] = useState<
    "create" | "deposit" | "edit" | "delete" | null
  >(null);
  const [tempAmount, setTempAmount] = useState<number>(0);
  const [formData, setFormData] = useState<{
    name: string;
    price: number;
    category: CategoryKey;
  }>({ name: "", price: 0, category: "others" });
  const [errorMessage, setErrorMessage] = useState("");

  const { error: goalsLoadError, isLoading: goalsIsLoading } = useLoadGoals();

  useEffect(() => {
    if (goalsLoadError) {
      toast.error(t("goals.loadFailed"), {
        id: "goals-load-error",
      });
    }
  }, [goalsLoadError, t]);
  const {
    items: goals,
    addGoal,
    depositGoal,
    updateGoal,
    deleteGoal,
  } = useGoals();

  const pendingGoalId = location.state?.selectedGoalId as string | undefined;

  useEffect(() => {
    if (!pendingGoalId || goalsIsLoading) return;
    setSelectedGoal(goals.find((g) => g.id === pendingGoalId) ?? null);
    navigate(location.pathname, { replace: true, state: null });
  }, [pendingGoalId, goals, goalsIsLoading, navigate, location.pathname]);

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);

  const emptyForm = {
    name: "",
    price: 0,
    category: "others" as CategoryKey,
  };

  const refreshSpending = async () => {
    const api = import.meta.env.VITE_API_BASE_URL;
    const now = new Date();
    await Promise.all([
      mutate(`${api}/budget`),
      mutate(
        `${api}/expenses?month=${now.getMonth() + 1}&year=${now.getFullYear()}`
      ),
    ]);
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      setErrorMessage(t("goals.nameRequired"));
      return;
    }

    if (formData.name.length > 250) {
      setErrorMessage(t("goals.nameTooLong"));
      return;
    }

    if (formData.price <= 0) {
      setErrorMessage(t("goals.priceRequired"));
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/goals`,
        {
          name: formData.name,
          price: formData.price,
          category: formData.category,
        },
        { withCredentials: true }
      );

      addGoal(mapGoal(res.data.goal));
      setErrorMessage("");
      setActiveModal(null);
      setFormData(emptyForm);
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err, t("goals.createFailed")));
    }
  };

  const handleDeposit = async () => {
    if (!selectedGoal) return;

    if (tempAmount <= 0) {
      setErrorMessage(t("goals.depositAmount"));
      return;
    }

    const remaining = selectedGoal.price - selectedGoal.deposit;

    if (tempAmount > remaining) {
      setErrorMessage(
        t("goals.depositTooMuch", { max: remaining.toLocaleString() })
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
      await refreshSpending();
      setErrorMessage("");
      setActiveModal(null);
      setSelectedGoal(null);
      setTempAmount(0);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, t("goals.depositFailed")));
    }
  };

  const handleUpdate = async () => {
    if (!selectedGoal) return;

    if (!formData.name.trim()) {
      setErrorMessage(t("goals.nameRequired"));
      return;
    }

    if (formData.price < selectedGoal.deposit) {
      setErrorMessage(t("goals.priceTooLow"));
      return;
    }

    if (formData.price <= 0) {
      setErrorMessage(t("goals.priceRequired"));
      return;
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/goals/${selectedGoal.id}`,
        {
          name: formData.name,
          price: formData.price,
          category: formData.category,
        },
        { withCredentials: true }
      );
      updateGoal(
        selectedGoal.id,
        formData.name,
        formData.price,
        formData.category
      );
      setErrorMessage("");
      setActiveModal(null);
      setSelectedGoal(null);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, t("goals.updateFailed")));
    }
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
      toast.error(getApiErrorMessage(error, t("goals.deleteFailed")));
      return;
    }
    setActiveModal(null);
    setSelectedGoal(null);
  };

  return (
    <div className="min-h-screen pb-20 bg-background text-text-primary">
      <GoalsHeader
        activeCount={goals.filter((g) => !g.isCompleted).length}
        onAdd={() => {
          setFormData(emptyForm);
          setActiveModal("create");
        }}
      />

      <main className=" mt-6 space-y-4">
        {goals.length === 0 && !goalsIsLoading && (
          <div>
            <div className="ml-5 mr-4 mt-6 mb-2 font-bold text-2xl">
              <p>{t("goals.myGoals")}</p>
            </div>
            {goalsLoadError ? (
              <LoadErrorPlaceholder
                title={t("goals.loadError")}
                onRetry={() =>
                  mutate(`${import.meta.env.VITE_API_BASE_URL}/goals`)
                }
              />
            ) : (
              <div className="flex flex-col items-center justify-center mt-20 ">
                <FlagMascot width={148} height={148} className="ml-8" />
                <p className="text-inactive mt-4 font-bold text-lg text-center">
                  {t("goals.noGoals")}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* Active goals */}
          {activeGoals.length > 0 && (
            <div>
              <div className="flex flex-row justify-between items-center">
                <p className="font-bold text-2xl ml-5 mr-4">
                  {t("goals.myGoals")}
                </p>
                <p className="ml-5 mr-4 text-base px-3 py-1 font-bold text-[#f14c1a] bg-secondary-hover/30 rounded-full ">
                  {t("goals.activeCount", { count: activeGoals.length })}
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
                <p className="ml-5 mr-4 font-bold text-2xl">
                  {t("goals.completed")}
                </p>
                <p className="ml-5 mr-4 text-base font-bold text-[#198010] bg-status-success/10 px-2 py-1 rounded-full">
                  {t("goals.completedCount", { count: completedGoals.length })}
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
                  category: selectedGoal!.category,
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
