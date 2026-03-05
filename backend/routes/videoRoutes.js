import express from "express";
import axios from "axios";
import extractKeywordsFromDocuments from "../keywordExtract.js";

const router = express.Router();

function extractPlaylistId(url) {
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : null;
}

async function fetchPlaylistVideos(playlistId) {
  let videos = [];
  let nextPageToken = "";

  do {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "snippet",
          maxResults: 50,
          playlistId,
          key: process.env.YOUTUBE_API_KEY,
          pageToken: nextPageToken,
        },
      }
    );

    videos.push(...response.data.items);
    nextPageToken = response.data.nextPageToken;
  } while (nextPageToken);

  return videos;
}

router.post("/", async (req, res) => {
  try {
    const { playlistUrl } = req.body;

    if (!playlistUrl) {
      return res.status(400).json({ error: "Playlist URL is required" });
    }

    const playlistId = extractPlaylistId(playlistUrl);

    if (!playlistId) {
      return res.status(400).json({ error: "Invalid playlist URL" });
    }

    const videos = await fetchPlaylistVideos(playlistId);

    const documents = videos.map(
      video =>
        (video.snippet.title || "") +
        " " +
        (video.snippet.description || "")
    );

    const keywords = extractKeywordsFromDocuments(documents);

    res.json({
      totalVideos: videos.length,
      keywords,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;