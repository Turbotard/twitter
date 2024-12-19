import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import MessagesPage from "./components/Messages";
import Profile from "./components/Profile";
import LeftMenu from "./components/LeftMenu";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/message/:userId" element={<><LeftMenu /><div className="with-margin"><MessagesPage /></div></>} />
        <Route path="/profile" element={<><LeftMenu /><Profile /></>} />
      </Routes>
    </Router>
  );
}

export default App;
