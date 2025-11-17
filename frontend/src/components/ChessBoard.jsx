import "./chessboard.css";

// Import SVG piece icons

import blackKing from "../assets/Chess_kdt45.svg";
import blackQueen from "../assets/Chess_qdt45.svg";
import blackRook from "../assets/Chess_rdt45.svg";
import blackBishop from "../assets/Chess_bdt45.svg";
import blackKnight from "../assets/Chess_ndt45.svg";
import blackPawn from "../assets/Chess_pdt45.svg";



export default function ChessBoard() {

  const initialBoard = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ];

  const pieceImages = {
 
    k: blackKing,
    q: blackQueen,
    r: blackRook,
    b: blackBishop,
    n: blackKnight,
    p: blackPawn
  };

  return (
    <div className="chessboard">
      {initialBoard.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isDark = (rowIndex + colIndex) % 2 === 1;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={isDark ? "square dark" : "square light"}
            >
              {piece && (
                <img
                  src={pieceImages[piece]}
                  alt={piece}
                  className="piece"
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
