import React from "react";
import AuthLogin from "../../components/AuthForm/AuthLogin";
import { useAuth } from "../../hooks/auth";

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div className="flex justify-center items-center h-screen">
      <AuthLogin onSubmit={login} />
    </div>
  );
};

export default LoginPage;
