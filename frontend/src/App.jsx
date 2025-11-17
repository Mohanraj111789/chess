
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ChessBoard from "./components/ChessBoard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chess" element={<ChessBoard />} />
      </Routes>
    </BrowserRouter>
  );
}
