import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

import useUserAuth from "../store/UserAuthStore";
import Card from "../components/card/Card";
import Button from "../components/button/Button";
import BackIcon from "../components/utilityIcons/BackIcon";
import SettingsModal from "../components/modal/SettingsModal";
import EditIcon from "../components/utilityIcons/EditIcon";

import NeutralMascot from "../components/mascots/NeutralMascot";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const logout = useUserAuth((s) => s.logout);
  const navigate = useNavigate();
  const [settingsMode, setSettingsMode] = useState<"name" | "password" | null>(
    null,
  );
  const { user } = useUserAuth();

  const currentLang = (i18n.resolvedLanguage ?? "en").startsWith("id")
    ? "id"
    : "en";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("settings.logoutFailed")));
    }
  };

  const handleLanguageChange = (lang: "en" | "id") => {
    if (lang === currentLang) return;
    i18n.changeLanguage(lang);
    toast.success(t("settings.languageChanged"));
  };

  return (
    <div className="pb-16 min-h-screen bg-background">
      <div className="bg-surface px-4 py-5 flex items-center gap-3 sticky top-0 z-10 shadow-sm border-b-2 border-border">
        <button onClick={() => navigate(-1)}>
          <BackIcon width={28} height={28} />
        </button>
        <h1 className="text-xl font-semibold">{t("settings.title")}</h1>
      </div>

      <Card>
        <div className="p-4 border-b border-border mb-4 flex items-center justify-between">
          <div className="bg-primary/10 p-2 rounded-full">
            <NeutralMascot width={60} height={60} />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{user?.name}</p>
            <p className="text-md font-medium text-text-secondary">
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSettingsMode("name")}
          className="w-full flex items-center justify-between p-4 hover:bg-background transition-colors rounded-xl"
        >
          <span className="font-semibold text-text-primary">
            {t("settings.changeName")}
          </span>
          <EditIcon width={24} height={24} className="text-text-secondary" />
        </button>

        <div className="h-[1px] bg-border mx-4"></div>

        <button
          onClick={() => setSettingsMode("password")}
          className="w-full flex items-center justify-between p-4 hover:bg-background transition-colors rounded-xl"
        >
          <span className="font-semibold text-text-primary">
            {t("settings.changePassword")}
          </span>
          <EditIcon width={24} height={24} className="text-text-secondary" />
        </button>

        <div className="h-[1px] bg-border mx-4"></div>

        <div className="p-4">
          <p className="font-semibold text-text-primary mb-3">
            {t("settings.language")}
          </p>
          <div className="flex gap-3">
            <Button
              variant={currentLang === "en" ? "primary" : "outline"}
              size="sm"
              onClick={() => handleLanguageChange("en")}
            >
              EN
            </Button>
            <Button
              variant={currentLang === "id" ? "primary" : "outline"}
              size="sm"
              onClick={() => handleLanguageChange("id")}
            >
              ID
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-8 flex items-center justify-center">
        <Button onClick={handleLogout}>{t("settings.logout")}</Button>
      </div>

      <SettingsModal
        mode={settingsMode}
        onClose={() => setSettingsMode(null)}
      />
    </div>
  );
}
