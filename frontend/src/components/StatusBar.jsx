// src/components/StatusBar.jsx
import React from "react";

export default function StatusBar({ status }) {
  const colors = {
    "Check": "text-yellow-500 font-semibold",
    "Checkmate": "text-red-600 font-bold",
    "Stalemate": "text-orange-500 font-semibold",
  };

  const colorClass = colors[status] || "text-slate-800";

  return (
    <div className={`text-xl mb-4 ${colorClass}`}>
      {status}
    </div>
  );
}
