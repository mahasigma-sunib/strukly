import type { WalletType } from "../type/WalletType";
import "../css/WalletList.css";

interface WalletCardProps {
  item: WalletType;
}

const WalletCard = ({item}: WalletCardProps) => {
  return (
    <div className="wallet-list-card" key={item.id}>
      <div className="item-name">{item.name}</div>
      <div className="item-balance">{item.balance}</div>
    </div>
  );
};

export default WalletCard;