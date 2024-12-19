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
import FriendRequests from "./components/FriendRequestPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LeftMenu />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/message/:userId" element={<MessagesPage />} />
        <Route path="/friend-request" element={<FriendRequests />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
