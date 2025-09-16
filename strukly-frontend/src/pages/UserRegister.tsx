import { useState } from "react";
// // import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserInfo from "../store/UserInfoStore";
import { emailSchema, passwordSchema } from "../schema/UserAuthSchemas";

function UserRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState<String[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

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
  const handleConfirmPasswordValidation = () => {
    if (confirmPassword !== password) {
      setConfirmPasswordError("Password do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const navigate = useNavigate();

  const setUserInfo = useUserInfo((state) => state.setUserInfo);
  const handleLogin = async () => {
    handleEmailValidation();
    handlePasswordValidation();
    if (!email || !password || emailError !== "" || passwordError.length > 0) {
      return; // Stop if there are errors
    }
    // try {
    //   const res = await axios.post("", { email, password });
    //   if(res.data && res.data.token) {
    //     localStorage.setItem("jwt_token", res.data.token);
    //     setUserInfo(res.data.userInfo);
    //     navigate("/");
    //   }
    // } catch (err) {}

    // Simulate backend response
    const fakeToken = "fake-jwt-token";
    const fakeUserInfo = { userId: "123", username: email };

    localStorage.setItem("jwt_token", fakeToken);
    setUserInfo(fakeUserInfo);
    navigate("/");
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
            handleConfirmPasswordValidation();
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
            handleConfirmPasswordValidation();
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
