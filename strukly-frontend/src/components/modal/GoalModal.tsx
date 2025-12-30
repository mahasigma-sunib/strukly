import React from "react";
import CloseIcon from "../utilityIcons/CloseIcon";
import Button from "../button/Button";

type ModalMode = "create" | "deposit" | "edit" | null;

interface Props {
  activeModal: ModalMode;
  formData: { name: string; price: number };
  setFormData: React.Dispatch<
    React.SetStateAction<{ name: string; price: number }>
  >;
  tempAmount: number;
  setTempAmount: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
  onConfirm: () => void;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
}

const GoalModal: React.FC<Props> = ({
  activeModal,
  formData,
  setFormData,
  tempAmount,
  setTempAmount,
  onClose,
  onConfirm,
  errorMessage,
  setErrorMessage,
}) => {
  if (!activeModal) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-text-primary ">
            {activeModal === "create" && "Add New Goal"}
            {activeModal === "edit" && "Update Goal"}
            {activeModal === "deposit" && "Add Savings"}
          </h2>
          <button onClick={onClose} className="text-slate-500">
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <div className="space-y-4">
          {activeModal !== "deposit" ? (
            <>
              <input
                type="text"
                placeholder="Goal Name"
                value={formData.name}
                className={`w-full bg-background border-2 rounded-2xl p-4 focus:border-primary outline-none transition-all ${
                  errorMessage && !formData.name.trim()
                    ? "border-status-error "
                    : "border-border focus:border-primary"
                }`}
                onChange={(e) => {
                  if (errorMessage) setErrorMessage("");
                  setFormData({ ...formData, name: e.target.value });
                }}
              />
              <input
                type="number"
                placeholder="Target Price (Rp)"
                value={formData.price || ""}
                className={`w-full bg-background border-2 rounded-2xl p-4 focus:border-primary outline-none transition-all ${
                  errorMessage && formData.price <= 0
                    ? "border-status-error "
                    : "border-border focus:border-primary"
                }`}
                onChange={(e) => {
                  if (errorMessage) setErrorMessage("");
                  setFormData({ ...formData, price: Number(e.target.value) });
                }}
              />
              {errorMessage && (
                <div className="w-full bg-status-error/10 border border-status-error/20 p-3 rounded-2xl flex justify-center items-center gap-3 animate-in zoom-in-95 duration-300">
                  <div className="bg-status-error text-white rounded-full p-2 h-5 w-5 flex items-center justify-center text-sm font-bold">
                    !
                  </div>
                  <p className="text-status-error text-base font-semibold">
                    {errorMessage}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2">Input nominal</p>
              <input
                type="number"
                autoFocus
                placeholder="0"
                className={`w-full text-center text-2xl font-extrabold bg-transparent border-b-2  outline-none p-4  ${
                  errorMessage
                    ? "border-status-error focus:border-status-error"
                    : "border-text-disabled focus:border-primary text-text-primary"
                }`}
                onChange={(e) => {
                  setErrorMessage("");
                  setTempAmount(Number(e.target.value));
                }}
                value={tempAmount || ""}
              />
              {errorMessage && (
                <div className="mt-5 w-full bg-status-error/10 border border-status-error/20 p-3 rounded-2xl flex justify-center items-center gap-3 animate-in zoom-in-95 duration-300">
                  <div className="bg-status-error text-white rounded-full p-2 h-5 w-5 flex items-center justify-center text-sm font-bold">
                    !
                  </div>
                  <p className="text-status-error text-base font-semibold">
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={onConfirm}
            className="w-full text-surface text-base font-black active:scale-95 transition-all "
            variant="primary"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalModal;
