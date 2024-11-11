`use client';`
import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { IoMdCheckmark } from "react-icons/io";
import { useState } from "react";
import { getCookies } from "./auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, usePathname} from "next/navigation";
import { useContext } from "react";
import { UserContext } from "./context/usercontext";

export default function Others() {
    const [isOnline, setIsOnline] = useState('online');
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const {fetchAuthUser, authUser} = useContext(UserContext);
    const [activeBoard, setActiveBoard] = useState(authUser?.board_name);

    const API = process.env.NEXT_PUBLIC_API_URL;

    const deleteAccount = async () => {
        try {
            const cookies = await getCookies();
            const csrftoken = cookies.cookies.csrftoken;
            const res = await axios.delete(`${API}/delete/`, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrftoken,
                },
            });
            toast.success(t('Account deleted successfully'));
            router.push('/login');
        } catch (err) {
            toast.error(t('Error deleting account'));
        }
    };

    const handelColorChange = async (color, board_name) => {
        try {
            const cookies = await getCookies();
            const csrftoken = cookies.cookies.csrftoken;
            const res = await axios.put(`${API}/update/`, {
                color: color,
                board_name: board_name,
            }, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrftoken,
                },
            });
            setActiveBoard(res.data?.board_name);
            toast.success(t('Color changed successfully'));
        } catch (err) {
            toast.error(t('Error changing color'));
        }
    }
