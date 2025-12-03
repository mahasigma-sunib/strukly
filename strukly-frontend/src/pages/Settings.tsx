import useUserAuth from "../store/UserAuthStore";
import Button from "../components/button/Button";

export default function Settings() {
  const logout = useUserAuth((s) => s.logout);
  return (
    <div>
      <div className="m-8 flex items-center justify-center">
        <Button onClick={logout}>Log out</Button>
      </div>
    </div>
  );
}
