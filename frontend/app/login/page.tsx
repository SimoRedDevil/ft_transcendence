"use client";
import React, { useState } from "react";
import SigninPage from "../../components/signinPage";
import SignupPage from "../../components/signupPage";

const Login: React.FC = () => {
  // Boolean state to track whether the user is on the Signin or Signup page
  const [isLogin, setIsLogin] = useState(true);

  // Function to navigate to the Signup page
  const handleNavigateToSignup = () => {
    if (isLogin) {
      setIsLogin(false); // Navigate to SignupPage only if currently on SigninPage
    }
  };

  // Function to navigate to the Signin page
  const handleNavigateToSignin = () => {
    if (!isLogin) {
      setIsLogin(true); // Navigate to SigninPage only if currently on SignupPage
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {isLogin ? (
        <SigninPage onNavigate={handleNavigateToSignup} />
      ) : (
        <SignupPage onNavigate={handleNavigateToSignin} />
      )}
    </div>
  );
};

export default Login;
