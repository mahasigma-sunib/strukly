import { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { emailSchema, passwordSchema } from "../schema/UserAuthSchemas";
import useUserAuth from "../store/UserAuthStore";
import "../css/UserLoginOrRegister.css";

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
      // navigate("/");
      document.location.href = "/cookie"
    } catch {
      setLoginError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
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
        />
        {emailError != "" && <p style={{ color: "red" }}>{emailError}</p>}
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
        />
        {passwordError.length > 0 && (
          <div style={{ color: "red" }}>
            {passwordError.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <button onClick={handleLogin}>Log in</button>
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
