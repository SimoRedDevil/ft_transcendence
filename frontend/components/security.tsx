import React, { use } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../components/popup";
import { enableTwoFactorAuth } from "./twoFa";
import { useTranslation } from "react-i18next";
import { getCookies } from "./auth";
import { useUserContext } from "../components/context/usercontext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Switch } from "@/components/ui/switch";
import { FaMoon, FaSun } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { ImUnlocked } from "react-icons/im";

export default function Security() {
  const { authUser, setLoading, loading, setTry2fa, try2fa, fetchAuthUser } =
    useUserContext();
  const [enable2FA, setEnable2FA] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [code, setCode] = useState("");
  const [qrcode, setQrcode] = useState("");
  const { t } = useTranslation();
  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      current_password: current_password,
      new_password: new_password,
      confirm_password: confirm_password,
    };

    try {
      const cookies = await getCookies();
      const csrftoken = cookies.cookies.csrftoken;
      const response = await axios.put(`${API}/update/`, body, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
      });
      if (response.status === 200) {
        toast.success(t("Password Changed Successfully"));
      }
    } catch (error) {
      toast.error(t("Password Change Failed, Please Try Again"));
    }
  };

  if (loading || !authUser) {
    return <div>Loading...</div>;
  }

  const getqrcode = async () => {
    try {
      const response = await axios(`${API}/get-qrcode/`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const qr = response.data.qrcode_url;
        setQrcode(qr);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authUser && fetchAuthUser();
    if (authUser?.qrcode_dir) {
      getqrcode();
      setEnable2FA(true);
    } else {
      setQrcode("");
    }
  }, [authUser?.qrcode_dir, enable2FA]);

  useEffect(() => {
    authUser && fetchAuthUser();
  }, [authUser?.qrcode_dir, enable2FA]);
  const handelChange = async () => {
    {
      setIsPopupOpen(true);
      if (!authUser.enabeld_2fa && !try2fa) {
        enableTwoFactorAuth(fetchAuthUser);
        fetchAuthUser();
        setEnable2FA(true);
        setTry2fa(true);
      }
    }
  };

  return (
    <div
      className="text-white w-full h-full flex items-center laptop:justify-center flex-col
        overflow-y-auto no-scrollbar overflow-x-hidden laptop:flex-row">
      <div
        className=" bg-[#1A1F26] bg-opacity-50 border-[0.5px] border-white border-opacity-40 
                rounded-[50px] less-than-tablet:w-[90%] tablet:w-[90%] flex desktop:h-[620px] desktop:w-[1400px]
                less-than-tablet:flex-col tablet:flex-col laptop:flex-row tablet:mt-12 items-center justify-center
                less-than-tablet:mt-5 laptop:h-[700px] laptop:ml-10 mx-2 tablet:pt-5 desktop:mx-5
                "
      >
        <div
          className="flex flex-col w-[90%] laptop:w-1/2 items-center justify-center pr-5 laptop:h-[75%]
          laptop:border-r-[0.5px] border-white border-opacity-40
            less-than-tablet:border-0 less-than-tablet:w-full less-than-tablet:pr-0 
            "
        >
          <div className="flex flex-col items-start w-full pl-5">
            <h1
              className="laptop:text-[22px] w-full text-white opacity-70 
                    less-than-tablet:text-[18px] tablet:text-[20px] less-than-tablet:mt-2 less-than-tablet:ml-3
                    text-start
                    "
            >
              {t("Current Password")}
            </h1>
            <input
              value={current_password}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              className="less-than-tablet:w-[85%] less-than-tablet:ml-4 laptop:h-[70px] tablet:h-[50px] rounded-[50px] mt-2 
                    bg-white bg-opacity-10 text-white p-4 border-[0.5px] border-gray-500 focus:outline-none mb-7
                    less-than-tablet:h-[50px] less-than-tablet:mb-3 tablet:w-[90%] password-circles"
            />
          </div>
          <div className="flex flex-col items-start w-full pl-5 ">
            <h1
              className="laptop:text-[22px] w-full text-white opacity-70 
              less-than-tablet:text-[18px] tablet:text-[20px] less-than-tablet:mt-2 less-than-tablet:ml-3
              text-start"
            >
              {t("New Password")}
            </h1>
            <input
              value={new_password}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              className="less-than-tablet:w-[85%] less-than-tablet:ml-4 tablet:h-[50px] laptop:h-[70px] rounded-[50px] mt-2 
                    bg-white bg-opacity-10 text-white p-4 border-[0.5px] border-gray-500 focus:outline-none mb-7
                    less-than-tablet:h-[50px] less-than-tablet:mb-3 tablet:w-[90%] password-circles 
                    "
            />
          </div>
          <div className="flex flex-col items-start w-full pl-5 ">
            <h1
              className="laptop:text-[22px] w-full text-white opacity-70 
              less-than-tablet:text-[18px] tablet:text-[20px] less-than-tablet:mt-2 less-than-tablet:ml-3
              text-start
                    "
            >
              {t("Confirm Password")}
            </h1>
            <input
              type="password"
              value={confirm_password}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="less-than-tablet:w-[85%] less-than-tablet:ml-4 tablet:h-[50px] laptop:h-[70px] rounded-[50px] mt-2 
                    bg-white bg-opacity-10 text-white p-4 border-[0.5px] border-gray-500 focus:outline-none mb-7
                    less-than-tablet:h-[50px] less-than-tablet:mb-3 tablet:w-[90%] password-circles 
                    "
            />
          </div>
          <div
            className="
                    flex  w-full justify-center 
          "
          >
            <button
              onClick={handleSubmit}
              className="rounded-[50px] border-[0.5px] border-white border-opacity-40 desktop:h-[80px] w-[556px] bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70
                laptop:w-[80%] less-than-tablet:w-[85%] less-than-tablet:mb-3 laptop:h-[60px] laptop:my-7 tablet:h-[50px] 
                less-than-tablet:h-[50px] tablet:w-[75%]
                "
            >
              <h1 className="text-[22px] text-center">{t("Submit")}</h1>
            </button>
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center laptop:w-1/2
            less-than-tablet:border-0 less-than-tablet:w-full less-than-tablet:pr-0"
        >
          {authUser?.enabeld_2fa ? (
            <div>
              <div className="flex flex-col items-center w-full text-lg font-thin text-center">
                <p>{t("Two-factor authentication is enabled")}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-[90%] text-lg font-thin text-center">
              <p className="my-5">
                {t("Protect your account with two-factor authentication")}
              </p>
              <p>
                {t(
                  "Two-factor authentication is an enhanced security feature that requires a six-digit code from your authenticator app in addition to your password."
                )}
              </p>
            </div>
          )}
          <div className="flex items-center space-x-4 my-5">
            <span className="text-lg font-medium">{t("Enable 2FA")}</span>
            <Switch
              colorPalette="blue"
              size="lg"
              checked={authUser?.enabeld_2fa}
              onChange={handelChange}
              trackLabel={{
                on: (
                  <FaLock color="yellow.400">
                    <FaSun />
                  </FaLock>
                ),
                off: (
                  <ImUnlocked color="gray.400">
                    <FaMoon />
                  </ImUnlocked>
                ),
              }}
            />
          </div>
          <div className="flex justify-center">
            {enable2FA && (
              <Popup
                isOpen={isPopupOpen}
                setIsOpen={setIsPopupOpen}
                {...{ enable2FA, setEnable2FA }}
                {...{ code, setCode }}
                qrcode={qrcode}
                setQrcode={setQrcode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
