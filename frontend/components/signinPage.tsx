import React from "react";
import { FaEnvelope, FaUserAlt } from "react-icons/fa";
import PasswordHelper from "./passwordHelper";
import { motion } from "framer-motion";
import Link from "next/link";

interface SigninPageProps {
  onNavigate?: () => void;
}

const SigninPage: React.FC<SigninPageProps> = ({ onNavigate }) => {
  return (
    <motion.form className=" flex flex-col items-center justify-center h-screen w-screen overflow-auto fixed">
      <div
        className="flex items-center justify-center h-full w-full laptop:w-[850px]
      tablet:w-[620px] tablet:h-[770px] desktop:h-[760px] desktop:w-[950px] mobile:w-[500px]
      mobile:h-[700px] laptop:h-[770px]  less-than-mobile:h-[720px] less-than-mobile:w-[500px]  fixed overflow-auto">
        <motion.div
          initial={{ opacity: 1, x: "50%" }}
          animate={{ opacity: 1, x: "0" }}
          transition={{ duration: 0.6 }}
          className="h-full w-1/2 max-xl:w-[400px] bg-[#131E24] rounded-l-[20px] text-sm">
          <img
            className="w-13 h-16 mx-auto mt-[18px]"
            src="/images/logop5.png"
            alt=""
          />
          <h1 className="mobile:text-2xl font-bold text-center tablet:mt-[19px] mb-[34px] text-white less-than-tablet:text-sm less-than-tablet:mb-2 less-than-tablet:mt-2">
            Sign In
          </h1>
          <div className="flex flex-col justify-center items-center text-white">
            <div className="flex justify-around border-[1px] border-gray-500 hover:bg-[#1E2E36] bg-transparent h-[46px] less-than-mobile:w-[90%]  mobile:w-[90%] w-[75%] rounded-[20px] mt-4
             bg-[#293B45] rounded-tl-[10px] rounded-bl-[20px] rounded-tr-[20px] rounded-br-[10px] text-[19px] mobile:h-[48px]">
              <div
                className={`flex items-center justify-around text-white w-[55%] less-than-mobile:text-xs
                 border-gray-500 rounded-tl-[10px] rounded-br-[10px] 
                rounded-tr-[20px] text-sm border-r-2
                rounded-bl-[20px]
                ${onNavigate ? "bg-[#293B45]" : "bg-[#131E24]"}`}
              >
                Login
              </div>
              <button
                onClick={onNavigate}
                className="text-white rounded-tl-[10px] w-[50%] border-gray-500
                rounded-custom-Radius flex items-center justify-center text-sm less-than-mobile:text-xs">
                Sign up
              </button>
            </div>
            <button className="flex items-center bg-[#131E24] text-white w-[75%] mobile:w-[90%] less-than-mobile:w-[90%] justify-center py-2 rounded mt-7 
              hover:bg-[#1E2E36] rounded-tl-[13px] rounded-bl-[22px] rounded-tr-[22px] rounded-br-[10px] border border-gray-500">
              <img
                src="/images/logo42.png"
                alt="Intra Icon"
                className="w-6 h-6 mr-2"
              />
              <Link
                href="/login"
                className="text-xs
              "
              >
                Sign in with Intra
              </Link>
            </button>
            <button className="flex items-center bg-[#131E24] text-white w-[75%] mobile:w-[90%]
            less-than-mobile:w-[90%] py-2 rounded mt-4  hover:bg-[#1E2E36] rounded-tl-[9px]
            rounded-bl-[18px] rounded-tr-[22px] rounded-br-[10px] border border-gray-500  justify-center">
              <img
                className="w-6 h-6 mr-2 fill-white"
                src="/images/logo_google.png"
                alt="Google Icon"
              />
              <Link
                href="/login"
                className="text-xs"
              >
                Sign in with Google
              </Link>
            </button>
            <div className="flex items-center justify-center w-10/12 mt-2 text-[#949DA2]">
              <img
                className="w-full less-than-tablet:w-[40%] mobile:h-[50px]"
                src="/images/line2.png"
                alt="line"
              />
              <p className="text-[#949DA2] text-center mx-1 text-sm">OR</p>
              <img
                className=" w-full less-than-tablet:w-[40%] mobile:h-[50px]"
                src="/images/line2.png"
                alt="line"
              />
            </div>
            <div className="flex flex-col w-10/12 mt-3">
              <label className="text-sm  text-[#949DA2]">
                Email Address
              </label>
              <div className="relative flex">
                <input
                  type="email"
                  className="border-b-[1px] border-[#949DA2] mb-7 h-[34px] w-full focus:outline-none bg-[#131E24]"
                />
                <FaEnvelope className="absolute right-0.5 text-[#949DA2]" />
              </div>
            </div>
            <PasswordHelper />
            <button className="bg-[#293B45] mobile:mb-3 less-than-mobile:mb-3 w-10/12 h-[50px] mt-[20px] rounded-custom-Radius
                    border-gray-500 border less-than-mobile:text-sm text-md less-than-mobile:h-[40px] less-than-mobile:mt-[10px]
                    less-than-tablet:h-[40px] less-than-tablet:mt-[10px]">
              <input type="submit" value="Sign In" />
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 1, x: "-50%" }}
          animate={{ opacity: 1, x: "0" }}
          transition={{ duration: 0.6 }}
          className="h-full tablet:w-3/4"
        >
          <img
            className="w-full h-full less-than-tablet:hidden rounded-r-[20px]"
            src="/images/login_icon.png"
            alt="loginPageImage"
          />
        </motion.div>
      </div>
    </motion.form>
  );
};

export default SigninPage;