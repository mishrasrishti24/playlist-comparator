import React, { useEffect, useState } from "react";
import API from "../services/api";
import HistoryCard from "../components/HistoryCard";
import bg from "../assets/bg.jpg"; // import image

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/history");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/history/${id}`);
      setHistory(history.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading)
    return (
      <p className="text-red-400 text-center mt-10">Loading history...</p>
    );

  return (
    <div
      className="min-h-screen bg-black bg-cover bg-center text-white p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <h1 className="text-4xl font-bold mb-6 text-center text-red-500 drop-shadow-lg">
        Playlist Comparison History
      </h1>
      {history.length === 0 ? (
        <p className="text-red-300 text-center">No history found</p>
      ) : (
        history.map((item) => (
          <HistoryCard key={item._id} historyItem={item} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
};

export default History;