`use client';`;
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { IoMdCheckmark } from "react-icons/io";
import { useState } from "react";
import { getCookies } from "./auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, usePathname } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "./context/usercontext";
import DeleteConfirmation from "./DeleteConfirmation";

export default function Others() {
  const [isOnline, setIsOnline] = useState("online");
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { fetchAuthUser, authUser } = useContext(UserContext);
  const [activeBoard, setActiveBoard] = useState(authUser?.board_name);
  const [showDialog, setShowDialog] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handelColorChange = async (color, board_name) => {
    try {
      const cookies = await getCookies();
      const csrftoken = cookies.cookies.csrftoken;
      const res = await axios.put(
        `${API}/update/`,
        {
          color: color,
          board_name: board_name,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrftoken,
          },
        }
      );
      setActiveBoard(res.data?.board_name);
      toast.success(t("Color Changed Successfully"));
    } catch (err) {
      toast.error(t("Error Changing Color"));
    }
  };

  const handelClick = () => {
    setShowDialog(true);
  };


  useEffect(() => {
    fetchAuthUser();
  }, [pathname]);
  return (
    <>
      <div
        className="text-white w-full h-full flex items-center laptop:justify-center flex-col
            overflow-y-auto no-scrollbar laptop:flex-row min-w-[300px]
             "
      >
        <div
          className="bg-[#1A1F26] bg-opacity-80 h-[550px] laptop:w-[400px] border-[0.5px] border-white border-opacity-20
          rounded-[50px] flex flex-col w-[90%] tablet:w-[90%] desktop:w-[663px] mt-5 laptop:mt-0
           laptop:mx-2
           "
        >
          <h1
            className="
            tablet:text-[25px] flex justify-center items-center text-white opacity-50
            text-[20px] h-[10%] mt-5
            "
          >
            {t("Game Appearance")}
          </h1>
            <div className="
                flex flex-col w-full items-center justify-center rounded-[50px] mt-5 h-[55%] 
            ">
          <h1
            className="tablet:text-[20px] ml-5 h-[10%] w-full
            mt-2
            text-[16px]  my-10
            "
          >
            {t("Default board skin")}
          </h1>
          <div className="flex justify-center items-center  w-full ">
            <button
              onClick={() => handelColorChange("#0B4464", "df")}
              className="flex justify-center items-center border desktop:w-32 desktop:h-32
                                laptop:w-20 laptop:h-20 rounded-full bg-[#0B4464]
                                w-14 h-14 tablet:w-24 tablet:h-24
                                ml-2
                            "
            >
              {activeBoard === "df" && (
                <IoMdCheckmark className="w-[48px] h-[48px] text-white" />
              )}
            </button>
            <button
              onClick={() => handelColorChange("#001F54", "bd1")}
              className="flex justify-center items-center border desktop:w-32 desktop:h-32 laptop:w-20 laptop:h-20 
                            w-14 h-14 mx-6 tablet:w-24 tablet:h-24
                            rounded-full  bg-[#001F54]"
            >
              {activeBoard === "bd1" && (
                <IoMdCheckmark className="w-[48px] h-[48px] text-white" />
              )}
            </button>
            <button
              onClick={() => handelColorChange("#872341", "bd2")}
              className="flex justify-center items-center border desktop:w-32 desktop:h-32 laptop:w-20
                        laptop:h-20 rounded-full  bg-[#872341]
                        w-14 h-14 tablet:w-24 tablet:h-24 mr-2
                    "
            >
              {activeBoard === "bd2" && (
                <IoMdCheckmark className="w-[48px] h-[48px] text-white" />
              )}
            </button>
          </div>
        </div>
        </div>
        <div className="bg-[#1A1F26] bg-opacity-80 h-[550px] laptop:w-[400px] border-[0.5px] border-white border-opacity-20
          rounded-[50px] flex flex-col w-[90%] tablet:w-[90%] desktop:w-[663px] mt-5 laptop:mt-0
           laptop:mr-2
           ">
                     <h1 className=" tablet:text-[25px] my-5 h-[20%] flex justify-center items-center text-[#FF0000] opacity-70
                        text-[20px]
                     ">
                         {t("Don't mess here")}
                     </h1>
                     <h1 className="tablet:text-[20px] ml-5 pb-4 text-[#FF0000] border-b-[0.5px] border-white border-opacity-40 w-[90%]
                            text-[18px] h-[10%]">
                         {t("Delete account")}
                     </h1>
                     <p className=" tablet:text-sm ml-5 mt-6 w-[65%] -tracking-tight text-xs">
                         {t("NB. Once you delete your account, there is no going back. Please be certain!")}
                     </p>
                     <div className=" flex w-full items-center justify-center rounded-[50px] mt-2">
                     <button onClick={handelClick}
                        className="rounded-[50px] mt-5 border-[0.5px] border-white border-opacity-40 
                            h-[50px] tablet:h-[80px] w-[90%] bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70">
                         <h1 className="text-[22px] text-center text-[#FF0000] 
                         ">{t("Delete your account")}</h1>
                     </button>
            </div>
          <div className=" flex items-center w-full justify-center rounded-[50px] mt-5">
            <button
              className="rounded-[50px] w-[90%] mb-5 border-[0.5px] border-white border-opacity-40
                        h-[50px] tablet:h-[80px] bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70"
            >
              <h1
                className="tablet:text-[22px] text-center 
                         text-[15px] 
                         "
              >
                {t("Anonymize account information")}
              </h1>
            </button>
          </div>
          {showDialog && (<DeleteConfirmation isOpen={showDialog} setIsOpen={setShowDialog} />)}
        </div>
      </div>
    </>
  );
}
