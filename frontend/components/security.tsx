import React from "react";
import { GrKey } from "react-icons/gr";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserProvider, useUserContext} from '../components/context/usercontext';

export default function Security() {

  // const [qrcodeUrl, setQrcodeUrl] = useState(null);

  // // Fetch cookies (including access_token)
  // const getCookies = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8000/api/auth/cookies/', {
  //       withCredentials: true, // Ensure cookies are included in the request
  //     });
  //     return response.data; // Assuming the response contains cookies in response.data
  //   } catch (error) {
  //     console.error("Error getting cookies:", error);
  //     return null; // Return null if there's an error
  //   }
  // };
  
  // // Enable 2FA with the access_token retrieved from cookies
  // const enable2FA = async () => {
  //   const cookies = (await getCookies()).cookies;
  //   const accessToken = cookies?.access_token?.trim();
  //   if (!cookies || !cookies.access_token) {
  //     console.error("Access token not found in cookies");
  //     return;
  //   }
  //   try {
  //     const response = await axios.post(
  //       'http://localhost:8000/api/auth/enable-2fa/',
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`, // Use the access token from cookies
  //         },
  //         withCredentials: true, // Ensure credentials are sent
  //       }
  //     );
  //     setQrcodeUrl(response.data.qrcode_url); // Store the QR code URL
  //   } catch (error) {
  //     console.error("Error enabling 2FA:", error);
  //   }
  // };
  
  // // Run the 2FA enabling on component mount
  // useEffect(() => {
  //   enable2FA();
  // }, []);
  
  const { users, loading, error } = useUserContext();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const username = users && users.username.length > 0 ? users.username : 'default_username';
  return (
    <UserProvider>
    <div
      className="text-white w-full h-full flex items-center laptop:justify-center flex-col
        overflow-y-auto no-scrollbar overflow-x-hidden tablet:mb-3 laptop:flex-row
        ">
      <div
        className=" bg-[#1A1F26] bg-opacity-50 border-[0.5px] border-white border-opacity-40 
                rounded-[50px] less-than-tablet:w-[90%] tablet:w-[90%] flex desktop:h-[620px] desktop:w-[1400px]
                less-than-tablet:flex-col tablet:flex-col laptop:flex-row tablet:mt-12 items-center justify-center
                less-than-tablet:mt-5 laptop:h-[700px] laptop:ml-10 mx-2 tablet:pt-5 desktop:mx-5
                ">
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
              Current Password
            </h1>
            <input
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
              text-start">
              New Password
            </h1>
            <input
              type="password"
              className="less-than-tablet:w-[85%] less-than-tablet:ml-4 tablet:h-[50px] laptop:h-[70px] rounded-[50px] mt-2 
                    bg-white bg-opacity-10 text-white p-4 border-[0.5px] border-gray-500 focus:outline-none mb-7
                    less-than-tablet:h-[50px] less-than-tablet:mb-3 tablet:w-[90%] password-circles 
                    "/>
          </div>
          <div className="flex flex-col items-start w-full pl-5 ">
            <h1
              className="laptop:text-[22px] w-full text-white opacity-70 
              less-than-tablet:text-[18px] tablet:text-[20px] less-than-tablet:mt-2 less-than-tablet:ml-3
              text-start
                    "
            >
              Confirm Password
            </h1>
            <input
              type="password"
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
              className="rounded-[50px] border-[0.5px] border-white border-opacity-40 desktop:h-[80px] w-[556px] bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70
                laptop:w-[80%] less-than-tablet:w-[85%] less-than-tablet:mb-3 laptop:h-[60px] laptop:my-7 tablet:h-[50px] 
                less-than-tablet:h-[50px] tablet:w-[75%]
                "
            >
              <h1
                className="text-[22px] text-center">
                Submit
              </h1>
            </button>
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center laptop:w-1/2
            less-than-tablet:border-0 less-than-tablet:w-full less-than-tablet:pr-0"
        >
          <div
            className="flex w-full justify-start items-center less-than-tablet:flex-col
          mt-5"
          >
            <img
              className="h-full bg-white text-white ml-5 mb-5 desktop:w-[250px]
                    laptop:w-[170px] laptop:h-[170px] tablet:w-[250px] tablet:h-[250px] less-than-tablet:w-[200px] 
                    less-than-tablet:h-[200px] less-than-tablet:ml-0 desktop:h-[250px]
                    less-than-tablet:mb-3
                    rounded-[30px]
                    "
                src={`http://localhost:8000/qrcodes/${username}.png
                `} alt="2fa QR Code"
            />
            <div className="laptop:w-1/2 h-[300px] flex flex-col mx-3 justify-center ">
              <p
                className="desktop:text-sm desktop:mb-8 mb-3 text-white opacity-70 max-w-[10rem] text-center
                less-than-tablet:text-xs tablet:text-xs
                ">
                1. Use an authenticator app as your Two-Factor Authentication
                (2FA).
              </p>
              <p
                className="desktop:text-sm desktop:mb-8 mb-3 text-white opacity-70 max-w-[10rem] text-center
                    less-than-tablet:text-xs tablet:text-xs
                  ">
                2. Scan the QR code using your authenticator app.
              </p>
              <p
                className="desktop:text-sm mb-5 text-white opacity-70 max-w-[10rem] text-center
                        less-than-tablet:text-xs tablet:text-xs
                  ">
                3. Enter the number which the app generates below.
              </p>
            </div>
          </div>
          <div
            className="flex flex-col w-full items-start pl-5">
            <h1
              className="text-sm text-white opacity-70 my-2">
              Enter the code generated from your authenticator app
            </h1>
            <div className="relative less-than-tablet:w-[85%] tablet:w-[80%] laptop:w-[90%]">
              <GrKey className="absolute less-than-tablet:top-1/2 tablet:top-[40%] left-4 transform -translate-y-1/2 tablet:text-2xl less-than-tablet:text-xl text-white" />
              <input
                type="text"
                className="w-full tablet:h-[50px] laptop:h-[70px] rounded-[50px] mt-2 
        bg-white bg-opacity-10 text-white p-4 pl-12 border-[0.5px] border-gray-500 focus:outline-none mb-7
        less-than-tablet:h-[50px] less-than-tablet:mb-3"
              />
            </div>
            <div
              className="w-full flex laptop:justify-center
          "
            >
              <button
                className="rounded-[50px] border-[0.5px] border-white border-opacity-40 desktop:h-[80px] w-[556px] bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70
                            less-than-tablet:w-[85%] less-than-tablet:mb-3 laptop:h-[50px] laptop:my-0 tablet:h-[50px] 
                            less-than-tablet:h-[50px] tablet:w-[75%] tablet:mb-5">
                <h1 className="text-[22px] text-center">Enable 2FA</h1>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </UserProvider>
  );
}
