import "./assets/css/App.css"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AllRoutes from "./allroutes/AllRoutes";
function App() {
  return (
    <div className="App">
     
      {/* AllRoutes component for managing application routes */}
      <AllRoutes />

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