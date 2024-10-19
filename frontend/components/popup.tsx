import { useState, useEffect } from "react";
import {
  UserProvider,
  useUserContext,
} from "../components/context/usercontext";
import { enableTwoFactorAuth, disableTwoFactorAuth } from "./twoFa";

const Popup = (
  { isOpen, setIsOpen }
) => {
  const [values, setValues] = useState(['', '', '', '', '', '']);
  const [enable2FA, setEnable2FA] = useState(false);
  const [username, setUsername] = useState('');
  const { users, fetchUsers } = useUserContext();
  

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d$/.test(value)) { // Allow only single digits
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);
      // Focus on the next input
      if (index < 5) {
        document.getElementById(`digit-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newValues = [...values];
      newValues[index] = ''; // Clear current input
      setValues(newValues);
      if (index > 0) {
        // Focus on the previous input
        document.getElementById(`digit-${index - 1}`).focus();
      }
    }
  };

  const enabel2fabutton = async () => {
    if (users) {
      setUsername(users.username);
      await enableTwoFactorAuth();
      setEnable2FA(users.enabeld_2fa);
      await fetchUsers();
    }
  };
  const desable2fabutton = async () => {
    if (users) {
      setUsername(users.username);
      await disableTwoFactorAuth();
      setEnable2FA(users.enabeld_2fa);
      await fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
    if (users && users.username) {
      setUsername(users.username);
      setEnable2FA(users.enabeld_2fa);
    }
  }, [
    users ?
    users.enabeld_2fa
    : null]);

  return (
    <div>
      {/* <button
        className="bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70 rounded-[50px] border-[0.5px] border-white border-opacity-40 
         text-white py-2 mt-4 px-7"
        onClick={() => setIsOpen(!isOpen)}
      >
        Open Popup
      </button> */}

      {isOpen && (
        <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center'>
          <div className='bg-[#1A1F26] p-6 rounded-lg shadow-lg w-96'>
            <h1 className='text-xl font-bold mb-4'>Enter The Code</h1>
            <p className='text-white mb-4'>
              Enter the six-digit code from your authenticator app:
            </p>

            {/* Six-Digit Input Fields */}
            <form 
            onSubmit={(e) => { e.preventDefault(); }}
             className="flex justify-between mb-6 text-black">
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

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                type="submit"
                className='bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70 text-white p-2 px-4 rounded-lg border-[0.5px] border-white border-opacity-40 '
                onClick={() => {
                  enable2FA ? desable2fabutton() && console.log('2FA Disabled') :
                  enabel2fabutton() && console.log('2FA Enabled');
                  isOpen ? setIsOpen(false) : setIsOpen(true);
                }
                }
                disabled={values.some((val) => val === '')} // Disable until all fields are filled
              >
                Verify
              </button>
              <button
                className='bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70 text-white p-2 px-4 rounded-lg border-[0.5px] border-white border-opacity-40 '
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
