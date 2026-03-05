import React from "react";

const HistoryCard = ({ historyItem, onDelete }) => {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white p-4 rounded-xl shadow-2xl mb-4 border border-red-600">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold text-red-400">Comparison</h2>
        <button
          onClick={() => onDelete(historyItem._id)}
          className="bg-red-600 hover:bg-red-800 px-2 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>
      <div className="mt-2">
        <p className="text-sm">
          <span className="font-semibold text-red-500">Playlist A:</span> {historyItem.playlistAName}
        </p>
        <p className="text-sm">
          <span className="font-semibold text-red-500">Playlist B:</span> {historyItem.playlistBName}
        </p>
        <p className="text-sm mt-1">
          <span className="font-semibold text-red-500">Keyword Similarity:</span> {historyItem.keywordSimilarity}%
        </p>
        <p className="text-sm mt-1">
          <span className="font-semibold text-red-400">Keywords A:</span> {historyItem.keywordsA.join(", ")}
        </p>
        <p className="text-sm mt-1">
          <span className="font-semibold text-red-400">Keywords B:</span> {historyItem.keywordsB.join(", ")}
        </p>
        <p className="text-xs mt-2 text-red-200">
          {new Date(historyItem.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default HistoryCard;