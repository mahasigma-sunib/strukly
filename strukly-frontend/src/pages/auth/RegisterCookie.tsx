import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserAuth from "../../store/UserAuthStore";

export default function RegisterCookie() {
  const navigate = useNavigate();
  const userAuthStore = useUserAuth();

  // run once when component mounts
  useEffect(() => {
    (async () => {
      await userAuthStore.fetchProfile();
    })();
  }, []);

  useEffect(() => {
    if (userAuthStore.user) {
      console.log("win");
      navigate("/home");
    }
    console.log("huh");
  }, [userAuthStore.user]);

  return <div>Loading...</div>;
}
