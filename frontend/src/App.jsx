import { Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Results from "./pages/Results";
import History from "./pages/History"; // Added History page
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

function App() {
  return (
    <>
      {/* Navbar only when user is signed in */}
      <SignedIn>
        <Navbar />
      </SignedIn>

      <Routes>
        {/* Root Redirect Logic */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Navigate to="/home" />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-up" />
              </SignedOut>
            </>
          }
        />

        {/* Auth Pages (Centered Pages You Created) */}
        <Route path="/sign-in/*" element={<Login />} />
        <Route path="/sign-up/*" element={<Signup />} />

        {/* Protected Pages */}
        <Route
          path="/home"
          element={
            <>
              <SignedIn>
                <Home />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn redirectUrl="/sign-in" />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/results"
          element={
            <>
              <SignedIn>
                <Results />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn redirectUrl="/sign-in" />
              </SignedOut>
            </>
          }
        />

        {/* 🔥 History Page */}
        <Route
          path="/history"
          element={
            <>
              <SignedIn>
                <History />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn redirectUrl="/sign-in" />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;