useEffect(() => {
    fetchAuthUser();
}, [pathname]);
  return (
    <>
    <div className="text-white w-full h-full flex items-center laptop:justify-center flex-col
            overflow-y-auto no-scrollbar laptop:flex-row
             ">
            <div className="bg-[#1A1F26] bg-opacity-80 h-[550px] laptop:w-[400px] border-[0.5px] border-white border-opacity-20
            rounded-[50px] flex flex-col less-than-tablet:w-[90%] tablet:w-[90%] desktop:w-[718px] mt-5 laptop:mt-0 mr-3
            less-than-tablet:pt-5 laptop:ml-2 less-than-mobile:ml-3
            ">
                <h1 className="
                tablet:text-[25px] tablet:h-[20%] flex justify-center items-center text-white opacity-50
                less-than-tablet:text-[20px] less-than-tablet:h-[10%]
                ">
                    {t("Game Appearance")}
                </h1>
                <h1 className="tablet:text-[20px] ml-5 h-[10%]
                    less-than-tablet:text-[18px] less-than-tablet:mt-2
                        less-than-mobile:text-[16px] less-than-mobile:mt-2
                    ">
                    {t("Default board skin")}
                </h1>
                <div className="flex justify-center  w-full less-than-tablet:my-4">
                    <button onClick={() => handelColorChange('#0B4464', 'df')}
                    className="flex justify-center items-center border desktop:w-32 desktop:h-32
                                laptop:w-20 laptop:h-20 rounded-full bg-[#0B4464]
                                w-16 h-16 less-than-mobile:w-14 less-than-mobile:h-14 tablet:w-24 tablet:h-24
                                ml-2
                            ">
                        {activeBoard === 'df' && <IoMdCheckmark className="w-[48px] h-[48px] text-white"/>}
                    </button>
                    <button onClick={() => handelColorChange('#001F54', 'bd1')}
                        className="flex justify-center items-center border desktop:w-32 desktop:h-32 laptop:w-20 laptop:h-20 
                            w-16 h-16 less-than-mobile:w-14 less-than-mobile:h-14 mx-6 tablet:w-24 tablet:h-24
                            rounded-full  bg-[#001F54]">
                            {activeBoard === 'bd1' && <IoMdCheckmark className="w-[48px] h-[48px] text-white"/>}
                    </button>
                    <button onClick={() => handelColorChange('#872341', 'bd2')}
                    className="flex justify-center items-center border desktop:w-32 desktop:h-32 laptop:w-20
                        laptop:h-20 rounded-full  bg-[#872341]
                        w-16 h-16 less-than-mobile:w-14 less-than-mobile:h-14 tablet:w-24 tablet:h-24 mr-2
                    ">
                        {activeBoard === 'bd2' && <IoMdCheckmark className="w-[48px] h-[48px] text-white"/>}
                    </button>
                </div>
                   <h1 className="text-[20px] ml-5 
                            less-than-tablet:text-[18px] less-than-tablet:mt-2
                          less-than-mobile:text-[16px] less-than-mobile:mt-12
                          text-start w-full my-5 
                          ">
                      {t("Default game mode")}
                  </h1>
                      <div className=" w-[90%] border border-white border-opacity-40 flex items-center
                       justify-between rounded-[50px] ml-5 less-than-tablet:ml-4
                       less-than-mobile:ml-2 mb-5 tablet:h-[80px] less-than-tablet:h-[50px]
                       ">
                           <div className=" w-1/2 h-full bg-opacity-50 border-r-[0.5px] border-white border-opacity-40
                           ">
                               <button onClick={() => setIsOnline('online')}
                               className={`tablet:text-[20px] flex justify-center items-center w-full h-full text-white underline-offset-8
                                        less-than-tablet:text-[16px]

                               ${isOnline === 'online' ? 'underline bg-black rounded-l-[50px]' : ''}`}>
                                {t("Online")}
                               </button>
                           </div>
                           <div className=" w-1/2 h-full  bg-opacity-50
                           ">
                               <button onClick={() => setIsOnline('offline')}
                               className={`tablet:text-[20px] flex justify-center items-center w-full h-full text-white underline-offset-8
                                            less-than-tablet:text-[16px]
                               ${isOnline === 'offline' ? 'underline bg-black  rounded-r-[50px]' : ''}
                               `}>
                                   {t("Offline")}
                               </button>
                           </div>
                </div>
            </div>
            <div className=" bg-[#1A1F26] bg-opacity-80 h-[550px] laptop:w-[400px] border-[0.5px] border-white border-opacity-20
                 rounded-[50px] flex flex-col less-than-tablet:w-[90%] tablet:w-[90%] desktop:w-[663px] mt-5 laptop:mt-0
                 less-than-tablet:pt-5 laptop:mr-2 ">
                     <h1 className=" tablet:text-[25px] my-5 h-[20%] flex justify-center items-center text-[#FF0000] opacity-70
                        less-than-tablet:text-[20px] less-than-tablet:h-[10%]
                     ">
                         {t("Don't mess here")}
                     </h1>
                     <h1 className="
                         tablet:text-[20px] ml-5 pb-4 text-[#FF0000] border-b-[0.5px] border-white border-opacity-40 w-[90%]
                            less-than-tablet:text-[18px] less-than-tablet:h-[10%] 
                         ">
                         {t("Delete account")}
                     </h1>
                     <p className=" tablet:text-sm ml-5 mt-6 w-[65%] -tracking-tight
                                less-than-tablet:text-xs 
                     ">
                         {t("NB. Once you delete your account, there is no going back. Please be certain!")}
                     </p>
                     <div className=" flex w-full items-center justify-center rounded-[50px] mt-2">
                     <button onClick={deleteAccount}
                        className="rounded-[50px] mt-5 border-[0.5px] border-white border-opacity-40 
                            less-than-tablet:h-[50px] tablet:h-[80px] w-[90%] bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70">
                         <h1 className="text-[22px] text-center text-[#FF0000] 
                         ">{t("Delete your account")}</h1>
                     </button>
                     </div>
                     <div className=" flex items-center w-full justify-center rounded-[50px] mt-5">
                     <button className="rounded-[50px] w-[90%] mb-5 border-[0.5px] border-white border-opacity-40
                        less-than-tablet:h-[50px] tablet:h-[80px] bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70">
                         <h1 className="tablet:text-[22px] text-center 
                         less-than-tablet:text-[18px] less-than-mobile:text-[15px] 
                         ">{t("Anonymize account information")}</h1>
                     </button>
                     </div>
                </div>
        </div>

    </>
  );
}
