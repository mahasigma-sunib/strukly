import React, { useState, useEffect } from "react";

import { passwordSchema } from "../../schema/UserAuthSchemas";

import Popup from "../popup/PopUp";
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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const passVal = passwordSchema.safeParse(formData.password);

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
    setError("");
    setSuccessMessage("");
  }, [mode, user]);

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    try {
      if (mode === "name") {
        if (!formData.name.trim()) throw new Error("Name cannot be empty");
        await changeUsername(formData.name);
        setSuccessMessage("Name updated successfully");
      } else if (mode === "password") {
        if (!passVal.success)
          throw new Error(
            passVal.error.issues[0].message,
          );
        await changePassword(formData.oldPassword, formData.password);
        setSuccessMessage("Password changed successfully");
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (e: any) {
      setError(e.message || "An error occurred");
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
              className="w-full bg-background border-2 border-border rounded-xl p-3 focus:border-primary outline-none transition-all"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your name"
            />
          </div>
        )}

        {mode === "password" && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary">
                Old Password
              </label>
              <input
                className="w-full bg-background border-2 border-border rounded-xl p-3 focus:border-primary outline-none transition-all"
                type="password"
                value={formData.oldPassword}
                onChange={(e) =>
                  setFormData({ ...formData, oldPassword: e.target.value })
                }
                placeholder="Old password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary">
                New Password
              </label>
              <input
                className="w-full bg-background border-2 border-border rounded-xl p-3 focus:border-primary outline-none transition-all"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="New password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary">
                Confirm Password
              </label>
              <input
                className={`w-full bg-background border-2 rounded-xl p-3 outline-none transition-all ${
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-border focus:border-primary"
                }`}
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Confirm new password"
              />
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
            </div>
          </>
        )}

        {error && (
          <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

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
