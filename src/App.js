import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Logout from "./components/Logout"
import Todos from "./pages/Todos";
import { toast } from "react-toastify";

function App() {
  let isLoggedIn = window.localStorage.getItem("isLoggedIn");
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          
          {isLoggedIn ? (
            <>
              <Route path="/todos" element={<Todos />}></Route>
              <Route path="/logout" element={<Logout />}></Route>
            </>
          ) : (
           <>
            <Route path="/register" element={<SignUp />} />
           <Route path="/login" element={<Login />}></Route>
           </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
