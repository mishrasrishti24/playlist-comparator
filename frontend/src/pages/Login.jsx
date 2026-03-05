
import { SignIn } from "@clerk/clerk-react";
import bgImage from "../assets/bg.jpg";

function Login() {
  return (
    <div
      className="relative h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Clerk Card */}
      <div className="relative z-10 bg-zinc-900/90 p-6 rounded-xl shadow-2xl">
        <SignIn afterSignInUrl="/home" />
      </div>
    </div>
  );
}

export default Login;