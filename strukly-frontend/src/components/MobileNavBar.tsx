import { TbHome2, TbReceipt, TbHistory, TbUsers } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  to: string;
  activeIcon: React.ReactNode;
  inaciveIcon: React.ReactNode;
}

function NavLink({ to, activeIcon, inaciveIcon }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className="">
      {isActive ? activeIcon : inaciveIcon}
    </Link>
  );
}

export default function MobileNavBar() {
  return(
    <nav className="fixed flex bottom-0 left-0 right-0 justify-around items-center h-16 bg-background border-t border-text-secondary ">
      <NavLink
        to="/home"
        activeIcon={<TbHome2 size={28} className="text-primary" />}
        inaciveIcon={<TbHome2 size={28} className="text-text-secondary" />}
      />
      <NavLink
        to="/transactions"
        activeIcon={<TbReceipt size={28} className="text-primary" />}
        inaciveIcon={<TbReceipt size={28} className="text-text-secondary" />}
      />
      <NavLink
        to="/history"
        activeIcon={<TbHistory size={28} className="text-primary" />}
        inaciveIcon={<TbHistory size={28} className="text-text-secondary" />}
      />
      <NavLink
        to="/users"
        activeIcon={<TbUsers size={28} className="text-primary" />}
        inaciveIcon={<TbUsers size={28} className="text-text-secondary" />}
      />
    </nav>
  )
}