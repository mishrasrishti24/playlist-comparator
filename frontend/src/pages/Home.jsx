import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "../assets/bg.jpg";

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const navigate = useNavigate();
  const [playlistA, setPlaylistA] = useState("");
  const [playlistB, setPlaylistB] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    const trimmedA = playlistA.trim();
    const trimmedB = playlistB.trim();

    if (!trimmedA || !trimmedB) {
      setError("Please enter both playlist URLs");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const res = await axios.post(`${API}/api/compare`, {
        playlistA: trimmedA,
        playlistB: trimmedB,
      });

      navigate("/results", { state: res.data });
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === "ERR_NETWORK") {
        setError("Backend server is not running.");
      } else {
        setError("Failed to compare playlists. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white relative flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full px-4">
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Compare <br />
            You
            <span className="text-red-600 drop-shadow-lg">
              Tube Playlists
            </span>
          </h1>

          <p className="text-gray-300 mt-6 text-lg md:text-xl">
            Analyze Views, Likes, Watch Time & Keywords Instantly
          </p>

          <div className="mt-14 max-w-4xl mx-auto bg-white/10 border border-white/20 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl shadow-black/40">
            <h3 className="text-xl font-semibold mb-10 text-gray-200 tracking-wide">
              Enter Playlist URLs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-left mb-3 text-gray-300 font-medium">
                  Playlist A
                </label>
                <input
                  type="text"
                  value={playlistA}
                  onChange={(e) => setPlaylistA(e.target.value)}
                  placeholder="https://youtube.com/playlist?list=..."
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                />
              </div>

              <div>
                <label className="block text-left mb-3 text-gray-300 font-medium">
                  Playlist B
                </label>
                <input
                  type="text"
                  value={playlistB}
                  onChange={(e) => setPlaylistB(e.target.value)}
                  placeholder="https://youtube.com/playlist?list=..."
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                />
              </div>
            </div>

            <div className="mt-12">
              <button
                onClick={handleCompare}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 transition-all duration-300 px-12 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-red-600/40 hover:scale-105 disabled:opacity-50"
              >
                {loading ? "Comparing..." : "Compare Playlists"}
              </button>

              {error && (
                <p className="text-red-400 mt-5 text-sm">
                  {error}
                </p>
              )}
            </div>
          </div>

          <p className="mt-16 text-gray-400 text-sm">
            Built with React & Tailwind CSS
          </p>
        </section>
      </div>
    </div>
  );
}