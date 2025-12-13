import React, { useEffect } from "react";
import AddIcon from "../icons/AddIcon";

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  mascot?: React.ReactNode;
  className?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  visible,
  onClose,
  title,
  children,
  className,
}) => {
  // Prevent scrolling on the body when the drawer is open
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

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-end transition-visibility duration-300 ${
        visible ? `visible` : `invisible`
      }`}
      aria-hidden={!visible}
    >
      {/* click outside to close */}
      <div
        className={`absolute inset-0 bg-[var(--fun-color-text-primary)]/40 transition-opacity duration-300 ${
          visible ? `opacity-100` : `opacity-0`
        }`}
        onClick={onClose}
      />

      {/* drawer */}
      <div
        className={`
          relative w-full max-w-md bg-surface rounded-t-3xl shadow-xl 
          transform transition-transform duration-300 ease-out 
          max-h-[90vh] flex flex-col
          ${visible ? "translate-y-0" : "translate-y-full"}
          ${className}
        `}
      >
        {/* header */}
        {title && (
          <div className="px-6 pt-8 pb-3 flex justify-center">
            <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          </div>
        )}

        {/* content */}
        <div className="px-4 pb-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
