import { useState, useEffect, use } from "react";
import axios from "axios";
import {
  useUserContext,
} from "../components/context/usercontext";
import { useContext } from "react";
import { enableTwoFactorAuth, disableTwoFactorAuth } from "./twoFa";
import { UserContext } from '../components/context/usercontext';
import { headers } from "next/headers";



const Popup = ({
  isOpen,
  setIsOpen,
  enable2FA,
  setEnable2FA,
  code,
  setCode,
  qrcode,
}) => {
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const [username, setUsername] = useState("");
  var { users, setTry2fa, fetchAuthUser } = useContext(UserContext);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d$/.test(value)) {
      // Allow only single digits
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);
      // Focus on the next input
      if (index < 5) {
        document.getElementById(`digit-${index + 1}`).focus();
      }
      if (index === 5) {
        setCode(newValues.join(""));
      }
    }
  };

  const getqrcode = async () => {
    try {
      const response = await axios('http://localhost:8000/api/auth/get-qrcode/', {
          withCredentials: true,
          headers: {
              'Content-Type': 'application/json',
          },
      });
      // var qrcodepath = users.qrcode_dir;
      // if (response.status === 200 && qrcodepath )
      // {
      //     const parts = qrcodepath.split('/');
      //     var qr = parts[parts.length - 1];
      //     setQrcode(qr + "/" + users.username + ".png");
      //     qr = "";
      // }
  }
  catch (error) {
      //console.log("error ----------------------->", error);
  }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newValues = [...values];
      newValues[index] = ""; // Clear current input
      setValues(newValues);
      if (index > 0) {
        // Focus on the previous input
        document.getElementById(`digit-${index - 1}`).focus();
      }
    }
  };

  const clearValues = () => {
    setValues(["", "", "", "", "", ""]);
    setCode("");
    setIsOpen(false);
    setEnable2FA(enable2FA);
    setTry2fa(false);
  };

  const desable2fabutton = async () => {
    if (users) {
      disableTwoFactorAuth();
      setEnable2FA(false);
      await fetchAuthUser();
      // await fetchAuthUser();
    }
  };

  const verify2FA = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/auth/verify-2fa/?code=${code}`,
        {
          withCredentials: true, // Ensure cookies are included in the request
        }
      );
      if (response.status === 200) {
        if (users.enabeld_2fa) {
          desable2fabutton();
          //console.log("disable 2fa called");
        }
        clearValues();
        setIsOpen(false);
        setEnable2FA(users.enabeld_2fa);
      }
    } catch (error){
    }
  };


  const handelVerify = async () => {
    if (users.enabeld_2fa) {
      verify2FA() && setTry2fa(false)
      //console.log("2fa is disabled");
    } else {
      verify2FA() && setTry2fa(true);
      //console.log("2fa is enabled");
    }
    fetchAuthUser();
    getqrcode();
  }

  useEffect(() => {
     fetchAuthUser();
    if (users && users.username) {
      setUsername(users.username);
    }
  }, [users && users.enabeld_2fa, enable2FA, code, username]);

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div
            className="
          bg-[#1A1F26] flex
          "
          >
            <div className="py-[70px] px-6 rounded-lg shadow-lg w-auto ">
              <h1 className="text-xl font-bold mb-4">Enter The Code</h1>
              <p className="text-white mb-4">
                Enter the six-digit code from your authenticator app:
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="flex justify-between mb-6 text-black"
              >
                {values.map((value, index) => (
                  <input
                    key={index}
                    id={`digit-${index}`}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                ))}
              </form>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70 text-white p-2 px-4 rounded-lg border-[0.5px] border-white border-opacity-40 "
                  onClick={handelVerify}
                  disabled={values.some((val) => val === "")} // Disable until all fields are filled
                >
                  Verify
                </button>
                <button
                  className="bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70 text-white p-2 px-4 rounded-lg border-[0.5px] border-white border-opacity-40 "
                  onClick={clearValues}
                >
                  Close
                </button>
              </div>
            </div>
            <div
              className="
            flex items-center justify-center mr-2
            "
            >
              <img
                className={`h-full bg-white text-white desktop:w-[250px]
              laptop:w-[170px] laptop:h-[170px] tablet:w-[250px] tablet:h-[250px] 
              less-than-tablet:w-[200px] less-than-tablet:h-[200px]
              desktop:h-[250px] rounded-[30px] 
              `}
                src={`http://localhost:8000/${qrcode}`}
                alt="2fa QR Code"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
