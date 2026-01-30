import React, { useState, useEffect } from "react";

import { passwordSchema } from "../../schema/UserAuthSchemas";

import Popup from "../popup/PopUp";
import ErrorMessage from "../ErrorMessage";
import Button from "../button/Button";
import useUserAuth from "../../store/UserAuthStore";
import CloseIcon from "../utilityIcons/CloseIcon";

type SettingsMode = "name" | "password" | null;

interface SettingsModalProps {
  mode: SettingsMode;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ mode, onClose }) => {
  const { user, changeUsername, changePassword } = useUserAuth();
  const [formData, setFormData] = useState({
    name: "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  // const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const nameValidate = formData.name.trim().length > 0;
  const oldPasswordValidate = formData.oldPassword.trim().length > 0;
  const passwordValidate = passwordSchema.safeParse(formData.password);
  const confirmPasswordValidate =
    formData.confirmPassword && formData.password == formData.confirmPassword;

  useEffect(() => {
    if (mode === "name" && user) {
      setFormData((prev) => ({ ...prev, name: user.name }));
    } else {
      setFormData({
        name: "",
        oldPassword: "",
        password: "",
        confirmPassword: "",
      });
    }
    // setError("");
    setSuccessMessage("");
  }, [mode, user]);

  const handleSubmit = async () => {
    // setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (mode === "name") {
        if (!nameValidate) throw new Error();
        await changeUsername(formData.name);
        setSuccessMessage("Name updated successfully");
      } else if (mode === "password") {
        if (!oldPasswordValidate || !passwordValidate.success || !confirmPasswordValidate)
          throw new Error();
        await changePassword(formData.oldPassword, formData.password);
        setSuccessMessage("Password changed successfully");
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (e: any) {
      // setError(e.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mode) return null;

  return (
    <Popup visible={!!mode} onClose={onClose}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {mode === "name" ? "Change Name" : "Change Password"}
        </h2>
        <div onClick={onClose} className="cursor-pointer text-slate-500">
          <CloseIcon width={24} height={24} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {mode === "name" && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">
              Name
            </label>
            <input
              className={`w-full p-4 border-2 rounded-2xl text-base font-extrabold transition-all duration-200
                bg-background focus:outline-none focus:ring-4 focus:ring-primary/10`}
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your name"
            />
            {!nameValidate && (
              <ErrorMessage>Name can't be empty</ErrorMessage>
            )}
          </div>
        )}

        {mode === "password" && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary">
                Old Password
              </label>
              <input
                className={`w-full p-4 border-2 rounded-2xl text-base font-extrabold transition-all duration-200
                bg-background focus:outline-none focus:ring-4 focus:ring-primary/10
                ${
                  !oldPasswordValidate
                    ? "border-status-error bg-status-error/5"
                    : "border-border focus:border-primary"
                }`}
                type="password"
                value={formData.oldPassword}
                onChange={(e) =>
                  setFormData({ ...formData, oldPassword: e.target.value })
                }
                placeholder="Old password"
              />
              {!oldPasswordValidate && (
                <ErrorMessage>Please input the old password</ErrorMessage>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary">
                New Password
              </label>
              <input
                className={`w-full p-4 border-2 rounded-2xl text-base font-extrabold transition-all duration-200
                bg-background focus:outline-none focus:ring-4 focus:ring-primary/10
                ${
                  !passwordValidate.success
                    ? "border-status-error bg-status-error/5"
                    : "border-border focus:border-primary"
                }`}
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="New password"
              />
              {!passwordValidate.success && (
                <ErrorMessage>
                  {passwordValidate.error.issues[0].message}
                </ErrorMessage>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary">
                Confirm Password
              </label>
              <input
                className={`w-full p-4 border-2 rounded-2xl text-base font-extrabold transition-all duration-200
                bg-background focus:outline-none focus:ring-4 focus:ring-primary/10
                ${
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                    ? "border-status-error bg-status-error/5"
                    : "border-border focus:border-primary"
                }`}
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Confirm new password"
              />
              {!confirmPasswordValidate && (
                <ErrorMessage>Password do not match</ErrorMessage>
              )}
            </div>
          </>
        )}

        {/* {error && (
          <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )} */}

        {successMessage && (
          <div className="p-3 bg-green-100 text-green-600 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default SettingsModal;
