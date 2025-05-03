import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Auth from "./pages/Auth";
import Footer from "./Components/Footer";
import Homepage from "./pages/Homepage";
import AppRoutes from "./router/AppRoutes.jsx";

function App() {
  return (
 <AppRoutes/>
  );
}

export default App;
