import { useState } from "react";
import "./chessboard.css";

// Import SVG icons (fix filenames / paths as needed)
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

  // history / board state
  const [history, setHistory] = useState([initialBoard]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [board, setBoard] = useState(initialBoard);

  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);

  // moveList stores objects like { white: "e4", black: "e5" }
  const [moveList, setMoveList] = useState([]);

  // helper: convert row/col to algebraic e.g. (6,4) => "e2"
  function toNotation(row, col) {
    const files = "abcdefgh";
    return files[col] + (8 - row);
  }

  // simple piece letter map for notation (pawn => "")
  function pieceLetter(piece) {
    const p = piece.toUpperCase();
    if (p === "P") return "";
    if (p === "N") return "N";
    if (p === "B") return "B";
    if (p === "R") return "R";
    if (p === "Q") return "Q";
    if (p === "K") return "K";
    return "";
  }

  // ---------- MOVE GENERATION (pawn + king implemented) ----------
  function getValidMoves(piece, row, col) {
    const moves = [];
    if (!piece) return moves;
    const isWhite = piece === piece.toUpperCase();

    switch (piece.toLowerCase()) {
      case "p": {
        const dir = isWhite ? -1 : 1;
        // 1-step
        if (board[row + dir] && board[row + dir][col] === "") {
          moves.push({ row: row + dir, col });
          // 2-step
          const startRow = isWhite ? 6 : 1;
          if (row === startRow && board[row + dir * 2][col] === "") {
            moves.push({ row: row + dir * 2, col });
          }
        }
        // captures
        for (let dc of [-1, 1]) {
          const nr = row + dir;
          const nc = col + dc;
          if (board[nr] && board[nr][nc]) {
            const target = board[nr][nc];
            if (target !== "" && isWhite !== (target === target.toUpperCase())) {
              moves.push({ row: nr, col: nc });
            }
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

  // ---------- MOVE PIECE + generate move notation (with capture 'x') ----------
  function movePiece(sr, sc, dr, dc) {
    // detect capture from current board BEFORE changing it
    const target = board[dr][dc]; // "" or piece
    const movedPiece = board[sr][sc];
    const isWhite = movedPiece === movedPiece.toUpperCase();

    // build notation
    const destNotation = toNotation(dr, dc);
    let notation = "";

    if (movedPiece.toLowerCase() === "p") {
      // pawn
      if (target !== "") {
        // capture: file of source + 'x' + dest
        const files = "abcdefgh";
        notation = files[sc] + "x" + destNotation;
      } else {
        // plain pawn move
        notation = destNotation;
      }
    } else {
      // piece move or capture
      const letter = pieceLetter(movedPiece);
      notation = letter + (target !== "" ? "x" : "") + destNotation;
    }

    // apply move on board
    const newBoard = board.map(r => [...r]);
    newBoard[dr][dc] = newBoard[sr][sc];
    newBoard[sr][sc] = "";
    setBoard(newBoard);
    setLastMove({ sr, sc, dr, dc });

    // update history
    const newHistory = history.slice(0, currentMoveIndex + 1);
    newHistory.push(newBoard);
    setHistory(newHistory);
    setCurrentMoveIndex(newHistory.length - 1);

    // update moveList as pair (white then black)
    if (isWhite) {
      // start new pair with white move
      setMoveList(prev => [...prev, { white: notation, black: null }]);
    } else {
      // fill black move in last pair
      setMoveList(prev => {
        if (prev.length === 0) {
          // defensive: if no white move yet, push empty white first
          return [{ white: null, black: notation }];
        } else {
          const copy = prev.map(p => ({ ...p }));
          copy[copy.length - 1].black = notation;
          return copy;
        }
      });
    }
  }

  // ---------- HANDLE CLICK ----------
  function handleSquareClick(row, col) {
    const piece = board[row][col];

    // select piece
    if (!selected && piece !== "") {
      setSelected({ row, col });
      setValidMoves(getValidMoves(piece, row, col));
      return;
    }

    // move if selected
    if (selected) {
      const valid = validMoves.some(m => m.row === row && m.col === col);
      if (valid) {
        movePiece(selected.row, selected.col, row, col);
      }
      setSelected(null);
      setValidMoves([]);
    }
  }

  // ---------- NAVIGATION ----------
  function goPrev() {
    if (currentMoveIndex > 0) {
      setCurrentMoveIndex(currentMoveIndex - 1);
      setBoard(history[currentMoveIndex - 1]);
    }
  }

  function goNext() {
    if (currentMoveIndex < history.length - 1) {
      setCurrentMoveIndex(currentMoveIndex + 1);
      setBoard(history[currentMoveIndex + 1]);
    }
  }

  // ---------- RENDER ----------
  return (
    <div className="layout">
      {/* Board */}
      <div className="chessboard">
        {board.map((rowArr, rowIndex) =>
          rowArr.map((piece, colIndex) => {
            const isDark = (rowIndex + colIndex) % 2 === 1;
            const highlight = validMoves.some(m => m.row === rowIndex && m.col === colIndex);

            const isLastMove =
              lastMove &&
              ((lastMove.sr === rowIndex && lastMove.sc === colIndex) ||
               (lastMove.dr === rowIndex && lastMove.dc === colIndex));

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={
                  "square " +
                  (isDark ? "dark" : "light") +
                  (highlight ? " highlight" : "") +
                  (isLastMove ? " last-move" : "")
                }
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && <img src={pieceImages[piece]} alt={piece} className="piece" />}
              </div>
            );
          })
        )}
      </div>

      {/* Move list + controls */}
      <div className="move-list">
        <h3>Moves</h3>

        <ol>
          {moveList.map((pair, idx) => (
            <li key={idx}>
              {/* <strong>{idx + 1}.</strong>&nbsp; */}
              <span>{pair.white ?? ""}</span>&nbsp;&nbsp;
              <span>{pair.black ?? ""}</span>
            </li>
          ))}
        </ol>

        <div className="controls">
          <button onClick={goPrev} disabled={currentMoveIndex === 0}>
            ⬅ Prev
          </button>
          <button onClick={goNext} disabled={currentMoveIndex === history.length - 1}>
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
}
