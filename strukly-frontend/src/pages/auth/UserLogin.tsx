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
      return; // Stop if there are errors
    }

    try {
      await login(email, password);
      document.location.href = "/cookie";
    } catch {
      setLoginError("Invalid email or password");
    }
  };

  return (
    <div className="bg-surface min-h-screen">
      <div className="flex justify-center items-center w-full ">
        <TextLogo width={108} height={108} />
      </div>

      <div className="flex flex-col gap-4 items-center justify-start px-10">
        <div className="flex flex-col gap-1 mb-5 mt-4 items-center justify-center">
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

        <div className="flex flex-col gap-3 w-full">
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
            className="w-full p-3.5 border-2 border-border bg-background rounded-2xl text-base font-extrabold text-text-secondary mx-auto block
                     focus:outline-none focus:border-primary"
          />
          {emailError != "" && (
            <p className="text-status-error">{emailError}</p>
          )}
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
            className="w-full p-3 border-2 border-border bg-background rounded-2xl text-base font-extrabold text-text-secondary mx-auto block
                     focus:outline-none focus:border-primary"
          />
          {passwordError.length > 0 && (
            <div className="text-status-error">
              {passwordError.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <Button
          variant="primary"
          onClick={handleLogin}
          className="rounded cursor-pointer my-4 w-full"
        >
          LOG IN
        </Button>

        <div className="flex flex-row gap-2">
          <span className="font-bold text-text-disabled">
            Don&apos;t have an account?
          </span>
          <span
            onClick={() => navigate("/register")}
            className="font-extrabold text-primary"
          >
            {" "}
            Sign Up
          </span>
        </div>
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
