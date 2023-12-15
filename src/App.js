import "./App.css";
// import Homepage from "./Pages/Homepage";
import { Route, Routes } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import Homepage from './Pages/Homepage';
// import MeetPage from "./video/MeetPage";
import CallModel from "./components/CallModel/CallModel";
import AudioPage from "./video/AudioPage";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={< Homepage />} />
        <Route path="/chat" element={<ChatPage />} />
        {/* <Route path="/video/call/:id" element={< MeetPage />} /> */}
        <Route path="/audio/call/:id" element={< AudioPage />} />
        <Route path="/call/model" element={< CallModel />} />
      </Routes>

      {/* ToastContainer for displaying notifications */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;