import useUserAuth from "../store/UserAuthStore";
// import "../css/WalletPopUp.css";

function Home() {
  const username = useUserAuth((s) => s.user?.name || "User");

  return (
    <div className="m-8 font-bold text-2xl">
      <h1>Hi, {username}</h1>
    </div>
  );
}

export default Home;
