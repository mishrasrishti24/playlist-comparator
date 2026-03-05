import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import bg from "../assets/bg.jpg";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location, navigate]);

  if (!location.state) return null;

  const { playlistA, playlistB, keywordSimilarity } = location.state;

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col items-center pt-24">

        <h2 className="text-5xl font-bold mb-16 text-center">
          Comparison <span className="text-red-600">Results</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 w-full max-w-6xl px-6">

          {[playlistA, playlistB].map((playlist, index) => (
            <div
              key={index}
              className="p-10 rounded-3xl bg-white/5 backdrop-blur-xl
              border border-white/10 shadow-[0_0_50px_rgba(255,0,0,0.1)]"
            >
              <h3 className="text-2xl text-red-500 mb-8 font-semibold">
                Playlist {index === 0 ? "A" : "B"}
              </h3>

              <div className="space-y-6 text-gray-300 text-lg">

                <p>
                  <span className="text-white font-medium">
                    Total Watch Time:
                  </span>{" "}
                  {playlist?.totalDuration || "N/A"}
                </p>

                <p>
                  <span className="text-white font-medium">
                    Total Videos:
                  </span>{" "}
                  {playlist?.totalVideos ?? "N/A"}
                </p>

                <p>
                  <span className="text-white font-medium">
                    Total Views:
                  </span>{" "}
                  {playlist?.totalViews?.toLocaleString() ?? "N/A"}
                </p>

                <p>
                  <span className="text-white font-medium">
                    Total Likes:
                  </span>{" "}
                  {playlist?.totalLikes?.toLocaleString() ?? "N/A"}
                </p>

                {/* 🔥 Keywords Section */}
                <div className="mt-8">
                  <p className="text-white font-medium mb-4">
                    Important Keywords:
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {playlist?.keywords?.length > 0 ? (
                      playlist.keywords.map((word, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 rounded-full
                          bg-red-600/20 text-red-400
                          border border-red-500/30
                          text-sm font-medium"
                        >
                          {word}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No keywords</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}

        </div>

        {/* 🔥 Similarity Section */}
        {keywordSimilarity && (
          <div className="mt-16 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Keyword Similarity
            </h3>

            <div className="inline-block px-10 py-5 rounded-2xl
            bg-red-600/20 border border-red-500/30
            text-4xl font-bold text-red-400
            shadow-[0_0_40px_rgba(255,0,0,0.2)]">
              {keywordSimilarity}%
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-16 px-8 py-3 bg-red-600 hover:bg-red-700
          rounded-xl text-lg font-semibold transition duration-300"
        >
          Compare Again
        </button>

      </div>
    </div>
  );
};

export default Results;