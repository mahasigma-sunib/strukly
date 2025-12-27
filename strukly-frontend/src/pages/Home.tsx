import useUserAuth from "../store/UserAuthStore";
import TextLogo from "../components/logos/TextLogo";
import SettingsIcon from "../components/utilityIcons/SettingsIcon";
import Button from "../components/button/Button";
import HappyMascot from "../components/mascots/HappyMascot";
import HeadbandMascot from "../components/mascots/HeadbandMascot";
import NeutralMascot from "../components/mascots/NeutralMascot";
import WhistleMascot from "../components/mascots/WhistleMascot";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 4 && hour < 11) {
    return "Morning"; // (04:00 - 10:59)
  } else if (hour >= 11 && hour < 15) {
    return "Afternoon"; // (11:00 - 14:59)
  } else if (hour >= 15 && hour < 19) {
    return "Evening"; // (15:00 - 18:59)
  } else {
    return "Night"; // (19:00 - 03:59)
  }
};

const MASCOTS = [HappyMascot, HeadbandMascot, NeutralMascot, WhistleMascot];

const getRandomMascot = () => {
  const randomIndex = Math.floor(Math.random() * MASCOTS.length);

  return MASCOTS[randomIndex];
};

function Home() {
  const username = useUserAuth((s) => s.user?.name || "User");
  const firstName = username.split(" ")[0];
  const greeting = getGreeting();

  const RandomMascotComponent = getRandomMascot();

  return (
    <div>
      <div className="py-2 px-4 flex items-center bg-surface border-b-2 border-border">
        <TextLogo width={100}></TextLogo>
      </div>
      <div className="p-5">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-4 items-center">
            <div>
              <RandomMascotComponent width={48} />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-lg text-text-secondary">
                Good {greeting},
              </p>
              <p className="font-bold text-3xl">{firstName}</p>
            </div>
          </div>
          <div>
            <Button variant="blue" size="sm" className="!p-1 rounded-full">
              <SettingsIcon width={28} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
