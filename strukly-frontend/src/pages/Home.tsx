import useUserAuth from "../store/UserAuthStore";
import TextLogo from "../components/logos/TextLogo";
import SettingsIcon from "../components/utilityIcons/SettingsIcon";
import Button from "../components/button/Button";
import HappyMascot from "../components/mascots/HappyMascot";
import HeadbandMascot from "../components/mascots/HeadbandMascot";
import Card from "../components/card/Card";
import WhistleMascot from "../components/mascots/WhistleMascot";
import WinkMascot from "../components/mascots/WinkMascot";
import FoodIcon from "../components/categoryIcons/FoodIcon";
import NeutralMascot from "../components/mascots/NeutralMascot";
import LoginMascot from "../components/mascots/LoginMascot";
import ExpenseEmptyMascot from "../components/mascots/ExpenseEmptyMascot";

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
      <div className="px-4 py-2 sticky top-0 z-20 bg-surface ">
        <TextLogo width={80} />
      </div>
      <div className="flex flex-col py-4 mb-4 bg-surface border-b-2 border-border rounded-b-3xl">
        <div className="px-5 flex flex-row justify-between items-center">
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

        <div className="absolute right-10 top-2 z-0">
          <div className=" rounded-full flex items-center justify-center text-xs font-bold ">
            <HappyMascot width={88} height={88} />
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
            <p className="text-text-primary/80 font-bold text-2xl">
              Your Budget
            </p>
            <div>
              <p className="font-bold text-inactive">
                Budget Progress Bar goes here!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        <Card className="!m-0 flex flex-col gap-2 !bg-[#46bafe] !shadow-[0_6px_0_0_#30b3ff] !border-0">
          <div className="flex justify-center items-center !p-1">
            <p className="font-bold text-2xl text-white">Analysis</p>
          </div>
          <div className="grid grid-rows-2 gap-3">
            <div className="flex flex-row items-center gap-3 p-2 rounded-xl bg-surface">
              <p className="text-[40px] text-center">💸</p>
              <div className="flex flex-col">
                <p className="text-base text-text-secondary/90 font-semibold">
                  AVG. SPENT PER DAY
                </p>
                <p className="text-xl font-bold text-text-primary">Rp200.000</p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-3 p-2 rounded-xl bg-surface">
              <div className="mx-2">
                <FoodIcon />
              </div>
              <div className="flex flex-col">
                <p className="text-base text-text-secondary/90 font-semibold">
                  TOP CATEGORY EXPENSES
                </p>
                <p className="text-xl font-bold text-text-primary">Food</p>
              </div>
            </div>
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

    // <div>
    //   <div className="px-4 py-2 sticky top-0 z-20 bg-surface ">
    //     <TextLogo width={80} />
    //   </div>
    //   <div className="flex flex-col py-4 mb-4 bg-surface border-b-2 border-border rounded-b-3xl">
    //     <div className="px-5 flex flex-row justify-between items-center">
    //       <div className="flex flex-row gap-4 items-center">
    //         <div>
    //           <WinkMascot width={48} height={48} />
    //         </div>
    //         <div className="flex flex-col">
    //           <p className="font-semibold text-lg text-text-disabled/70">
    //             Good {greeting},
    //           </p>
    //           <p className="font-bold text-2xl">{username}</p>
    //         </div>
    //       </div>
    //       <div>
    //         <Button variant="blue" size="sm" className="!p-1 rounded-2xl">
    //           <SettingsIcon width={28} />
    //         </Button>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="relative flex flex-col p-5">
    //     <div className="w-fit mb-4">
    //       <p className="text-2xl font-bold text-text-primary">
    //         🗓️ {currentMonthYear}
    //       </p>
    //     </div>

    //     <div className="absolute right-10 top-2 z-0">
    //       <div className=" rounded-full flex items-center justify-center text-xs font-bold ">
    //         <HappyMascot width={88} height={88} />
    //       </div>
    //     </div>

    //     <div className="relative p-4 bg-gradient-to-br from-[#ff8717] to-[#fabd15] rounded-2xl flex flex-col shadow-[0_6px_0_0_#e9a613] z-10 ">
    //       <div className="flex flex-col gap-2 justify-center items-center">
    //         <p className="font-bold text-lg text-white/80">You've spent</p>
    //         <p className="font-bold text-4xl tracking-wide text-white">
    //           Rp2.540.000{/* total expense goes here */}
    //           <span className="font-semibold text-xl text-white/80">,00</span>
    //         </p>
    //       </div>
    //       <div className="mt-4 flex flex-row gap-2">
    //         <div className="bg-surface rounded-xl p-2 flex-1 ">
    //           <div className="flex flex-col">
    //             <p>Top Categories</p>
    //             <p className="text-xl font-bold">Food</p>
    //           </div>
    //         </div>
    //         <div className="bg-surface rounded-xl p-2 flex-1 ">
    //           <div className="flex flex-col">
    //             <p>Avg. spent per day</p>
    //             <p className="text-xl font-bold">Rp20.000</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="px-5">
    //     <Card className="!m-0 !p-5">
    //       <div className="flex flex-col gap-3 ">
    //         <p className="text-text-primary/80 font-bold text-2xl">
    //           Your Budget
    //         </p>
    //         <div>
    //           <p className="font-bold text-inactive">
    //             Budget Progress Bar goes here!
    //           </p>
    //         </div>
    //       </div>
    //     </Card>
    //   </div>

    //   <div className="pb-24">
    //     <div className="p-5 mt-4 flex flex-col gap-8">
    //       <div>
    //         <p className="text-2xl font-bold mb-2">Current Goals</p>
    //         {/* Goals goes here */}
    //         <Card className="!m-0">
    //           <div className="p-5 items-center justify-center flex flex-col gap-4 bg-surface rounded-2xl">
    //             <HeadbandMascot width={72} height={72} />
    //             <p className="text-inactive font-semibold text-base text-center">
    //               You haven't made a goal yet
    //             </p>
    //             {/* Link to Goals Page */}
    //             <Button size="lg" variant="primary" className="!py-2">
    //               Make a goal
    //             </Button>
    //           </div>
    //         </Card>
    //       </div>

    //       <div>
    //         <p className="text-2xl font-bold mb-2">Recent Expenses</p>
    //         {/* Recent expenses goes here */}
    //         <Card className="!m-0">
    //           <div className="p-5 items-center justify-center flex flex-col gap-4 bg-surface rounded-2xl">
    //             <WhistleMascot width={72} height={72} />
    //             <p className="text-inactive font-semibold text-base text-center">
    //               You haven't add a new expense yet
    //             </p>
    //             {/* Link to Goals Page */}
    //             <Button size="lg" variant="primary" className="!py-2">
    //               Add expense
    //             </Button>
    //           </div>
    //         </Card>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Home;
