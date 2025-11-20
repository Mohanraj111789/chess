import { useState } from "react";
import "./chessboard.css";

// Import SVG icons (adjust paths/filenames if your assets are in a different folder)
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
  // initial board (uppercase = white, lowercase = black)
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

  // helpers
  const cloneBoard = (b) => b.map((row) => [...row]);

  function toNotation(row, col) {
    const files = "abcdefgh";
    return files[col] + (8 - row);
  }

  function pieceLetter(piece) {
    if (!piece) return "";
    const p = piece.toUpperCase();
    if (p === "P") return "";
    if (p === "N") return "N";
    if (p === "B") return "B";
    if (p === "R") return "R";
    if (p === "Q") return "Q";
    if (p === "K") return "K";
    return "";
  }

  // React state
  const [board, setBoard] = useState(cloneBoard(initialBoard));
  const [history, setHistory] = useState([cloneBoard(initialBoard)]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [selected, setSelected] = useState(null); // {row, col} or null
  const [validMoves, setValidMoves] = useState([]); // array of {row, col}
  const [lastMove, setLastMove] = useState(null); // {sr, sc, dr, dc}
  const [moveList, setMoveList] = useState([]); // [{ white, black }]
  const [isWhiteTurn, setIsWhiteTurn] = useState(true); // true = white to move

  // ---------- MOVE GENERATION (pawn + king implemented) ----------
  function inBounds(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
  }

  function isWhitePiece(piece) {
    return piece && piece === piece.toUpperCase();
  }

  function getValidMoves(piece, row, col) {
    const moves = [];
    if (!piece) return moves;

    // Only allow selecting pieces matching the current turn
    const pieceIsWhite = isWhitePiece(piece);
    if (pieceIsWhite !== isWhiteTurn) return moves;

    const pLower = piece.toLowerCase();

    switch (pLower) {
      case "p": {
        // pawns move forward; white moves up (-1), black moves down (+1)
        const dir = pieceIsWhite ? -1 : 1;
        const oneR = row + dir;
        // 1-step
        if (inBounds(oneR, col) && board[oneR][col] === "") {
          moves.push({ row: oneR, col });
          // 2-step from start row
          const startRow = pieceIsWhite ? 6 : 1;
          const twoR = row + dir * 2;
          if (row === startRow && inBounds(twoR, col) && board[twoR][col] === "") {
            moves.push({ row: twoR, col });
          }
        }
        // captures
        for (let dc of [-1, 1]) {
          const nr = row + dir;
          const nc = col + dc;
          if (inBounds(nr, nc)) {
            const target = board[nr][nc];
            if (target !== "" && isWhitePiece(target) !== pieceIsWhite) {
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
          if (inBounds(nr, nc)) {
            const target = board[nr][nc];
            if (target === "" || isWhitePiece(target) !== pieceIsWhite) {
              moves.push({ row: nr, col: nc });
            }
          }
        }
        break;
      }

      // other pieces not implemented: you can add N, B, R, Q moves later
      default:
        break;
    }
    return moves;
  }

  // ---------- MOVE PIECE + generate move notation (with capture 'x') ----------
  function movePiece(sr, sc, dr, dc) {
    const newBoard = cloneBoard(board);
    const movedPiece = newBoard[sr][sc];
    const target = newBoard[dr][dc]; // maybe ""

    if (!movedPiece) return;

    const isWhite = isWhitePiece(movedPiece);

    // notation
    const destNotation = toNotation(dr, dc);
    let notation = "";

    if (movedPiece.toLowerCase() === "p") {
      if (target !== "") {
        const files = "abcdefgh";
        notation = files[sc] + "x" + destNotation;
      } else {
        notation = destNotation;
      }
    } else {
      const letter = pieceLetter(movedPiece);
      notation = letter + (target !== "" ? "x" : "") + destNotation;
    }

    // apply the move
    newBoard[dr][dc] = newBoard[sr][sc];
    newBoard[sr][sc] = "";

    // update state
    setBoard(newBoard);
    setLastMove({ sr, sc, dr, dc });

    // update history and move index
    setHistory(prev => {
      const copy = prev.slice(0, currentMoveIndex + 1);
      copy.push(cloneBoard(newBoard));
      return copy;
    });
    setCurrentMoveIndex(prev => prev + 1);

    // update move list
    if (isWhite) {
      setMoveList(prev => [...prev, { white: notation, black: null }]);
    } else {
      setMoveList(prev => {
        if (prev.length === 0) return [{ white: null, black: notation }];
        const copy = prev.map(p => ({ ...p }));
        copy[copy.length - 1].black = notation;
        return copy;
      });
    }

    // flip turn
    setIsWhiteTurn(prev => !prev);
  }

  // ---------- HANDLE CLICK ----------
  function handleSquareClick(row, col) {
    const piece = board[row][col];

    // If no selection yet and clicked empty square -> do nothing
    if (!selected) {
      if (piece === "") return;
      // only allow selecting pieces of the current side to move
      if (isWhitePiece(piece) !== isWhiteTurn) return;

      setSelected({ row, col });
      setValidMoves(getValidMoves(piece, row, col));
      return;
    }

    // If clicked same square as selected -> deselect
    if (selected.row === row && selected.col === col) {
      setSelected(null);
      setValidMoves([]);
      return;
    }

    // If user clicked another own piece -> change selection (allow switching)
    if (piece !== "" && isWhitePiece(piece) === isWhiteTurn) {
      setSelected({ row, col });
      setValidMoves(getValidMoves(piece, row, col));
      return;
    }

    // Attempt to move if clicked on one of the valid moves
    const valid = validMoves.some(m => m.row === row && m.col === col);
    if (valid) {
      movePiece(selected.row, selected.col, row, col);
    }

    // clear selection regardless
    setSelected(null);
    setValidMoves([]);
  }

  // ---------- NAVIGATION ----------
  function goPrev() {
    if (currentMoveIndex > 0) {
      const newIndex = currentMoveIndex - 1;
      setCurrentMoveIndex(newIndex);
      setBoard(cloneBoard(history[newIndex]));
      // When going back in history, set turn accordingly:
      // If newIndex is even -> same as initial position (white to move)
      // initialIndex 0 = white to move. After 1 move (index 1) it's black to move, etc.
      setIsWhiteTurn(newIndex % 2 === 0);
    }
  }

  function goNext() {
    if (currentMoveIndex < history.length - 1) {
      const newIndex = currentMoveIndex + 1;
      setCurrentMoveIndex(newIndex);
      setBoard(cloneBoard(history[newIndex]));
      setIsWhiteTurn(newIndex % 2 === 0);
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

            const isSelected = selected && selected.row === rowIndex && selected.col === colIndex;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={
                  "square " +
                  (isDark ? "dark" : "light") +
                  (highlight ? " highlight" : "") +
                  (isLastMove ? " last-move" : "") +
                  (isSelected ? " selected" : "")
                }
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && pieceImages[piece] && (
                  <img src={pieceImages[piece]} alt={piece} className="piece" />
                )}
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

        <div style={{ marginTop: 12 }}>
          <strong>Turn:</strong> {isWhiteTurn ? "White" : "Black"}
        </div>
      </div>
    </div>
  );
}
