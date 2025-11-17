// src/components/Controls.jsx
import React from "react";

export default function Controls({ onRestart, onUndo }) {
  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={onRestart}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Restart
      </button>

      <button
        onClick={onUndo}
        className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800"
      >
        Undo Move
      </button>
    </div>
  );
}
