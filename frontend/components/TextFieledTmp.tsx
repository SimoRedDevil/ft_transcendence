import React from "react";

function TextFieledTmp({ 
    title, 
    label1,
    label2,
    label3,
    type,
    defaultValue1,
    defaultValue2,
    defaultValue3
}) {
    return (
        <div className="bg-[#1A1F26] bg-opacity-50 laptop:h-[90%] laptop:w-[691px] border-[0.5px]
        border-white border-opacity-40 rounded-[50px] flex flex-col less-than-tablet:my-10
          less-than-tablet:mb-10 w-[90%] tablet:h-[500px] tablet:my-5 laptop:mx-3 
          ">
            <h1 className="laptop:text-[25px] flex w-full h-[150px] items-center justify-center text-white opacity-50
            tablet:text-[20px]
                less-than-tablet:text-[20px] less-than-tablet:mt-2
            ">{title}
            </h1>
            <div>
            <div className="
            flex flex-col items-start w-full pl-5
            ">
                <h1 className="
                text-white w-full opacity-70 laptop:text-[22px] tablet:text-[18px] less-than-tablet:text-[20px] 
                    text-start
                ">
                    {label1}
                </h1>
                <input type={type} defaultValue={defaultValue1} className="less-than-tablet:w-[90%] laptop:h-[70px] rounded-[50px] mt-2
                    bg-white bg-opacity-10 text-white p-4 border-[0.5px] border-gray-500 focus:outline-none mb-7
                    h-[50px] less-than-tablet:mb-3 tablet:w-[80%]
                    
                    "/>
            </div>
            <div className="
            flex flex-col items-start w-full pl-5
            ">
                <h1 className="
                text-white w-full opacity-70 laptop:text-[22px] tablet:text-[18px] less-than-tablet:text-[20px] 
                text-start
                ">
                    {label2}
                </h1>
                <input type={type} defaultValue={defaultValue2} className="less-than-tablet:w-[90%] laptop:h-[70px] rounded-[50px] mt-2
                    bg-white bg-opacity-10 text-white p-4 border-[0.5px] border-gray-500 focus:outline-none mb-7
                    h-[50px] less-than-tablet:mb-3 tablet:w-[80%]
                    "/>
                </div>
                <div className="
                flex flex-col items-start w-full pl-5 pb-4
                ">
                <h1 className="
                text-white w-full opacity-70 laptop:text-[22px] tablet:text-[18px] less-than-tablet:text-[20px] 
                text-start
                ">
                    {label3}
                </h1>
                <input type={type} placeholder={defaultValue3} className="less-than-tablet:w-[90%] laptop:h-[70px] rounded-[50px] 
                    bg-white bg-opacity-10 text-white p-4 border-[0.5px] border-gray-500 focus:outline-none 
                    h-[50px] less-than-tablet:mb-3 tablet:w-[80%] 
                    "/>
                </div>
            </div>
        </div>
    );
    }
export default TextFieledTmp;