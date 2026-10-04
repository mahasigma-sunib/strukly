import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import Popup from "../popup/PopUp";
import Button from "../button/Button";
import CloseIcon from "../utilityIcons/CloseIcon";
import DeleteIcon from "../utilityIcons/DeleteIcon";
import Money from "../money/Money";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { parseDigitAmount } from "../../schema/money";
import {
  formatSplitSummary,
  getRemainingToAssign,
  isSplitBalanced,
  splitEqually,
} from "../../utils/splitBill";

type SplitMode = "equal" | "custom";

type Participant = {
  id: number;
  name: string;
  share: number;
};

let nextParticipantId = 1;

function createParticipant(): Participant {
  return { id: nextParticipantId++, name: "", share: 0 };
}

type SplitBillFormProps = {
  totalAmount: number;
  vendorName: string;
  onClose: () => void;
};

function SplitBillForm({
  totalAmount,
  vendorName,
  onClose,
}: SplitBillFormProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<SplitMode>("equal");
  const [participants, setParticipants] = useState<Participant[]>(() => [
    createParticipant(),
    createParticipant(),
  ]);

  const shares =
    mode === "equal"
      ? splitEqually(totalAmount, participants.length)
      : participants.map((participant) => participant.share);

  const resolvedNames = participants.map(
    (participant, index) =>
      participant.name.trim() ||
      t("splitBill.personDefaultName", { n: index + 1 })
  );

  const remaining = getRemainingToAssign(totalAmount, shares);
  const hasRemainder = totalAmount % participants.length !== 0;
  const canFinish = mode === "equal" || isSplitBalanced(totalAmount, shares);

  const summaryText = formatSplitSummary(
    vendorName,
    totalAmount,
    participants.map((_, index) => ({
      name: resolvedNames[index],
      share: shares[index],
    }))
  );

  const formatShareInput = (value: number) =>
    value === 0 ? "" : value.toLocaleString("id-ID");

  const changeMode = (next: SplitMode) => {
    if (next === mode) return;
    if (next === "custom") {
      const equalShares = splitEqually(totalAmount, participants.length);
      setParticipants((prev) =>
        prev.map((participant, index) => ({
          ...participant,
          share: equalShares[index],
        }))
      );
    }
    setMode(next);
  };

  const addParticipant = () => {
    setParticipants((prev) => [...prev, createParticipant()]);
  };

  const removeParticipant = (id: number) => {
    setParticipants((prev) =>
      prev.length <= 2
        ? prev
        : prev.filter((participant) => participant.id !== id)
    );
  };

  const updateName = (id: number, name: string) => {
    setParticipants((prev) =>
      prev.map((participant) =>
        participant.id === id ? { ...participant, name } : participant
      )
    );
  };

  const updateShare = (id: number, share: number) => {
    setParticipants((prev) =>
      prev.map((participant) =>
        participant.id === id ? { ...participant, share } : participant
      )
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      toast.success(t("splitBill.copySuccess"));
    } catch (err) {
      toast.error(getApiErrorMessage(err, t("splitBill.copyFailed")));
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text-primary">
          {t("splitBill.title")}
        </h2>
        <div onClick={onClose} className="text-slate-500 cursor-pointer">
          <CloseIcon width={24} height={24} />
        </div>
      </div>

      <div className="flex justify-between items-center gap-3 min-w-0 mb-6">
        <span className="text-sm font-bold text-gray-400 shrink-0">
          {t("splitBill.billTotal")}
        </span>
        <Money
          amount={totalAmount}
          currency="IDR"
          mainClassName="font-bold"
          decimalClassName="font-bold opacity-70"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={mode === "equal" ? "primary" : "outline"}
          size="sm"
          className="flex-1"
          onClick={() => changeMode("equal")}
        >
          {t("splitBill.modeEqual")}
        </Button>
        <Button
          variant={mode === "custom" ? "primary" : "outline"}
          size="sm"
          className="flex-1"
          onClick={() => changeMode("custom")}
        >
          {t("splitBill.modeCustom")}
        </Button>
      </div>

      <div className="flex justify-end mb-2">
        <span className="text-sm font-bold text-gray-400">
          {t("splitBill.share")}
        </span>
      </div>

      <div className="space-y-3 mb-3">
        {participants.map((participant, index) => (
          <div key={participant.id} className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={participant.name}
              placeholder={t("splitBill.namePlaceholder")}
              className="flex-1 min-w-0 bg-background border-2 border-border rounded-2xl px-3 py-2 text-base outline-none focus:border-primary transition-all"
              onChange={(e) => updateName(participant.id, e.target.value)}
            />
            {mode === "equal" ? (
              <Money
                amount={shares[index]}
                currency="IDR"
                className="shrink-0"
                decimalClassName="opacity-70"
              />
            ) : (
              <div className="relative w-28 shrink-0">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  aria-label={t("splitBill.share")}
                  placeholder="0"
                  value={formatShareInput(participant.share)}
                  className="w-full text-right border border-gray-300 rounded-lg pl-7 pr-2 py-2 font-bold outline-none overflow-hidden"
                  onChange={(e) =>
                    updateShare(participant.id, parseDigitAmount(e.target.value))
                  }
                />
              </div>
            )}
            <button
              type="button"
              aria-label={t("splitBill.removePerson")}
              disabled={participants.length <= 2}
              onClick={() => removeParticipant(participant.id)}
              className={`shrink-0 p-1 rounded-xl text-red-500 transition-opacity ${
                participants.length <= 2
                  ? "opacity-30 cursor-not-allowed"
                  : "cursor-pointer active:bg-gray-100"
              }`}
            >
              <DeleteIcon width={20} height={20} />
            </button>
          </div>
        ))}
      </div>

      {mode === "equal" && hasRemainder && (
        <p className="text-xs text-gray-400 mb-3">{t("splitBill.remainderHint")}</p>
      )}

      {mode === "custom" && (
        <div className="flex justify-between items-center gap-3 min-w-0 mb-3 text-sm">
          <span className="text-gray-500">{t("splitBill.remaining")}</span>
          <Money amount={remaining} currency="IDR" decimalClassName="opacity-70" />
        </div>
      )}

      <Button
        variant="text"
        size="sm"
        className="w-full flex items-center justify-center gap-2 mb-4"
        onClick={addParticipant}
      >
        <PlusIcon className="w-4 h-4" />
        {t("splitBill.addPerson")}
      </Button>

      <div className="rounded-2xl border border-gray-200 p-4 mb-6 space-y-2">
        <p className="text-sm font-bold text-gray-400">{t("splitBill.summary")}</p>
        {participants.map((participant, index) => (
          <div
            key={participant.id}
            className="flex justify-between items-center gap-3 text-sm min-w-0"
          >
            <span className="truncate text-gray-600">
              {resolvedNames[index]}
            </span>
            <Money
              amount={shares[index]}
              currency="IDR"
              className="shrink-0"
              decimalClassName="opacity-70"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-3">
        <Button
          variant="outline"
          size="md"
          className="w-full"
          onClick={handleCopy}
        >
          {t("splitBill.copySummary")}
        </Button>

        <Button
          variant="primary"
          size="md"
          className="w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0"
          disabled={!canFinish}
          onClick={onClose}
        >
          {t("common.done")}
        </Button>
      </div>
    </div>
  );
}

type SplitBillModalProps = {
  visible: boolean;
  totalAmount: number;
  vendorName: string;
  onClose: () => void;
};

function SplitBillModal({
  visible,
  totalAmount,
  vendorName,
  onClose,
}: SplitBillModalProps) {
  return (
    <Popup
      visible={visible}
      onClose={onClose}
      className="max-h-[85vh] overflow-y-auto"
    >
      <SplitBillForm
        totalAmount={totalAmount}
        vendorName={vendorName}
        onClose={onClose}
      />
    </Popup>
  );
}

export default SplitBillModal;
