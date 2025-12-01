import { Link } from "react-router-dom";
import AddIcon from "./icons/AddIcon";

export default function AddExpenseButton() {
  return (
    <Link to="/add">
      <div className="-mt-5 w-18 h-17 bg-white rounded-full flex justify-center items-center">
        <div className="group relative flex items-center justify-center w-12 h-12 bg-[#FFC606] border-6 border-[#FFE432] rounded-full shadow-[0_5px_0_0_#FFAA28] active:shadow-none active:translate-y-1 transition-all duration-100 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent -translate-x-full group-active:translate-x-full transition-transform duration-300 ease-in-out skew-x-12" />
          <AddIcon width={22} height={22} />
        </div>
      </div>
    </Link>
  )
}