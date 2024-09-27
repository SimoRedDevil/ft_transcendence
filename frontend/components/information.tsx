import React from "react";
import TextFieledTmp from "./TextFieledTmp";

export default function Information() {
  return (
    <div
      className=" text-white w-full h-full flex items-center laptop:justify-evenly less-than-tablet:flex-col
      laptop:flex-row tablet:flex-col
       less-than-tablet:pt-10 overflow-y-auto no-scrollbar
      ">
        <TextFieledTmp
            title="Personal Information"
            label1="Full Name"
            label2="Username"
            label3="City"
            type="text"
            defaultValue1="Abdellatyf En neiymy"
            defaultValue2="aben-nei"
            defaultValue3="Khouribga"
        />
        <TextFieledTmp
            title="Contact"
            label1="Email"
            label2="Phone"
            label3="Address"
            type="text"
            defaultValue1="example@example.com"
            defaultValue2="620-583-4205"
            defaultValue3="1337 School"
        />
    </div>
  );
}
