

interface WalletCardProps {
  item: WalletType;
}

const WalletCard = ({item}: WalletCardProps) => {
  return (
    <div className="min-w-[125px] h-[70px] shadow-[0_0_5px_rgba(0,0,0,0.3)] rounded-lg pt-10 pb-10 pl-5 pr-15 flex flex-col justify-center" key={item.id}>
      <div className="text-base mb-1">{item.name}</div>
      <div className="text-lg font-bold">{item.balance}</div>
    </div>
  );
};

export default WalletCard;