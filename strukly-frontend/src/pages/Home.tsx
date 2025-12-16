import TextLogo from "../components/logos/TextLogo";
import HappyMascot from "../components/mascots/HappyMascot";
import useUserAuth from "../store/UserAuthStore";
// import "../css/WalletPopUp.css";

function Home() {
  const username = useUserAuth((s) => s.user?.name || "User");

  return (
    <>
      <div className="mt-4 ml-3 mb-2">
        <TextLogo width={100} height={40} />
      </div>

      <div className="flex flex-row gap-4 p-4 items-center">
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-semibold text-text-secondary">Hello,</p>
          <p className="text-3xl font-extrabold">{username}</p>
        </div>
      </div>
    </>
  );
}

export default Home;
