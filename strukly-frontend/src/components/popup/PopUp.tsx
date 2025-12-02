import React from "react";
import { useEffect } from "react";

type PopupProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

const Popup: React.FC<PopupProps> = ({
  visible,
  onClose,
  children,
  className = "",
}) => {
  // prevent scrolling on the body when popup is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--fun-color-text-primary)]/40 backdrop-blur-sm p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className={`
          relative w-full max-w-md transform rounded-3xl bg-[var(--fun-color-background)] p-6 text-left shadow-2xl 
          transition-all animate-in fade-in zoom-in-95 duration-200
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Popup;
