import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function PasswordInput({
  className = "",
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative w-full">
      <input
        {...props}
        type={isVisible ? "text" : "password"}
        className={`${className} pr-12`}
      />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-inactive hover:text-text-secondary cursor-pointer"
      >
        {isVisible ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
