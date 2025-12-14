import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BudgetIconOutline from "./icons/BudgetIconOutline";
import BudgetIconFilled from "./icons/BudgetIconFilled";
import GoalsIconOutline from "./icons/GoalsIconOutline";
import GoalsIconFilled from "./icons/GoalsIconFilled";
import HomeIconOutline from "./icons/HomeIconOutline";
import HomeIconFilled from "./icons/HomeIconFilled";
import ExpenseIconFilled from "./icons/ExpenseIconFilled";
import ExpenseIconOutline from "./icons/ExpenseIconOutline";
import AddIcon from "./icons/AddIcon";
import Drawer from "./drawer/Drawer";
import SquareButton from "./button/SquareButton";

import CameraIcon from "./utilityIcons/CameraIcon";
import GalleryIcon from "./utilityIcons/GalleryIcon";
import ManualWriteIcon from "./utilityIcons/ManualWriteIcon";
import CloseIcon from "./utilityIcons/CloseIcon";

interface NavLinkProps {
  to: string;
  label: string;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
}

function NavLink({ to, label, activeIcon, inactiveIcon }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-1 transition-all duration-200"
    >
      {/* Icon container */}
      <div
        className={`flex items-center justify-center transition-all duration-300
          ${isActive ? "text-active" : "text-inactive"}
        `}
      >
        {isActive ? activeIcon : inactiveIcon}
      </div>

      <span
        className={`text-xs ${
          isActive ? "text-active font-bold" : "text-inactive font-bold"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

export default function MobileNavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const handleAddBtn = (target: string) => {
    setIsDrawerOpen(false);
    navigate(`/expense/${target}`);
  };

  return (
    <nav className="rounded-t-3xl fixed bottom-0 left-0 right-0 grid grid-cols-5 items-center h-16 bg-white z-50 shadow-[0_0_20px_5px_rgba(0,0,0,0.02)] pl-1 pr-1">
      <NavLink
        to="/home"
        label="Home"
        activeIcon={<HomeIconFilled width={24} height={24} />}
        inactiveIcon={<HomeIconOutline width={24} height={24} />}
      />
      <NavLink
        to="/expense"
        label="Expense"
        activeIcon={<ExpenseIconFilled width={24} height={24} />}
        inactiveIcon={<ExpenseIconOutline width={24} height={24} />}
      />

      <div className="flex justify-center">
        <button onClick={() => setIsDrawerOpen(true)}>
          <div className="-mt-7 w-18 h-17 bg-white rounded-full flex justify-center items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-[#FFC606] border-6 border-[#FFE432] rounded-full shadow-[0_5px_0_0_#FFAA28] active:shadow-none active:translate-y-1 transition-all duration-100">
              <AddIcon width={22} height={22} />
            </div>
          </div>
        </button>
      </div>

      <Drawer
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Add New Expense"
      >
        <div className="flex flex-col space-y-4 px-2 pb-2 pt-2">
          <SquareButton
            label="Open Camera"
            sublabel="Scan your receipt quickly"
            icon={<CameraIcon className="text-orange" width={36} height={36} />}
            onClick={() => handleAddBtn("camera")}
          />
          <SquareButton
            label="Open Gallery"
            sublabel="Import images from your gallery"
            icon={
              <GalleryIcon
                className="text-primary-hover"
                width={36}
                height={36}
              />
            }
            onClick={() => handleAddBtn("gallery")}
          />
          <SquareButton
            label="Write Manually"
            sublabel="Input transaction details manually"
            icon={
              <ManualWriteIcon
                className="text-secondary"
                width={36}
                height={36}
              />
            }
            onClick={() => handleAddBtn("add")}
          />
          <div className="flex justify-center mt-2">
            <CloseIcon
              onClick={() => setIsDrawerOpen(false)}
              className="w-13 h-13 text-disabled p-3 rounded-full bg-background"
            />
          </div>
        </div>
      </Drawer>

      <NavLink
        to="/budget"
        label="Budget"
        activeIcon={<BudgetIconFilled width={24} height={24} />}
        inactiveIcon={<BudgetIconOutline width={24} height={24} />}
      />
      <NavLink
        to="/goals"
        label="Goals"
        activeIcon={
          <GoalsIconFilled className="text-orange" width={24} height={24} />
        }
        inactiveIcon={
          <GoalsIconOutline className="text-inactive" width={24} height={24} />
        }
      />
    </nav>
  );
}
