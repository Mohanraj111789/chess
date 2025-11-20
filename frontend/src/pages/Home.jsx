// src/pages/Home.jsx
import React from "react";
import ChessBoard from "../components/ChessBoard";
import Calendar from "../components/calender";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Chess Board — Interactive Mode
      </h1>

      <p className="text-slate-600 mb-8 max-w-2xl text-center">
        Move pieces legally, view all valid moves, check/checkmate detection,
        and game controls (restart & undo). This is Phase 1 of your project UI.
      </p>

      <ChessBoard ></ChessBoard>
      <Calendar></Calendar>
    </div>
  );
}
