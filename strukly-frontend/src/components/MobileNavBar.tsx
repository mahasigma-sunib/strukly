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

import HappyMascot from "./mascots/HappyMascot";
import WinkMascot from "./mascots/WinkMascot";
import WhistleMascot from "./mascots/WhistleMascot";
import HeadbandMascot from "./mascots/HeadbandMascot";

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

      <span className={`text-xs ${isActive ? "text-active font-bold" : ""}`}>
        {isActive ? label : ""}
      </span>
    </Link>
  );
}

export default function MobileNavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const handleAddBtn = (target: string) => {
    navigate(`/newExpense/${target}`);
  };

  return (
    <nav className="rounded-full fixed bottom-4 left-4 right-4 grid grid-cols-5 items-center h-16 bg-white border-2 border-background z-50 shadow-lg pl-1 pr-1">
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
        <Link to="/newExpense" onClick={() => setIsDrawerOpen(true)}>
          <div className="-mt-5 w-18 h-17 bg-white rounded-full flex justify-center items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-[#FFC606] border-6 border-[#FFE432] rounded-full shadow-[0_5px_0_0_#FFAA28] active:shadow-none active:translate-y-1 transition-all duration-100">
              <AddIcon width={22} height={22} />
            </div>
          </div>
        </Link>
      </div>

      <Drawer
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Add New Expense"
      >
        <div className="grid grid-cols-2 gap-6 px-4 pb-4 pt-2">
          <SquareButton
            label="Camera"
            icon= {<HappyMascot/>}
            onClick={() => handleAddBtn("camera")}
          ></SquareButton>
          <SquareButton
            label="Gallery"
            icon= {<WhistleMascot/>}
            onClick={() => handleAddBtn("gallery")}
          ></SquareButton>
          <SquareButton
            label="Insert"
            icon= {<HeadbandMascot/>}
            onClick={() => handleAddBtn("insert")}
          ></SquareButton>
          <SquareButton
            label="Split Bill"
            icon= {<WinkMascot/>}
            onClick={() => handleAddBtn("splitBill")}
          ></SquareButton>
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
