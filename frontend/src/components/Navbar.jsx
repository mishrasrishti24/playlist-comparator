import { Link } from "react-router-dom";
import { UserButton, SignedIn } from "@clerk/clerk-react";
import { useState } from "react";
import youtubeLogo from "../assets/youtube-logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-black/40 backdrop-blur-md border-b border-red-600/30 shadow-lg px-6 md:px-12 py-4 relative z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={youtubeLogo}
            alt="YouTube Logo"
            className="w-20 h-20 md:w-12 md:h-12  ]"
          />
          <span className="text-white text-xl md:text-2xl font-bold tracking-wide">
            Playlist Comparator
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center text-gray-300 font-medium">
          <Link
            to="/home"
            className="hover:text-red-500 hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] transition duration-300"
          >
            Home
          </Link>

          <Link
            to="/results"
            className="hover:text-red-500 hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] transition duration-300"
          >
            Results
          </Link>

          <Link
            to="/history"
            className="hover:text-red-500 hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] transition duration-300"
          >
            History
          </Link>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border border-red-600/50 rounded-full",
                },
              }}
            />
          </SignedIn>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-300 hover:text-red-500 focus:outline-none text-2xl"
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-gray-300 font-medium">
          <Link
            to="/home"
            onClick={() => setMenuOpen(false)}
            className="hover:text-red-500 hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] transition duration-300"
          >
            Home
          </Link>

          <Link
            to="/results"
            onClick={() => setMenuOpen(false)}
            className="hover:text-red-500 hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] transition duration-300"
          >
            Results
          </Link>

          <Link
            to="/history"
            onClick={() => setMenuOpen(false)}
            className="hover:text-red-500 hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] transition duration-300"
          >
            History
          </Link>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border border-red-600/50 rounded-full",
                },
              }}
            />
          </SignedIn>
        </div>
      )}
    </nav>
  );
};

export default Navbar;