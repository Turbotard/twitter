import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import MessagesPage from "./components/Messages";

import "./styles/App.css";
import LeftMenu from "./components/LeftMenu";

function App() {
  return (
    <Router>
      <LeftMenu />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/message/:userId" element={<MessagesPage />} />
      </Routes>
    </Router>
  );
}

export default App
