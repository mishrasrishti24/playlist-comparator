const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  playlistName: { type: String, required: true },
  playlistUrl: { type: String, required: true },
  comparedWith: { type: String },
  keywords: { type: [String] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", HistorySchema);