import { useState } from "react";
import "./chessboard.css";

// Import SVG icons
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

  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);

  // ---------- MOVE LOGIC ----------
  function getValidMoves(piece, row, col) {
    const moves = [];
    if (!piece) return moves;

    const isWhite = piece === piece.toUpperCase();

    switch (piece.toLowerCase()) {
case "p": {
  const dir = isWhite ? -1 : 1;

  // === 1-step forward ===
  if (board[row + dir] && board[row + dir][col] === "") {
    moves.push({ row: row + dir, col });

    // === 2-step first move ===
    const startingRow = isWhite ? 6 : 1;
    if (row === startingRow && board[row + dir * 2][col] === "") {
      moves.push({ row: row + dir * 2, col });
    }
  }

  // === Captures ===
  // left capture
  if (
    board[row + dir] &&
    board[row + dir][col - 1]
  ) {
    const target = board[row + dir][col - 1];
    if (target !== "" && isWhite !== (target === target.toUpperCase())) {
      moves.push({ row: row + dir, col: col - 1 });
    }
  }

  // right capture
  if (
    board[row + dir] &&
    board[row + dir][col + 1]
  ) {
    const target = board[row + dir][col + 1];
    if (target !== "" && isWhite !== (target === target.toUpperCase())) {
      moves.push({ row: row + dir, col: col + 1 });
    }
  }

  break;
}

      case "k": {
        const dirs = [
          [1, 0], [-1, 0], [0, 1], [0, -1],
          [1, 1], [1, -1], [-1, 1], [-1, -1],
        ];

        for (let [dr, dc] of dirs) {
          const nr = row + dr;
          const nc = col + dc;

          if (board[nr] && board[nr][nc] !== undefined) {
            const target = board[nr][nc];
            if (target === "" || isWhite !== (target === target.toUpperCase())) {
              moves.push({ row: nr, col: nc });
            }
          }
        }
        break;
      }
    }

    return moves;
  }

  function movePiece(sr, sc, dr, dc) {
    const newBoard = board.map((r) => [...r]);
    newBoard[dr][dc] = newBoard[sr][sc];
    newBoard[sr][sc] = "";
    setBoard(newBoard);
  }

  function handleSquareClick(row, col) {
    const piece = board[row][col];

    // Select a piece
    if (!selected && piece !== "") {
      setSelected({ row, col });
      setValidMoves(getValidMoves(piece, row, col));
      return;
    }

    // Move the piece
    if (selected) {
      const valid = validMoves.some((m) => m.row === row && m.col === col);

      if (valid) {
        movePiece(selected.row, selected.col, row, col);
      }

      setSelected(null);
      setValidMoves([]);
    }
  }

  // ---------- RENDER UI ----------
  return (
    <div className="chessboard">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isDark = (rowIndex + colIndex) % 2 === 1;
          const highlight = validMoves.some(
            (m) => m.row === rowIndex && m.col === colIndex
          );

          return (
            <div
              key={rowIndex + "-" + colIndex}
              className={
                "square " +
                (isDark ? "dark" : "light") +
                (highlight ? " highlight" : "")
              }
              onClick={() => handleSquareClick(rowIndex, colIndex)}
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
