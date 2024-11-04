import React, { use } from "react";
import TextFieledTmp from "./TextFieledTmp";
import {UserContext} from "./context/usercontext";
import { useContext } from "react";
import { useTranslation } from 'react-i18next';

export default function Information() {
  const {users, loading} = useContext(UserContext);
  const { t } = useTranslation();

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
            title={t("Personal Information")}
            label1={t("Full Name")}
            label2={t("Username")}
            label3={t("City")}
            type="text"
            defaultValue1={users.full_name}
            defaultValue2={users.username}
            defaultValue3="Khouribga"
        />
        <TextFieledTmp
            title={t("Contact")}
            label1={t("Email")}
            label2={t("Phone")}
            label3={t("Address")}
            type="text"
            defaultValue1={users.email}
            defaultValue2="620-583-4205"
            defaultValue3="1337 School"
        />
    </div>
  );
}
