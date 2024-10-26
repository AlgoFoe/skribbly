import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Play from "./pages/play/Play";
import { useAuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser } = useAuthContext();

  return (
    <>
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path='/login' element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path='/signup' element={authUser ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/play/:roomId" element={authUser ? <Play /> : <Navigate to="/" />} />
      </Routes>
      <Toaster/>  
    </>
  );
}

export default App;
