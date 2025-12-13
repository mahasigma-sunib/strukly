import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { emailSchema, passwordSchema } from "./schema/UserAuthSchemas";
import useUserAuth from "../../store/UserAuthStore";
import Button from "../../components/button/Button";
import TextLogo from "../../components/logos/TextLogo";
import WinkMascot from "../../components/mascots/WinkMascot";

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

  useEffect(() => {
    if (confirmPassword && confirmPassword !== password) {
      setConfirmPasswordError("Password do not match");
    } else {
      setConfirmPasswordError("");
    }
  }, [password, confirmPassword]);

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

  const handleRegister = async () => {
    handleEmailValidation();
    handlePasswordValidation();
    setRegisterError("");

    let hasError = false;
    if (!username) {
      hasError = true;
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError("Password do not match");
      hasError = true;
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
      return;
    }

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
          <input
            type="username"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(event) => {
              setUsername(event?.target.value);
            }}
            required
            className={`w-full p-4 border-2 rounded-2xl text-base font-extrabold text-text-secondary mx-auto block
                      bg-background focus:outline-none focus:border-primary 
                      ${
                        !username && !email ? "border-border" : "border-border"
                      }`}
          />

          <input
            type="email"
            id="email"
            placeholder="Email"
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
                        passwordError.length > 0 || confirmPasswordError
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

          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event?.target.value);
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
            <div className="text-status-error text-sm mt-[-4px]">
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
            className="font-extrabold text-primary cursor-pointer" // Tambahkan cursor-pointer
          >
            Log in
          </span>
        </div>

        {/* Register Error Display */}
        <div>
          {registerError != "" && (
            <p className="text-status-error">{registerError}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserRegister;
