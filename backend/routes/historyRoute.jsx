const express = require("express");
const router = express.Router();
const { addHistory, getHistory, deleteHistory } = require("../controllers/historyController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, addHistory);
router.get("/", authMiddleware, getHistory);
router.delete("/:id", authMiddleware, deleteHistory);

module.exports = router;