"use client";
import React, { useEffect, useState } from "react";
import SigninPage from "../../components/signinPage";
import SignupPage from "../../components/signupPage";
import { UserContext } from "../../components/context/usercontext";
import { useContext } from "react";
import TwofaVerify from "../../components/twofaVerify";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { users, isAuthenticated } = useContext(UserContext);
  const [is2FAVerification, setIs2FAVerification] = useState(false);

  const handleLoginSuccess = (is2FAEnabled: boolean) => {
    setIs2FAVerification(is2FAEnabled); // Set the state to show TwofaVerify
  };

  const handleNavigateToSignup = () => {
    if (isLogin) {
      setIsLogin(false);
    }
  };

  const handleNavigateToSignin = () => {
    if (!isLogin) {
      setIsLogin(true);
    }
  };

  // Render TwofaVerify if 2FA is enabled
  if (is2FAVerification) {
    return (
      <TwofaVerify onVerified={() => setIs2FAVerification(false)} /> // Reset after verification
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {isLogin ? (
        <SigninPage onNavigate={handleNavigateToSignup} onLoginSuccess={handleLoginSuccess} /> // Pass the success handler
      ) : (
        <SignupPage onNavigate={handleNavigateToSignin} />
      )}
    </div>
  );
};

export default Login;
