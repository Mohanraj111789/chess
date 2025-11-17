import "./chessboard.css";

// Import SVG piece icons

import blackKing from "../assets/Chess_kdt45.svg";
import blackQueen from "../assets/Chess_qdt45.svg";
import blackRook from "../assets/Chess_rdt45.svg";
import blackBishop from "../assets/Chess_bdt45.svg";
import blackKnight from "../assets/Chess_ndt45.svg";
import blackPawn from "../assets/Chess_pdt45.svg";

import whiteKing from "../assets/Chess_klt45.svg";
import whiteQueen from "../assets/Chess_qlt45.svg";
import whiteRook from "../assets/Chess_rlt45.svg";
import whiteBishop from "../assets/Chess_blt45 .svg";
import whiteKnight from "../assets/Chess_nlt45 .svg";
import whitePawn from "../assets/Chess_plt45 .svg";


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
    p: blackPawn,
    K: whiteKing,
    Q: whiteQueen,
    R: whiteRook,
    B: whiteBishop,
    N: whiteKnight,
    P: whitePawn,
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
