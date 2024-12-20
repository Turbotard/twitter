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
import Notifications from "./components/Notifications";
import "./styles/App.css";

const eventSource = new EventSource("http://localhost:3000/notifications", {
  withCredentials: true,
});

eventSource.addEventListener("message-received", (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
});

eventSource.close();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/message/:userId" element={<><LeftMenu /><div className="with-margin"><MessagesPage /></div></>} />
        <Route path="/notification" element={<><LeftMenu /><div className="with-margin"><Notifications /></div></>} />
        <Route path="/profile" element={<><LeftMenu /><Profile /></>} />
      </Routes>
    </Router>
  );
}

export default App;
