import { SignUp } from "@clerk/clerk-react";

function Signup() {
  return (
    <div
      className="relative h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg.jpg')",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Clerk Card */}
      <div className="relative z-10 bg-zinc-900/90 p-8 rounded-2xl shadow-2xl border border-red-600/30">
        <SignUp
          afterSignUpUrl="/home"
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-red-600 hover:bg-red-700 transition duration-300",
              card: "shadow-none bg-transparent",
            },
          }}
        />
      </div>
    </div>
  );
}

export default Signup;