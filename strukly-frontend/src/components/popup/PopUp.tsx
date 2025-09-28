import React from "react";

type PopupProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Popup: React.FC<PopupProps> = ({ visible, onClose, children }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
      <div className="relative bg-[#242323] px-8 pt-[60px] pb-10 rounded-2xl shadow-lg flex flex-col items-center text-center gap-4">
        <button
          className="absolute top-0 -right-2 text-gray-300 !bg-transparent !text-2xl cursor-pointer z-[1001] hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popup;
