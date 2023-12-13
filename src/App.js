import "./App.css";
// import Homepage from "./Pages/Homepage";
import { Route, Routes } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import Homepage from './Pages/Homepage';
// import MeetPage from "./video/MeetPage";
import CallModel from "./components/CallModel/CallModel";
import AudioPage from "./video/AudioPage";

function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={< Homepage />} />
        <Route path="/chat" element={<ChatPage />} />
        {/* <Route path="/video/call/:id" element={< MeetPage />} /> */}
        <Route path="/video/call/:id" element={< AudioPage />} />
        <Route path="/call/model" element={< CallModel />} />
      </Routes>
    </div>
  );
}

export default App;