import { useAuth } from "../../hooks/auth";
import AuthSignUp from "../../components/AuthForm/AuthSignUp";

const SignupPage = () => {
  const { signup } = useAuth();
  return (
    <div className="flex justify-center min-h-screen item-center">
      <AuthSignUp onSubmit={signup} />
    </div>
  );
};

export default SignupPage;
