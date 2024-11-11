'use client';
import React, { useEffect } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import { FaFlag } from "react-icons/fa6";
import { PiLockKeyFill } from "react-icons/pi";
import Information from "../../components/information";
import Language from "../../components/language";
import Security from "../../components/security";
import Others from "../../components/others";
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { UserContext } from "../../components/context/usercontext";
import { useContext } from "react";
import { usePathname } from "next/navigation";

export default function Home() {
    const [activeComponent, setActiveComponent] = useState('information');
    const { t } = useTranslation();
    const { authUser, loading, fetchAuthUser } = useContext(UserContext);
    const pathname = usePathname();

  const renderComponent = () => {
    switch (activeComponent) {
      case 'information':
        return <Information />;
      case 'language':
        return <Language />;
      case 'security':
        return <Security />;
      case 'others':
        return <Others />;
      default:
        return <Information />;
    }
  };
  useEffect(() => {
    !authUser && fetchAuthUser();
  }
  , [ pathname ]);
  return (
    <div className="text-white flex laptop:justify-center min-h-[1000px] tablet:justify-start less-than-tablet:justify-center w-screen h-screen ">
        <div className="border-[0.5px] border-white flex h-[85%] laptop:w-[75%] rounded-[50px] border-opacity-40
             bg-black bg-opacity-70 flex-col items-center mobile:w-full tablet:w-[80%] less-than-tablet:w-[90%]
             less-than-tablet:h-[75%] less-than-tablet:pb-5 tablet:pt-[57px] less-than-mobile:w-[200px] less-than-mobile:h-[80vh]
             less-than-mobile:overflow-auto
             ">
            <div className=" flex items-center justify-evenly desktop:w-[73%] desktop:h-[100px]
                            border-[0.5px] border-white border-opacity-40 laptop:h-[80px]
                            rounded-full  tablet:w-[90%]  tablet:h-[60px]
                            less-than-tablet:border-0 less-than-tablet:w-[90%] less-than-tablet:rounded-none
                            less-than-tablet:h-[50px] less-than-mobile:h-[40px] less-than-mobile:w-[90%] less-than-mobile:mt-5
                            less-than-tablet:mt-5
                            ">
                <button onClick={() => setActiveComponent('information')}
                className={` tablet:bg-[#D9D9D9] bg-opacity-10 rounded-l-[50px]
                    flex items-center justify-center border-r-[0.5px] border-white border-opacity-40 h-full w-[349px]
                      mobile:w-[200px] tablet:w-full less-than-tablet:border-0 less-than-tablet:border-r-0
                      less-than-tablet:rounded-md less-than-tablet:text-sm less-than-tablet:p-2
                      less-than-mobile:w-[100px] less-than-mobile:rounded-l-none less-than-mobile:p-1
                      less-than-mobile:text-[11px] text-white text-opacity-50 tablet:text-opacity-100
                    ${
                        activeComponent === 'information' ? 'tablet:bg-[#D9D9D9] tablet:bg-opacity-10 less-than-tablet:text-white less-than-tablet:text-opacity-100 less-than-tablet:underline underline-offset-4' : 'tablet:bg-transparent'}
                    `}>
                    <IoIosInformationCircle className="desktop:w-[45px] desktop:h-[45px] text-white tablet:mr-1 laptop:mr-2 less-than-tablet:hidden
                      mobile:w-[30px] mobile:h-[30px] less-than-tablet:h-[20px] less-than-tablet:w-[20px]" />
                    <h1 className="laptop:text-[22px] text-center tablet:text-[16px] mobile:text-[16px] flex justify-center">{t("Information")}</h1>
                </button>
                <button onClick={() => setActiveComponent('language')}
                className={`
                    flex items-center justify-center border-r-[0.5px] border-white border-opacity-40 h-full w-[349px] mobile:w-[200px] tablet:w-full
                    less-than-tablet:border-0 less-than-tablet:border-r-0
                      less-than-tablet:rounded-md less-than-tablet:text-sm less-than-mobile:w-[100px] 
                      less-than-mobile:rounded-l-none less-than-mobile:p-1 less-than-mobile:text-[11px] text-white text-opacity-50 tablet:text-opacity-100
                    ${
                        activeComponent === 'language' ? 'tablet:bg-[#D9D9D9] tablet:bg-opacity-10 less-than-tablet:text-white less-than-tablet:text-opacity-100 less-than-tablet:underline underline-offset-4' 
                        : 'tablet:bg-transparent'}
                `}>
                    <FaFlag className="desktop:w-[45px] desktop:h-[45px] text-white tablet:mr-1 laptop:mr-2 less-than-tablet:hidden
                      mobile:w-[30px] mobile:h-[30px] less-than-tablet:h-[20px] less-than-tablet:w-[20px]" />
                    <h1 className="laptop:text-[22px] text-center tablet:text-[16px] mobile:text-[16px] ">{t("Language")}</h1>
                </button>
                <button onClick={() => setActiveComponent('security')}
                className={`
                    flex items-center justify-center h-full w-[349px] mobile:w-[200px] tablet:w-full
                    less-than-tablet:border-0 less-than-tablet:border-r-0
                      less-than-tablet:rounded-md less-than-tablet:text-sm  border-r-[0.5px] border-white border-opacity-40 less-than-mobile:w-[100px] 
                      less-than-mobile:rounded-l-none less-than-mobile:p-1 less-than-mobile:text-[11px] text-white text-opacity-50 tablet:text-opacity-100
                    ${
                        activeComponent === 'security' ? 'tablet:bg-[#D9D9D9] tablet:bg-opacity-10 less-than-tablet:text-white less-than-tablet:text-opacity-100 less-than-tablet:underline underline-offset-4' : 'tablet:bg-transparent'}
                `}>
                    <PiLockKeyFill className="desktop:w-[45px] desktop:h-[45px] text-white tablet:mr-1 laptop:mr-2 less-than-tablet:hidden
                      mobile:w-[30px] mobile:h-[30px] less-than-tablet:h-[20px] less-than-tablet:w-[20px]" />
                    <h1 className="laptop:text-[22px] text-center tablet:text-[16px] mobile:text-[16px] flex justify-center">{t("Security")}</h1>
                </button>
                <button onClick={() => setActiveComponent('others')}
                className={`
                flex items-center justify-center h-full w-[349px] mobile:w-[200px] tablet:w-full
                rounded-r-[50px]
                less-than-tablet:border-0 less-than-tablet:border-r-0
                      less-than-tablet:rounded-md less-than-tablet:text-sm less-than-mobile:w-[100px]
                       less-than-mobile:rounded-l-none less-than-mobile:p-1 
                      less-than-mobile:text-[11px] text-white text-opacity-50 tablet:text-opacity-100 less-than-tablet:mr-1 
                ${
                    activeComponent === 'others' ? 'tablet:bg-[#D9D9D9] tablet:bg-opacity-10 less-than-tablet:text-white less-than-tablet:text-opacity-100 less-than-tablet:underline underline-offset-4' : 'tablet:bg-transparent'}
            `}>
                    <TfiLayoutGrid3Alt className="desktop:w-[30px] desktop:h-[30px] text-white tablet:mr-1 laptop:mr-2 less-than-tablet:hidden
                      mobile:w-[25px] mobile:h-[25px] less-than-tablet:h-[20px] less-than-tablet:w-[20px]" />
                    <h1 className="laptop:text-[22px] text-center tablet:text-[16px] mobile:text-[16px] flex justify-center">{t("Others")}</h1>
                </button>
            </div>
            {renderComponent()}
        </div>
    </div>
  );
}