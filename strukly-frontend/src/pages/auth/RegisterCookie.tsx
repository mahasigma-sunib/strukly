import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useUserAuth from "../../store/UserAuthStore";

export default function RegisterCookie() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userAuthStore = useUserAuth();
  const [loadFailed, setLoadFailed] = useState(false);

  // run once when component mounts
  useEffect(() => {
    (async () => {
      await userAuthStore.fetchProfile();
      if (!useUserAuth.getState().user) {
        setLoadFailed(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (userAuthStore.user) {
      // console.log("win");
      navigate("/home");
    }
    // console.log("huh");
  }, [userAuthStore.user]);

  if (loadFailed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-full max-w-sm bg-status-error/10 border border-status-error/20 p-3 rounded-2xl flex items-center gap-3">
          <div className="bg-status-error text-white rounded-full p-3 h-5 w-5 flex items-center justify-center text-sm font-bold">
            !
          </div>
          <p className="text-status-error text-sm font-bold">
            {t("auth.cookie.failed")}
          </p>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="font-extrabold text-primary cursor-pointer hover:underline"
        >
          {t("auth.cookie.backToLogin")}
        </button>
      </div>
    );
  }

  return <div>{t("common.loading")}</div>;
}
