import "./chessboard.css";

export default function ChessBoard() {

  // Initial board setup
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

  // Unicode chess pieces
  const pieceIcons = {
    r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",
    R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙",
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
                <span className="piece">{pieceIcons[piece]}</span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
