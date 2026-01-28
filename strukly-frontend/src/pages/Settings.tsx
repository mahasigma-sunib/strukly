import { useNavigate } from "react-router-dom";

import useUserAuth from "../store/UserAuthStore";
import Button from "../components/button/Button";
import BackIcon from "../components/utilityIcons/BackIcon";

export default function Settings() {
  const logout = useUserAuth((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="pb-16 min-h-screen bg-background">
      <div className="bg-surface px-4 py-5 flex items-center gap-3 sticky top-0 z-10 shadow-sm border-b-2 border-border">
        <button onClick={() => navigate(-1)}>
          <BackIcon width={28} height={28} />
        </button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <div className="p-6 flex items-center justify-center">
        <Button onClick={logout}>Log out</Button>
      </div>
    </div>
  );
}
