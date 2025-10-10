import {
  RiHome5Line,
  RiHome5Fill,
  RiReceiptLine,
  RiReceiptFill,
  RiPieChart2Line,
  RiPieChart2Fill,
  RiUser3Line,
  RiUser3Fill,
  RiQrScan2Line,
} from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";

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
      {/* Icon berubah warna */}
      <div
        className={`transition-transform duration-200 ${
          isActive ? "text-primary" : "text-text-disabled"
        }`}
      >
        {isActive ? activeIcon : inactiveIcon}
      </div>

      {/* Label selalu tampil */}
      <span
        className={`text-xs ${
          isActive
            ? "text-primary font-medium"
            : "text-text-disabled font-regular"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

export default function MobileNavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 grid grid-cols-5 items-center h-16 bg-background border-t-2 border-t-border z-50">
      <NavLink
        to="/home"
        label="Beranda"
        activeIcon={<RiHome5Fill size={24} />}
        inactiveIcon={<RiHome5Line size={24} />}
      />
      <NavLink
        to="/transactions"
        label="Riwayat"
        activeIcon={<RiReceiptFill size={24} />}
        inactiveIcon={<RiReceiptLine size={24} />}
      />

      {/* CTA di tengah (kolom ke-3) */}
      <div className="flex justify-center">
        <Link
          to="/add"
          className="relative -translate-y-5 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:scale-105 transition-transform duration-200"
        >
          <RiQrScan2Line size={28} />
        </Link>
      </div>

      <NavLink
        to="/history"
        label="Tracker"
        activeIcon={<RiPieChart2Fill size={24} />}
        inactiveIcon={<RiPieChart2Line size={24} />}
      />
      <NavLink
        to="/users"
        label="Profil"
        activeIcon={<RiUser3Fill size={24} />}
        inactiveIcon={<RiUser3Line size={24} />}
      />
    </nav>
  );
}
