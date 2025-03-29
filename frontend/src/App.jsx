import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Auth from "./pages/Auth";
import Footer from "./Components/Footer";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/login" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
