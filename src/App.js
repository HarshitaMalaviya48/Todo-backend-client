import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Logout from "./pages/Logout";
import Todos from "./pages/Todos";
import UpdateProfile from "./pages/UpdateProfile";
import DeleteProfile from "./pages/DeleteProfile";
import EditTodo from "./pages/EditTodo";
import ProtectedRoutes, {
  ProtectedLoginSignupRoutes,
} from "./utills/ProtectedRoutes";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/todos" element={<Todos />}></Route>
            <Route path="/logout" element={<Logout />}></Route>
            <Route path="/update-profile" element={<UpdateProfile />}></Route>
            <Route path="/delete-Profile" element={<DeleteProfile />}></Route>
            <Route path="/edit/:id" element={<EditTodo />}></Route>
          </Route>
          <Route element={<ProtectedLoginSignupRoutes />}>
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />}></Route>
          </Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
