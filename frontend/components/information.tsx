import React, { use } from "react";
import TextFieledTmp from "./TextFieledTmp";
import {UserContext} from "./context/usercontext";
import { useContext } from "react";

export default function Information() {
  const {users, loading} = useContext(UserContext);
  console.log("user: ", users);

  if (loading || !users) {
    return <div>Loading...</div>;
  }
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
            defaultValue1={users.full_name}
            defaultValue2={users.username}
            defaultValue3="Khouribga"
        />
        <TextFieledTmp
            title="Contact"
            label1="Email"
            label2="Phone"
            label3="Address"
            type="text"
            defaultValue1={users.email}
            defaultValue2="620-583-4205"
            defaultValue3="1337 School"
        />
    </div>
  );
}
