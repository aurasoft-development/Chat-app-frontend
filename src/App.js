// import './App.css';
// import { RouterProvider, createBrowserRouter } from 'react-router-dom';
// import Homepage from './Pages/Homepage';
// import ChatPage from './Pages/ChatPage';
// import ChatProvider from './components/Context/ChatProvider';
// const router = createBrowserRouter([
//   { path: "/", element: <Homepage /> },
//   { path: "/chat", element: <ChatPage /> },
// ]);
// function App() {
//   return <div className="App">
//     <ChatProvider>
//       <RouterProvider router={router} />
//     </ChatProvider>
//   </div>
// }

// export default App;


import "./App.css";
// import Homepage from "./Pages/Homepage";
import { Route,Routes } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import Homepage from './Pages/Homepage';
// import Chatpage from "./Pages/Chatpage";

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={< Homepage />} />
      <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;