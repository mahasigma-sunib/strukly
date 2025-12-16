import { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { emailSchema, passwordSchema } from "./schema/UserAuthSchemas";
import useUserAuth from "../../store/UserAuthStore";
import Button from "../../components/button/Button";
import TextLogo from "../../components/logos/TextLogo";
import LoginMascot from "../../components/mascots/LoginMascot";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();
  const login = useUserAuth((s) => s.login);

  const handleEmailValidation = () => {
    const { error, success } = emailSchema.safeParse(email);
    if (success) {
      setEmailError("");
    } else {
      setEmailError(error.issues[0].message);
    }
  };

  const handlePasswordValidation = () => {
    const { error, success } = passwordSchema.safeParse(password);
    if (success) {
      setPasswordError([]);
    } else {
      const errors = error.issues.map((issue) => issue.message);
      setPasswordError(errors);
    }
  };

  const handleLogin = async () => {
    handleEmailValidation();
    handlePasswordValidation();
    setLoginError("");

    if (!email || !password || emailError !== "" || passwordError.length > 0) {
      if (!email) setEmailError("Email cannot be empty");
      if (!password) setPasswordError(["Password cannot be empty"]);
      return;
    }

    try {
      await login(email, password);
      document.location.href = "/cookie";
    } catch {
      setLoginError("Invalid email or password");
    }
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col items-center">
      <div className="flex justify-center items-center w-full pt-10 pb-4">
        <TextLogo width={108} height={84} />
      </div>

      <div className="flex flex-col gap-4 items-center w-full max-w-sm md:max-w-md px-6">
        <div className="flex flex-col gap-1 mb-5 mt-4 items-center justify-center text-center">
          <div className="mb-1">
            <LoginMascot width={144} height={144} />
          </div>
          <p className="font-extrabold text-2xl text-text-primary">
            Welcome Back!
          </p>
          <p className="font-bold text-base text-inactive">
            Let's get you back in!
          </p>
        </div>

        {/* Form Fields Section */}
        <div className="flex flex-col gap-3 w-full">
          {/* Email Input */}
          <input
            type="email"
            id="email"
            placeholder="Email or username"
            value={email}
            onChange={(event) => {
              setEmail(event?.target.value);
              handleEmailValidation();
            }}
            onBlur={handleEmailValidation}
            required
            className={`w-full p-4 border-2 rounded-2xl text-base font-extrabold text-text-secondary mx-auto block
                      bg-background focus:outline-none focus:border-primary 
                      ${emailError ? "border-status-error" : "border-border"}`}
          />
          {emailError != "" && (
            <p className="text-status-error text-sm mt-[-4px]">{emailError}</p>
          )}

          {/* Password Input */}
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(event) => {
              setPassword(event?.target.value);
              handlePasswordValidation();
            }}
            onBlur={handlePasswordValidation}
            required
            className={`w-full p-4 border-2 rounded-2xl text-base font-extrabold text-text-secondary mx-auto block
                      bg-background focus:outline-none focus:border-primary 
                      ${
                        passwordError.length > 0
                          ? "border-status-error"
                          : "border-border"
                      }`}
          />
          {passwordError.length > 0 && (
            <div className="text-status-error text-sm mt-[-4px]">
              {passwordError.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>

        {/* Login Button */}
        <Button
          variant="primary"
          onClick={handleLogin}
          className="rounded cursor-pointer my-4 w-full py-3"
        >
          LOG IN
        </Button>

        {/* Register Link */}
        <div className="flex flex-row gap-2">
          <span className="font-bold text-text-disabled">
            Don&apos;t have an account?
          </span>
          <span
            onClick={() => navigate("/register")}
            className="font-extrabold text-primary cursor-pointer"
          >
            Sign Up
          </span>
        </div>

        {/* Login Error Display */}
        <div>
          {loginError != "" && (
            <p className="text-status-error">{loginError}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
