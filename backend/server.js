const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const extractKeywords = require("./KeywordExtractor"); // Your existing keyword extractor

const app = express();
app.use(cors());
app.use(express.json());

// ------------------- ENV VARIABLES -------------------
const API_KEY = process.env.YOUTUBE_API_KEY;
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// ------------------- MONGODB CONNECTION -------------------
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// ------------------- HISTORY MODEL -------------------
const HistorySchema = new mongoose.Schema({
  playlistAName: String,
  playlistAUrl: String,
  playlistBName: String,
  playlistBUrl: String,
  keywordsA: [String],
  keywordsB: [String],
  keywordSimilarity: Number,
  createdAt: { type: Date, default: Date.now }
});

const History = mongoose.model("History", HistorySchema);

// ------------------- HELPER FUNCTIONS -------------------
function extractPlaylistId(url) {
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : null;
}

function parseDuration(duration) {
  if (!duration) return 0;
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function jaccard(a, b) {
  if (!a.length || !b.length) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter(x => setB.has(x));
  const union = new Set([...a, ...b]);
  return (intersection.length / union.size) * 100;
}

async function analyzePlaylist(playlistId) {
  let nextPageToken = "";
  let videoIds = [];

  do {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "contentDetails",
          playlistId,
          maxResults: 50,
          pageToken: nextPageToken,
          key: API_KEY
        }
      }
    );

    if (!response.data.items.length) break;
    response.data.items.forEach(item => videoIds.push(item.contentDetails.videoId));
    nextPageToken = response.data.nextPageToken;
  } while (nextPageToken);

  if (videoIds.length === 0) return {
    totalVideos: 0,
    totalDuration: "0h 0m",
    totalViews: 0,
    totalLikes: 0,
    keywords: []
  };

  let totalDuration = 0;
  let totalViews = 0;
  let totalLikes = 0;
  let documents = [];

  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "contentDetails,statistics,snippet",
          id: batch.join(","),
          key: API_KEY
        }
      }
    );

    response.data.items.forEach(video => {
      totalDuration += parseDuration(video.contentDetails?.duration);
      totalViews += parseInt(video.statistics?.viewCount || 0);
      totalLikes += parseInt(video.statistics?.likeCount || 0);
      documents.push(
        (video.snippet?.title || "") + " " + (video.snippet?.description || "")
      );
    });
  }

  const keywords = extractKeywords(documents);

  return {
    totalVideos: videoIds.length,
    totalDuration: formatDuration(totalDuration),
    totalViews,
    totalLikes,
    keywords
  };
}

// ------------------- API ROUTES -------------------

// Compare two playlists
app.post("/api/compare", async (req, res) => {
  try {
    const { playlistA, playlistB } = req.body;
    if (!playlistA || !playlistB) return res.status(400).json({ error: "Both playlist URLs are required" });

    const idA = extractPlaylistId(playlistA);
    const idB = extractPlaylistId(playlistB);
    if (!idA || !idB) return res.status(400).json({ error: "Invalid playlist URL" });

    const resultA = await analyzePlaylist(idA);
    const resultB = await analyzePlaylist(idB);
    const similarity = jaccard(resultA.keywords, resultB.keywords);

    const history = new History({
      playlistAName: playlistA,
      playlistAUrl: playlistA,
      playlistBName: playlistB,
      playlistBUrl: playlistB,
      keywordsA: resultA.keywords,
      keywordsB: resultB.keywords,
      keywordSimilarity: parseFloat(similarity.toFixed(2))
    });
    await history.save();

    res.json({
      playlistA: resultA,
      playlistB: resultB,
      keywordSimilarity: similarity.toFixed(2)
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Server error while comparing playlists" });
  }
});

// Get all history
app.get("/api/history", async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a history entry
app.delete("/api/history/:id", async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- START SERVER -------------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));