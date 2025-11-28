import { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { emailSchema, passwordSchema } from "./schema/UserAuthSchemas";
import useUserAuth from "../../store/UserAuthStore";
import Button from "../../components/Button";

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
    <div className="flex flex-col gap-4 items-center justify-center min-h-[100vh] px-10">
      <div className="font-extrabold text-4xl text-primary">Koinku</div>
      
      <div className="flex flex-col gap-2 w-full">
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
      </div>

      <Button onClick={handleLogin} className="rounded cursor-pointer my-4 w-full">
        Log in
      </Button>

      <div>
        <span className="font-bold">Don&apos;t have an account?</span>
        <Button variant="text" onClick={() => navigate("/register")}>
          Register here
        </Button>
      </div>
      <div>
        {loginError != "" && <p className="text-status-error">{loginError}</p>}
      </div>
    </div>
  );
}

export default UserLogin;
