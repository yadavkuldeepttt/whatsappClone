import React, { useEffect } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
function login() {
  const router = useRouter();
  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  useEffect(() => {
    if (userInfo?.id && !newUser) router.push("/");
  }, [userInfo, newUser]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName: name, email, photoURL: profileImage },
    } = await signInWithPopup(firebaseAuth, provider);
    try {
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email });
        console.log({ data });

        if (!data.status) {
          dispatch({ type: reducerCases.SET_NEW_USER, newUser: true });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: { name, email, profileImage, status: "" },
          });
          router.push("/onboarding");
        } else {
          const {
            id,
            name,
            email,
            profilePicture: profileImage,
            status,
          } = data.data;
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: { id, name, email, profileImage, status },
          });
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex justify-center items-center bg-panel-header-background w-screen h-screen flex-col gap-6">
      <div className="flex items-center text-white gap-2">
        <Image
          src="/whatsapp.gif"
          alt="Whatsapp"
          height={300}
          width={300}></Image>
        <span className="text-7xl">Whatsapp</span>
      </div>

      <button
        className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
        onClick={handleLogin}>
        <FcGoogle className="text-4xl" />
        <span className="text-white text-2xl">Login with Google</span>
      </button>
    </div>
  );
}

export default login;
