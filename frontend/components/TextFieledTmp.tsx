import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {getCookies} from "../components/auth";

function TextFieledTmp({ 
  title, 
  label1, 
  label2, 
  label3, 
  type, 
  values, 
  setValues 
}) {

  const handleChange = (e, field) => {
    setValues(prevValues => ({
      ...prevValues,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = await getCookies();
      const response = await axios.put("http://localhost:8000/api/auth/update/", values, {
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("Update successful:");
      } else {
        console.log("Update failed");
      }
    } catch (error) {
      console.log("Error updating information:");
    }
  };

  return (
    <div className="bg-[#1A1F26] bg-opacity-50 laptop:h-[90%] min-h-[600px] laptop:w-[691px] border-[0.5px] border-white border-opacity-40 rounded-[50px] flex flex-col less-than-tablet:my-10 less-than-tablet:mb-10 w-[90%] tablet:h-[500px] tablet:my-5 laptop:mx-3">
      
      <h1 className="laptop:text-[25px] flex w-full h-[150px] items-center justify-center text-white opacity-50 tablet:text-[20px] less-than-tablet:text-[20px] less-than-tablet:mt-2">{title}</h1>
      
      <div>
        {[label1, label2, label3].map((label) => {
          var fieldKey = label.toLowerCase().replace(" ", "_");
          fieldKey === "phone" && (fieldKey = "phone_number");
          return (
            <div key={label} className="flex flex-col items-start w-full pl-5">
              <h1 className="text-white w-full opacity-70 laptop:text-[22px] tablet:text-[18px] less-than-tablet:text-[20px] text-start">{label}</h1>
              <input
                type={type}
                value={values[fieldKey] || ""}
                onChange={(e) => handleChange(e, fieldKey)}
                disabled={label === "Email" || label === "Username"}
                className="less-than-tablet:w-[90%] laptop:h-[70px] rounded-[50px] mt-2 bg-white bg-opacity-10 text-white p-4 border-[0.5px] border-gray-500 focus:outline-none mb-7 h-[50px] less-than-tablet:mb-3 tablet:w-[90%]"
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-center w-full mb-10">
        <button onClick={handleSubmit} className="rounded-[50px] border-[0.5px] border-white border-opacity-40 desktop:h-[80px] w-[556px] bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70 laptop:w-[80%] less-than-tablet:w-[85%] less-than-tablet:mb-3 laptop:h-[60px] tablet:h-[50px] less-than-tablet:h-[50px] tablet:w-[75%]">
          <h1 className="text-[22px] text-center">Submit</h1>
        </button>
      </div>
    </div>
  );
}

export default TextFieledTmp;
