'use client';
import React from "react";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

export default function passwordHelper(){
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return(
        <div className="flex flex-col w-10/12 ">
        <label className=" text-[#949DA2] text-sm">Password</label>
        <div className="relative flex">
        <input type={showPassword ? "text" : "password"} className=" border-b-[1px] border-[#949DA2] mb-4 h-[34px] w-full
        focus:outline-none bg-[#131E24] password-circles 
        " />
        <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-0.5 text-[#949DA2] focus:outline-none">
                {showPassword ? (
                    <FaEyeSlash className="text-[#949DA2]" />
                ) : (
                    <FaEye className="text-[#949DA2]" />
                )}
            </button>
        </div>
    </div>
    );
}