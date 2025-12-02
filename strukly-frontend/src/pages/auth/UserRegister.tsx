import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { emailSchema, passwordSchema } from "./schema/UserAuthSchemas";
import useUserAuth from "../../store/UserAuthStore";
import Button from "../../components/button/Button";

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
    if (confirmPassword != password) {
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
    if (
      !username ||
      !email ||
      !password ||
      emailError !== "" ||
      passwordError.length > 0
    ) {
      return; // Stop if there are errors
    }

    try {
      await register(username, email, password);
      navigate("/login");
    } catch (error) {
      setRegisterError((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[100vh] px-10">
      <div className="font-extrabold text-4xl text-primary">Koinku</div>

      <div className="flex flex-col gap-2 w-full">
        <input
          type="username"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(event) => {
            setUsername(event?.target.value);
          }}
          required
          className="w-full p-2.5 border-2 border-border bg-surface rounded-xl text-base mx-auto block
                    focus:outline-none focus:border-primary"
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
          className="w-full p-2.5 border-2 border-border bg-surface rounded-xl text-base mx-auto block
                    focus:outline-none focus:border-primary"
        />
        {emailError != "" && <p className="text-status-error">{emailError}</p>}
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
          className="w-full p-2.5 border-2 border-border bg-surface rounded-xl text-base mx-auto block
                    focus:outline-none focus:border-primary"
        />
        {passwordError.length > 0 && (
          <div className="text-status-error">
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
          className="w-full p-2.5 border-2 border-border bg-surface rounded-xl text-base mx-auto block
                    focus:outline-none focus:border-primary"
        />
        {confirmPasswordError && (
          <div className="text-status-error">{confirmPasswordError}</div>
        )}
      </div>

      <Button
        onClick={handleRegister}
        className="rounded cursor-pointer my-4 w-full"
      >
        Register
      </Button>

      <div>
        <span className="font-bold">Already have an account?</span>
        <Button variant="text" onClick={() => navigate("/login")}>
          Log in
        </Button>
      </div>
      <div>
        {registerError != "" && (
          <p className="text-status-error">{registerError}</p>
        )}
      </div>
    </div>
  );
}
export default UserRegister;
