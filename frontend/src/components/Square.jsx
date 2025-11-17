// src/components/Square.jsx
import React from "react";

export default function Square({ children, isLight, isSelected, isMove, onClick }) {
  const baseColor = isLight ? "bg-amber-50" : "bg-slate-700";
  const selectedStyle = isSelected ? "ring-4 ring-blue-400" : "";
  const moveStyle = isMove
    ? "after:content-[''] after:w-3 after:h-3 after:bg-green-400 after:rounded-full after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
    : "";

  return (
    <div
      onClick={onClick}
      className={`w-14 h-14 flex items-center justify-center text-2xl border border-slate-500 relative cursor-pointer ${baseColor} ${selectedStyle}`}
    >
      <div className={moveStyle}>{children}</div>
    </div>
  );
}
