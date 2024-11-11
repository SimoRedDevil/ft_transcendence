'use client';

import { PiTimerDuotone } from "react-icons/pi";
import { verify2FA } from "../../components/twoFa"; // Ensure this is compatible with client-side use
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from 'react-hot-toast';
import { useContext } from "react";
import { UserContext } from "../../components/context/usercontext";

const TwofaVerify = () => {
  const [code, setCode] = useState<string>("");
  const router = useRouter();
  const {authUser, fetchAuthUser} = useContext(UserContext);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) { // Allows only digits and up to 6 characters
      setCode(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const status = await verify2FA(code);
    if (status === 200) {
      toast.success("login success");
      await fetchAuthUser();
      router.push("/");
    } else {
      toast.error("Verification failed");
    }
  };

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };


  useEffect(() => {
    window.addEventListener('keydown', handleEnterPress);
    return () => {
      window.removeEventListener('keydown', handleEnterPress);
  };
}
, [handleEnterPress]);

  return (
    <form onSubmit={handleSubmit}
    className="flex flex-col items-center justify-center h-screen w-screen z-[100]"
    >
      <div
        className="flex items-center justify-center h-full w-full laptop:w-[850px]
      tablet:w-[620px] tablet:h-[770px] desktop:h-[760px] desktop:w-[950px] mobile:w-[500px]
      mobile:h-[700px] laptop:h-[770px]  less-than-mobile:h-[720px] less-than-mobile:w-[500px] fixed overflow-auto">
        <div
          className="flex justify-center flex-col h-full w-1/2 max-xl:w-[400px] bg-[#131E24] rounded-l-[20px] text-sm">
          <img
            className="w-13 h-16 mx-auto mt-[18px]"
            src="/images/logop5.png"
            alt=""
          />
          <h1 className="mobile:text-xl font-bold text-center tablet:mt-[19px] mb-[34px] text-white less-than-tablet:text-sm less-than-tablet:mb-2 less-than-tablet:mt-2">
            Two Factor Authentication
          </h1>
          <div className="flex flex-col justify-center items-center text-white">
            <div className="flex justify-around border-[1px] border-gray-500 bg-transparent h-[46px] less-than-mobile:w-[90%]  mobile:w-[90%] w-[75%] rounded-[20px] mt-4
             bg-[#293B45] rounded-tl-[10px] rounded-bl-[20px] rounded-tr-[20px] rounded-br-[10px] text-[19px] mobile:h-[48px]">
              <div
                className="text-white rounded-tl-[10px] w-[50%] border-gray-500
                rounded-custom-Radius flex items-center justify-center text-sm less-than-mobile:text-xs">
                {authUser?.username}
              </div>
            </div>
            <div className="flex flex-col w-10/12 mt-3">
              <label className="text-sm  text-[#949DA2]">
                One-time Code
              </label>
              <div className="relative flex">
                <input
                  type="text" autoFocus
                  onChange={handleInputChange}
                  className="border-b-[1px] border-[#949DA2] mb-7 h-[34px] w-full focus:outline-none bg-[#131E24] pr-6"
                  maxLength={6}
                />
                <PiTimerDuotone className="absolute right-0.5 text-[#949DA2] top-1 text-xl" />
              </div>
            </div>
            <button type="submit" 
            className="bg-[#293B45] mobile:mb-3 less-than-mobile:mb-3 w-10/12 h-[50px] mt-[20px] rounded-custom-Radius
                    border-gray-500 border less-than-mobile:text-sm text-md less-than-mobile:h-[40px] less-than-mobile:mt-[10px]
                    less-than-tablet:h-[40px] less-than-tablet:mt-[10px]">
              Verify
            </button>
          </div>
        </div>
        <div
          className="h-full tablet:w-3/4"
        >
          <img
            className="w-full h-full less-than-tablet:hidden rounded-r-[20px]"
            src="/images/login_icon.png"
            alt="loginPageImage"
          />
        </div>
      </div>
    </form>
  );
};

export default TwofaVerify;
