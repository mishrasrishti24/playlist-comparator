const History = require("../models/History");

// Add new history
exports.addHistory = async (req, res) => {
  try {
    const { playlistName, playlistUrl, comparedWith, keywords } = req.body;
    const history = new History({
      user: req.user._id, // from authMiddleware
      playlistName,
      playlistUrl,
      comparedWith,
      keywords,
    });
    const savedHistory = await history.save();
    res.status(201).json(savedHistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's history
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a history item
exports.deleteHistory = async (req, res) => {
  try {
    await History.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};