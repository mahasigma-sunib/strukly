import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { emailSchema, passwordSchema } from "./schema/UserAuthSchemas";
import useUserAuth from "../../store/UserAuthStore";
import Button from "../../components/button/Button";
import TextLogo from "../../components/logos/TextLogo";
import LoginMascot from "../../components/mascots/LoginMascot";

// Helper error message component
const ErrorMessage = ({ children }: { children: React.ReactNode }) => (
  <p className="text-status-error text-sm font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
    {children}
  </p>
);

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const login = useUserAuth((s) => s.login);

  const validate = () => {
    const emailVal = emailSchema.safeParse(email);
    const passVal = passwordSchema.safeParse(password);

    if (!emailVal.success) setEmailError(emailVal.error.issues[0].message);
    else setEmailError("");

    if (!passVal.success)
      setPasswordError(passVal.error.issues.map((i) => i.message));
    else setPasswordError([]);

    return emailVal.success && passVal.success;
  };

  const handleLogin = async () => {
    setLoginError("");
    const isValid = validate();

    if (!isValid) return;

    setIsLoading(true);
    try {
      await login(email, password);
      window.location.href = "/cookie";
    } catch (err) {
      setLoginError(
        "The email or password you entered is incorrect. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col items-center antialiased">
      <div className="flex justify-center items-center w-full pt-10 pb-4">
        <TextLogo width={108} height={84} />
      </div>

      <div className="flex flex-col gap-4 items-center w-full max-w-sm md:max-w-md px-6">
        <div className="flex flex-col gap-1 mb-5 mt-4 items-center text-center">
          <div className="mb-1">
            <LoginMascot width={144} height={144} />
          </div>
          <h1 className="font-extrabold text-2xl text-text-primary">
            Welcome Back!
          </h1>
          <p className="font-bold text-base text-inactive">
            Let's get you back in!
          </p>
        </div>

        {/* Global Login Error Alert */}
        {loginError && (
          <div className="w-full bg-status-error/10 border border-status-error/20 p-3 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300">
            <div className="bg-status-error text-white rounded-full p-3 h-5 w-5 flex items-center justify-center text-sm font-bold">
              !
            </div>
            <p className="text-status-error text-sm font-bold">{loginError}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 w-full">
          {/* Email Input Group */}
          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => {
                const res = emailSchema.safeParse(email);
                setEmailError(res.success ? "" : res.error.issues[0].message);
              }}
              className={`w-full p-4 border-2 rounded-2xl text-base font-extrabold transition-all duration-200
                bg-background focus:outline-none focus:ring-4 focus:ring-primary/10
                ${
                  emailError
                    ? "border-status-error bg-status-error/5"
                    : "border-border focus:border-primary"
                }`}
            />
            {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
          </div>

          {/* Password Input Group */}
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => {
                const res = passwordSchema.safeParse(password);
                setPasswordError(
                  res.success ? [] : res.error.issues.map((i) => i.message)
                );
              }}
              className={`w-full p-4 border-2 rounded-2xl text-base font-extrabold transition-all duration-200
                bg-background focus:outline-none focus:ring-4 focus:ring-primary/10
                ${
                  passwordError.length > 0
                    ? "border-status-error bg-status-error/5"
                    : "border-border focus:border-primary"
                }`}
            />
            {passwordError.map((err, i) => (
              <ErrorMessage key={i}>{err}</ErrorMessage>
            ))}
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleLogin}
          disabled={isLoading}
          className={`rounded-2xl cursor-pointer my-2 w-full py-4 font-black tracking-wide transition-all
            ${
              isLoading ? "opacity-70" : "hover:shadow-lg active:scale-[0.98]"
            }`}
        >
          {isLoading ? "LOGGING IN..." : "LOG IN"}
        </Button>

        <div className="flex flex-row gap-2 mt-2">
          <span className="font-bold text-text-disabled">
            Don't have an account?
          </span>
          <span
            onClick={() => navigate("/register")}
            className="font-extrabold text-primary cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
