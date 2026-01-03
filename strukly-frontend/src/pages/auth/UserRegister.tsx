import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { emailSchema, passwordSchema } from "./schema/UserAuthSchemas";
import useUserAuth from "../../store/UserAuthStore";
import Button from "../../components/button/Button";
import TextLogo from "../../components/logos/TextLogo";
import WinkMascot from "../../components/mascots/WinkMascot";

// Error Icon component (exclusive for this page only)
const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 inline mr-1 text-status-error align-middle"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

function UserRegister() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const navigate = useNavigate();
  const register = useUserAuth((s) => s.register);

  const clearRegisterError = () => {
    if (registerError) {
      setRegisterError("");
    }
  };

  useEffect(() => {
    if (confirmPassword && confirmPassword !== password) {
      setConfirmPasswordError("Password do not match");
    } else {
      setConfirmPasswordError("");
    }
  }, [password, confirmPassword]);

  const handleEmailValidation = () => {
    if (!email.trim()) {
      setEmailError("");
      return;
    }
    const { error, success } = emailSchema.safeParse(email);
    if (success) {
      setEmailError("");
    } else {
      setEmailError(error.issues[0].message);
    }
  };

  const handlePasswordValidation = () => {
    if (!password.trim()) {
      setPasswordError([]);
      return;
    }
    const { error, success } = passwordSchema.safeParse(password);
    if (success) {
      setPasswordError([]);
    } else {
      const errors = error.issues.map((issue) => issue.message);
      setPasswordError(errors);
    }
  };

  const handleRegister = async () => {
    handleEmailValidation();
    handlePasswordValidation();

    let hasError = false;

    if (!username) {
      setRegisterError("Username is required.");
      hasError = true;
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError("Password do not match");
      hasError = true;
    } else {
      setConfirmPasswordError("");
    }

    if (
      !username ||
      !email ||
      !password ||
      emailError !== "" ||
      passwordError.length > 0 ||
      confirmPasswordError !== "" ||
      hasError
    ) {
      if (!registerError) {
        setRegisterError("Please fill the form correctly.");
      }
      return;
    }

    setRegisterError("");

    try {
      await register(username, email, password);
      navigate("/login");
    } catch (error) {
      setRegisterError((error as Error).message);
    }
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col items-center">
      <div className="flex justify-center items-center w-full pt-10 pb-4">
        <TextLogo width={108} height={84} />
      </div>

      <div className="flex flex-col gap-4 items-center w-full max-w-sm md:max-w-md px-6">
        <div className="flex flex-col gap-1 mb-5 items-center justify-center text-center">
          <div className="mb-3">
            <WinkMascot width={84} height={84} />
          </div>
          <p className="font-extrabold text-2xl text-text-primary">
            Create Account
          </p>
          <p className="font-bold text-base text-inactive">
            Let's set up your account!
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          {/* USERNAME FIELD */}
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(event) => {
              setUsername(event?.target.value);
              clearRegisterError();
            }}
            required
            className={`w-full p-4 border-2 rounded-2xl text-base font-extrabold text-text-secondary mx-auto block
                        bg-background focus:outline-none focus:border-primary 
                        ${
                          !username &&
                          registerError.includes("Username is required")
                            ? "border-status-error"
                            : "border-border"
                        }`}
          />

          {/* EMAIL FIELD */}
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(event) => {
              setEmail(event?.target.value);
              if (emailError) setEmailError("");
              clearRegisterError();
            }}
            onBlur={handleEmailValidation}
            required
            className={`w-full p-4 border-2 rounded-2xl text-base font-extrabold text-text-secondary mx-auto block
                        bg-background focus:outline-none focus:border-primary
                        ${
                          emailError ? "border-status-error" : "border-border"
                        }`}
          />
          {emailError != "" && (
            <p className="text-status-error text-sm mt-[-4px] font-medium">
              <ErrorIcon />
              {emailError}
            </p>
          )}

          {/* PASSWORD FIELD */}
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(event) => {
              setPassword(event?.target.value);
              if (passwordError.length > 0) setPasswordError([]);
              clearRegisterError();
            }}
            onBlur={handlePasswordValidation}
            required
            className={`w-full p-4 border-2 rounded-2xl text-base font-extrabold text-text-secondary mx-auto block
                        bg-background focus:outline-none focus:border-primary
                        ${
                          passwordError.length > 0 || confirmPasswordError
                            ? "border-status-error"
                            : "border-border"
                        }`}
          />
          {passwordError.length > 0 && (
            <div className="text-status-error text-sm mt-[-4px] font-medium">
              {passwordError.map((error, index) => (
                <p key={index}>
                  <ErrorIcon />
                  {error}
                </p>
              ))}
            </div>
          )}

          {/* CONFIRM PASSWORD FIELD */}
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event?.target.value);
              clearRegisterError();
            }}
            required
            className={`w-full p-4 border-2 rounded-2xl text-base font-extrabold text-text-secondary mx-auto block
                        bg-background focus:outline-none focus:border-primary
                        ${
                          confirmPasswordError
                            ? "border-status-error"
                            : "border-border"
                        }`}
          />
          {confirmPasswordError && (
            <div className="text-status-error text-sm mt-[-4px] font-medium">
              <ErrorIcon />
              {confirmPasswordError}
            </div>
          )}
        </div>

        {/* Register Button */}
        <Button
          onClick={handleRegister}
          className="rounded cursor-pointer my-4 w-full py-3"
        >
          SIGN UP
        </Button>

        {/* Login Link */}
        <div className="flex flex-row gap-2">
          <span className="font-bold text-text-disabled">
            Already have an account?
          </span>
          <span
            onClick={() => navigate("/login")}
            className="font-extrabold text-primary cursor-pointer"
          >
            Log in
          </span>
        </div>

        {/* Register Error Display (Error Global/Backend) */}
        <div>
          {registerError != "" && (
            <div className="w-full bg-status-error/10 border border-status-error/20 p-3 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300 mt-4">
              <div className="bg-status-error text-white rounded-full p-3 h-5 w-5 flex items-center justify-center text-sm font-bold shrink-0">
                !
              </div>
              <p className="text-status-error text-sm font-bold">
                {registerError}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserRegister;
