/* eslint-disable react-refresh/only-export-components */
import "./index.css";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Repositories from "./pages/subpages/repositories.tsx";
import Dashboard from "./pages/dashboard.tsx";
import Profile from "./pages/subpages/profile.tsx";

const App = () => {
  return (
    <Router>
      <div className="flex flex-row h-screen w-full">
        <Dashboard />
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/repositories" element={<Repositories />} />
        </Routes>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
