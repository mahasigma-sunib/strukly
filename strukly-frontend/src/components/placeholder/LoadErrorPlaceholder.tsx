import Button from "../button/Button";
import DizzyMascot from "../mascots/DizzyMascot";

interface LoadErrorPlaceholderProps {
  title: string;
  subtitle?: string;
  onRetry: () => void;
  retryLabel?: string;
}

export default function LoadErrorPlaceholder({
  title,
  subtitle = "Please check your connection and try again.",
  onRetry,
  retryLabel = "Retry",
}: LoadErrorPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-20 px-6">
      <DizzyMascot className="ml-6" width={150} height={150} />
      <p className="text-inactive mt-4 font-bold text-lg text-center">
        {title}
      </p>
      <p className="text-inactive text-sm text-center mt-1">{subtitle}</p>
      <Button variant="primary" size="md" onClick={onRetry} className="mt-6">
        {retryLabel}
      </Button>
    </div>
  );
}
