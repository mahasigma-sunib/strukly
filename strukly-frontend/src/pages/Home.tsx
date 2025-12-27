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

function Home() {
  const username = useUserAuth((s) => s.user?.name || "User");

  const greeting = getGreeting();

  const today = new Date();
  const currentMonthIndex = today.getMonth(); // getMonth() menghasilkan 0 (Januari) hingga 11 (Desember)
  const currentYear = today.getFullYear();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonthName = monthNames[currentMonthIndex];
  const currentMonthYear = `${currentMonthName} ${currentYear}`;

  return (
    <div>
      <div className="p-4">
        <TextLogo width={96} />
      </div>
      <div className="px-5 flex flex-col gap-6">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-4 items-center">
            <div>
              <HappyMascot width={48} height={48} />
            </div>
            <div>
              <p className="font-semibold text-lg text-light-gray">
                Good {greeting},
              </p>
              <p className="font-bold text-2xl">{username}</p>
            </div>
          </div>
          <div>
            <Button
              variant="secondary"
              size="sm"
              className="!p-2 rounded-2xl items-center"
            >
              <SettingsIcon width={28} />
            </Button>
          </div>
        </div>
        <div className="p-4 bg-orange text-white rounded-3xl">
          <div className="flex flex-row justify-between mb-4">
            <p className="font-bold text-xl ">Dashboard</p>
            <p className="px-3 py-1 bg-surface font-extrabold text-orange rounded-full">
              {currentMonthYear}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-lg">Total Expense</p>
            <p className="font-bold text-3xl tracking-wide">
              Rp2.540.000{/* total expense goes here */}
              <span className="font-semibold text-xl text-white/80">,00</span>
            </p>
          </div>

          <div className="bg-surface p-4 rounded-2xl text-text-primary mt-4">
            <p>Budget</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
