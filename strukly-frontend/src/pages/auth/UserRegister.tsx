import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { emailSchema, passwordSchema } from "./schema/UserAuthSchemas";
import useUserAuth from "../../store/UserAuthStore";

function UserRegister() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState<String[]>([]);
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
    } catch (error: any) {
      setRegisterError(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center min-h-[90vh]">
      <h1 className="my-8">Strukly</h1>

      <div>
        <input
          type="username"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(event) => {
            setUsername(event?.target.value);
          }}
          required
          className="w-[200px] p-2.5 border border-black rounded text-base mx-auto block
                    focus:outline-none focus:border-black focus:shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]"
        />
      </div>
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
      <div>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event?.target.value);
          }}
          required
          className="w-[200px] p-2.5 border border-black rounded text-base mx-auto block
                    focus:outline-none focus:border-black focus:shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]"
        />
        {confirmPasswordError && (
          <div style={{ color: "red" }}>{confirmPasswordError}</div>
        )}
      </div>
      <button onClick={handleRegister} className="rounded cursor-pointer my-2">
        Register
      </button>
      <div>
        <span>Already have an account?</span>
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
      <div>
        {registerError != "" && <p className="text-red-600">{registerError}</p>}
      </div>
    </div>
  );
}
export default UserRegister;
