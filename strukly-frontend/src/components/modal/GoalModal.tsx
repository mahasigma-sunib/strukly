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
                className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-primary outline-none transition-all ${
                  errorMessage && !formData.name
                    ? "border-red-500"
                    : "border-slate-100 focus:border-primary"
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
                className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-primary outline-none transition-all ${
                  errorMessage && !formData.price
                    ? "border-red-500"
                    : "border-slate-100 focus:border-primary"
                }`}
                onChange={(e) => {
                  if (errorMessage) setErrorMessage("");
                  setFormData({ ...formData, price: Number(e.target.value) });
                }}
              />
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-2xl animate-in slide-in-from-top-2 duration-200">
                  <p className="text-xs font-bold text-red-500 text-center">
                    ⚠️ {errorMessage}
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
                className={`w-full text-center text-3xl font-black bg-transparent border-b-2 border-blue-500 outline-none p-4 ${
                  errorMessage
                    ? "border-red-500 text-red-500"
                    : "border-blue-500 text-text-primary"
                }`}
                onChange={(e) => {
                  setErrorMessage("");
                  setTempAmount(Number(e.target.value));
                }}
                value={tempAmount || ""}
              />
              {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-2xl animate-in slide-in-from-top-2 duration-200">
                  <p className="text-xs font-bold text-red-500 leading-relaxed">
                    ⚠️ {errorMessage}
                  </p>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={onConfirm}
            className="w-full text-surface font-black active:scale-95 transition-all "
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
