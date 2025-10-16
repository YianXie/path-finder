import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Competitions from "./pages/Competitions";
import Clubs from "./pages/Clubs";
import Tutoring from "./pages/Tutoring";
import Login from "./pages/auth/Login";
import Profile from "./pages/auth/Profile";
import ItemDetail from "./pages/ItemDetail";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/competitions" element={<Competitions />} />
                    <Route path="/clubs" element={<Clubs />} />
                    <Route path="/tutoring" element={<Tutoring />} />
                    <Route path="/item/:id" element={<ItemDetail />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
