import useUserAuth from "../store/UserAuthStore";
import TextLogo from "../components/logos/TextLogo";
import SettingsIcon from "../components/utilityIcons/SettingsIcon";
import Button from "../components/button/Button";
import HappyMascot from "../components/mascots/HappyMascot";
import HeadbandMascot from "../components/mascots/HeadbandMascot";
import PeekingUpMascot from "../components/mascots/PeekingUpMascot";
import Card from "../components/card/Card";
import WhistleMascot from "../components/mascots/WhistleMascot";
import WinkMascot from "../components/mascots/WinkMascot";
import NeutralMascot from "../components/mascots/NeutralMascot";

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
      <div className="px-4 py-2 bg-surface z-999 fixed w-full border-b-1 border-border">
        <TextLogo width={80} />
      </div>

      <div className="flex flex-col bg-surface py-4 border-b-2 border-border rounded-b-3xl mb-3">
        <div className="px-5 flex flex-row justify-between items-center pt-12">
          <div className="flex flex-row gap-4 items-center">
            <div>
              <WinkMascot width={48} height={48} />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-lg text-text-disabled/70">
                Good {greeting},
              </p>
              <p className="font-bold text-2xl">{username}</p>
            </div>
          </div>
          <div>
            <Button variant="blue" size="sm" className="!p-1 rounded-2xl">
              <SettingsIcon width={28} />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col p-5">
        <div className="w-fit mb-4">
          <p className="text-2xl font-bold text-text-primary">
            🗓️ {currentMonthYear}
          </p>
        </div>

        <div className="absolute right-10 top-1 z-0">
          <div className=" rounded-full flex items-center justify-center text-xs font-bold ">
            <HappyMascot width={100} height={100} />
          </div>
        </div>

        <div className="relative p-4 bg-gradient-to-br from-[#ff8717] to-[#fabd15] rounded-2xl flex flex-col shadow-[0_6px_0_0_#e9a613] z-10 ">
          <div className="flex flex-col gap-2 justify-center items-center">
            <p className="font-bold text-lg text-white/80">You've spent</p>
            <p className="font-bold text-4xl tracking-wide text-white">
              Rp2.540.000{/* total expense goes here */}
              <span className="font-semibold text-xl text-white/80">,00</span>
            </p>
          </div>
          <div className="mt-4 p-4 bg-surface flex flex-col gap-2 rounded-xl">
            <p className="text-text-primary/80 font-bold text-2xl">Budget</p>
            <div>
              <p className="font-bold text-inactive">
                Budget Progress Bar goes here!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        <Card className="!m-0">
          <div className="flex flex-row justify-between items-center gap-3 ">
            <p className="text-[40px] text-center">💸</p>
            <p className="text-lg text-text-secondary">
              Per day, you spend on average{" "}
              <span className="text-xl font-bold text-text-primary">
                Rp200.000
              </span>{" "}
            </p>
          </div>
        </Card>
      </div>

      <div className="pb-24">
        <div className="p-5 mt-4 flex flex-col gap-8">
          <div>
            <p className="text-2xl font-bold mb-2">Current Goals</p>
            {/* Goals goes here */}
            <Card className="!m-0">
              <div className="p-5 items-center justify-center flex flex-col gap-4 bg-surface rounded-2xl">
                <HeadbandMascot width={72} height={72} />
                <p className="text-inactive font-semibold text-base text-center">
                  You haven't made a goal yet
                </p>
                {/* Link to Goals Page */}
                <Button size="lg" variant="primary" className="!py-2">
                  Make a goal
                </Button>
              </div>
            </Card>
          </div>

          <div>
            <p className="text-2xl font-bold mb-2">Recent Expenses</p>
            {/* Recent expenses goes here */}
            <Card className="!m-0">
              <div className="p-5 items-center justify-center flex flex-col gap-4 bg-surface rounded-2xl">
                <WhistleMascot width={72} height={72} />
                <p className="text-inactive font-semibold text-base text-center">
                  You haven't add a new expense yet
                </p>
                {/* Link to Goals Page */}
                <Button size="lg" variant="primary" className="!py-2">
                  Add expense
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
