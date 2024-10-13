'use client';
import React from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useState } from "react";

export default function Language(){
    const [activeLanguage, setActiveLanguage] = useState('english');
    return(
        <div className=" text-white w-full h-full flex items-center
         tablet:justify-center less-than-tablet:flex-col overflow-y-auto overflow-x-hidden no-scrollbar
        ">
            <div className=" bg-[#1A1F26] bg-opacity-50 mt-10 mx-5
                h-[75%] w-[1400px] border-[0.5px] border-white border-opacity-40 rounded-[50px] flex flex-col
                less-than-tablet:w-[90%] tablet:w-[496px] laptop:w-[696px] 
                desktop:w-[1400px] overflow-y-auto no-scrollbar
                ">
            <h1 className=" laptop:text-[30px] mt-4 h-[20%] flex justify-center items-center text-white opacity-70
            less-than-tablet:text-[20px] less-than-tablet:h-[10%] less-than-tablet:mt-10
            text-xl
            ">
                Select Language
            </h1>
            <div className="flex flex-col items-center h-full">
                <button onClick={() => setActiveLanguage('arabic')}
                className={` flex items-center w-[596px] h-[100px]
                        border-[0.5px] border-white rounded-full mt-6 border-opacity-40
                        less-than-tablet:w-[90%] less-than-tablet:h-[100px] less-than-tablet:mt-4
                        laptop:w-[596px] justify-between tablet:w-[450px]
                        ${activeLanguage === 'arabic' ? 'bg-gradient-to-r from-[#D90026]/30 to-[#6DA443]/30' : ''}
                        `}>
                    <div className="flex items-center justify-center
                    ">
                        <img className="w-[70px] h-[64px] mx-6
                        less-than-tablet:w-[50px] less-than-tablet:h-[50px]
                        " src="images/morocco.png" alt="morocco" />
                        <h1 className="laptop:text-[28px] flex items-start text-white opacity-70
                        less-than-tablet:text-[22px] tablet:text-[25px] less-than-mobile:text-[20px]
                        ">Arabic</h1>
                    </div>
                    <div>
                        {activeLanguage == 'arabic' && <IoIosCheckmarkCircle className="relative h-[50px] text-white w-[50px]
                        less-than-tablet:w-[30px] less-than-tablet:h-[30px] mr-5
                        less-than-mobile:w-[20px] less-than-mobile:h-[20px] less-than-mobile:mr-1
                        "/>}
                    </div>
                </button>
                <button onClick={() => setActiveLanguage('english')}
                className={` flex items-center w-[596px] h-[100px]
                        border-[0.5px] border-white rounded-full mt-10 border-opacity-40
                        less-than-tablet:w-[90%] less-than-tablet:h-[100px] less-than-tablet:mt-4
                        laptop:w-[596px] justify-between tablet:w-[450px]
                        ${activeLanguage === 'english' ? 'bg-gradient-to-r from-[#BD0034]/30 to-[#1A237B]/30' : ''}
                        `}>
                    <div className="
                    flex items-center justify-center
                    ">
                        <img className="w-[70px] h-[64px] mx-6
                        less-than-tablet:w-[50px] less-than-tablet:h-[50px]
                        " src="images/uk.png" alt="uk" />
                        <h1 className="laptop:text-[28px] flex items-start text-white opacity-70 
                        less-than-tablet:text-[22px] tablet:text-[25px] less-than-mobile:text-[20px]
                        ">English</h1>
                    </div>
                    <div>
                    {activeLanguage == 'english' && <IoIosCheckmarkCircle className="relative h-[50px] text-white w-[50px]
                    less-than-tablet:w-[30px] less-than-tablet:h-[30px] less-than-mobile:w-[20px] less-than-mobile:h-[20px] less-than-mobile:mr-1
                        mr-5
                        " />}
                    </div>
                </button>
                <button onClick={() => setActiveLanguage('french')}
                className={` flex items-center w-[596px] h-[100px]
                        border-[0.5px] border-white rounded-full mt-10 border-opacity-40
                        less-than-tablet:w-[90%] less-than-tablet:h-[100px] less-than-tablet:mt-4
                        laptop:w-[596px] justify-between tablet:w-[450px]
                        ${activeLanguage === 'french' ? 'bg-gradient-to-r from-[#0052B4]/30 to-[#D70027]/30' : ''}
                        `}>
                    <div className="
                    flex items-center justify-center
                    ">
                        <img className="w-[70px] h-[64px] mx-6
                        less-than-tablet:w-[50px] less-than-tablet:h-[50px]
                        " src="images/france.png" alt="france" />
                        <h1 className="laptop:text-[28px] flex items-start text-white opacity-70 
                        less-than-tablet:text-[22px] tablet:text-[25px] less-than-mobile:text-[20px]
                        ">French</h1>
                    </div>
                    <div>
                        {activeLanguage == 'french' && <IoIosCheckmarkCircle className=" relative h-[50px] text-white w-[50px]
                        less-than-tablet:w-[30px] less-than-tablet:h-[30px] less-than-mobile:w-[20px] less-than-mobile:h-[20px] less-than-mobile:mr-1
                            mr-5
                            " />}
                    </div>
                </button>
                <button onClick={() => setActiveLanguage('spanish')}
                className={` flex items-center w-[596px] h-[100px]
                        border-[0.5px] border-white rounded-full my-10 border-opacity-40
                        less-than-tablet:w-[90%] less-than-tablet:h-[100px] less-than-tablet:mt-4 less-than-tablet:mb-10
                        laptop:w-[596px] justify-between tablet:w-[450px]
                        ${activeLanguage === 'spanish' ? 'bg-gradient-to-r from-[#FCC305]/30 to-[#D2011D]/30' : ''}
                        `}>
                    <div className="
                        flex items-center justify-center
                    ">
                        <img className="w-[70px] h-[64px] mx-6
                        less-than-tablet:w-[50px] less-than-tablet:h-[50px]
                        " src="images/spain.png" alt="spain" />
                        <h1 className="laptop:text-[28px] flex items-start text-white opacity-70 
                        less-than-tablet:text-[22px] tablet:text-[25px] less-than-mobile:text-[20px]
                        ">Spain</h1>
                    </div>
                    <div>
                        {activeLanguage == 'spanish' && <IoIosCheckmarkCircle className="relative h-[50px] text-white w-[50px]
                        less-than-tablet:w-[30px] less-than-tablet:h-[30px] less-than-mobile:w-[20px] less-than-mobile:h-[20px] less-than-mobile:mr-1
                        mr-5
                        " />}
                    </div>
                </button>
            </div>
        </div>
      </div>
    );
}