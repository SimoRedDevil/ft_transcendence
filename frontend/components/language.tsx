'use client';
import React, { useEffect, useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useTranslation } from 'react-i18next';
import { useContext } from "react";
import { UserContext } from "./context/usercontext";
import axios from "axios";
import { getCookies } from "./auth";

export default function Language() {
    const { i18n, t } = useTranslation();
    const languages = [
        { code: 'en', name: 'English', flag: 'images/uk.png' },
        { code: 'fr', name: 'French', flag: 'images/france.png' },
        { code: 'es', name: 'Spanish', flag: 'images/spain.png' },
    ];

    const{authUser} = useContext(UserContext);
    const [activeLanguage, setActiveLanguage] = useState(authUser?.language || i18n.language);
    const API = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        if (authUser) {
            setActiveLanguage(authUser?.language);
            i18n.changeLanguage(authUser?.language);
        }
    }
    , [authUser, i18n]);
    const handleLanguageChange = async(languageCode) => {
        const body = {
            language: languageCode,
        }
        try {
            const cookies = await getCookies();
            const csrftoken = cookies.cookies.csrftoken;
            const response = await axios.put(
              `${API}/update/`,
              body,
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                  "X-CSRFToken": csrftoken,
                },
              }
            );
            if (response.status === 200) {
              console.log("Language changed to:", languages.find((lang) => lang.code === languageCode).name, "successfully");
            }
          } catch (error) {
            console.log("Error changing language");
          }
        setActiveLanguage(languageCode);
        i18n.changeLanguage(languageCode);
    };

    return (
<div className="text-white w-full h-full flex items-center min-h-[500px] tablet:justify-center less-than-tablet:flex-col overflow-y-auto overflow-x-hidden no-scrollbar">
    <div className="bg-[#1A1F26] bg-opacity-50 mt-10 mx-5 h-[75%] w-[1400px] border-[0.5px] border-white border-opacity-40 rounded-[50px] flex flex-col
                    less-than-tablet:w-[90%] tablet:w-[496px] laptop:w-[696px] desktop:w-[1400px] overflow-y-auto no-scrollbar
                    ">
        <h1 className="laptop:text-[30px] mt-4 h-[20%] flex justify-center items-center text-white opacity-70 less-than-tablet:text-[20px] less-than-tablet:h-[10%] less-than-tablet:mt-10 text-xl">
            {t('Select Language')}
        </h1>
        <div className="flex flex-col items-center h-full mb-10">
            {languages.map(({ code, name, flag }) => (
                <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={`flex items-center w-[596px] h-[100px] border-[0.5px]
                         border-white rounded-full mt-6 border-opacity-40 less-than-tablet:w-[90%]
                         less-than-tablet:h-[100px] less-than-tablet:mt-4
                         laptop:w-[596px] justify-between tablet:w-[450px] ${activeLanguage === code ?
                            code == 'en' && 'bg-gradient-to-r from-[#D90026]/30 to-[#6DA443]/30'
                            || code == 'fr' && 'bg-gradient-to-r from-[#0052B4]/30 to-[#D70027]/30'
                            || code == 'es' && 'bg-gradient-to-r from-[#FCC305]/30 to-[#D2011D]/30': ''}`}>
                    
                    <div className="flex items-center justify-center">
                        <img
                            className="w-[70px] h-[64px] mx-6 less-than-tablet:w-[50px] less-than-tablet:h-[50px]"
                            src={flag}
                            alt={name}
                        />
                        <h1 className="laptop:text-[28px] flex items-start text-white opacity-70 less-than-tablet:text-[22px] tablet:text-[25px] less-than-mobile:text-[20px]">
                            {t(name)}
                        </h1>
                    </div>
                    
                    <div>
                        {activeLanguage === code && (
                            <IoIosCheckmarkCircle className="relative h-[50px] text-white w-[50px] less-than-tablet:w-[30px] less-than-tablet:h-[30px] mr-5 less-than-mobile:w-[20px] less-than-mobile:h-[20px] less-than-mobile:mr-1" />
                        )}
                    </div>
                </button>
            ))}
        </div>
    </div>
</div>

    );
}
