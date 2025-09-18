import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { emailSchema, passwordSchema } from "../schema/UserAuthSchemas";
import useUserAuth from "../store/UserAuthStore";
// // import axios from "axios";
// import useUserInfo from "../store/UserAuthStore";

function UserRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState<String[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const login = useUserAuth((s) => s.login);

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

  const navigate = useNavigate();

  const handleLogin = async () => {
    handleEmailValidation();
    handlePasswordValidation();
    if (!email || !password || emailError !== "" || passwordError.length > 0) {
      return; // Stop if there are errors
    }

    try {
      await login(email, password);
      navigate("/");
    } catch {
      return (
        <div>Invalid email or password</div>
      )
    }

    // Simulate backend response
    // const fakeToken = "fake-jwt-token";
    // const fakeUserAuth = {
    //   userId: "123",
    //   username: email,
    //   token: fakeToken,
    //   isAuth: true,
    // };
    // setUserAuth(fakeUserAuth);

    // navigate("/");
  };

  return (
    <div>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="username"
          id="username"
          value={username}
          onChange={(event) => {
            setUsername(event?.target.value);
          }}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => {
            setEmail(event?.target.value);
            handleEmailValidation();
          }}
          required
        />
        {emailError != "" && <p style={{ color: "red" }}>{emailError}</p>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="text"
          id="password"
          value={password}
          onChange={(event) => {
            setPassword(event?.target.value);
            handlePasswordValidation();
          }}
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
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="text"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event?.target.value);
          }}
          required
        />
        {confirmPasswordError && (
          <div style={{ color: "red" }}>{confirmPasswordError}</div>
        )}
      </div>
      <button onClick={handleLogin}>Register</button>
      <div style={{ marginTop: "1rem" }}>
        <span>Already have an account? </span>
        <button
          type="button"
          style={{
            color: "aqua",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
      </div>
    </div>
  );
}
export default UserRegister;
