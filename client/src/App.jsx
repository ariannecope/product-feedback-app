import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AddFeedback from "./pages/AddFeedback.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add" element={<AddFeedback />} />
    </Routes>
  );
}

export default App;
