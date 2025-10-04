import { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { emailSchema, passwordSchema } from "../schema/UserAuthSchemas";
import useUserAuth from "../store/UserAuthStore";

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
      document.location.href = "/cookie"
    } catch {
      setLoginError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[90vh]">
      <h1>Strukly</h1>

      <div>
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
          className="w-[200px] p-2.5 border border-black rounded text-base mx-auto block
                    focus:outline-none focus:border-black focus:shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]"
        />
        {emailError != "" && <p className="text-red-600">{emailError}</p>}
      </div>
      <div>
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
          className="w-[200px] p-2.5 border border-black rounded text-base mx-auto block
                    focus:outline-none focus:border-black focus:shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]"
        />
        {passwordError.length > 0 && (
          <div className="text-red-600">
            {passwordError.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <button onClick={handleLogin} className="rounded cursor-pointer my-4">Log in</button>
      <div>
        <span>Don&apos;t have an account?</span>
        <button
          type="button"
          style={{
            color: "aqua",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/register")}
        >
          Register here
        </button>
      </div>
      <div>
        {loginError != "" && <p style={{ color: "red" }}>{loginError}</p>}
      </div>
    </div>
  );
}

export default UserLogin;
