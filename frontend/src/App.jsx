import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import Layout from "./layouts/Layout.jsx";
import Index from "./pages/Index.jsx";
import Show from "./pages/ShowListing.jsx";
import New from "./pages/NewListing.jsx";
import Edit from "./pages/EditListing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Search from "./pages/Search.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Profile from "./pages/Profile.jsx"; 

function App() {
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("https://stay-finder-backend-umber.vercel.app/check-auth", {
          withCredentials: true,
        });
        if (res.data.authenticated) {
          setCurrUser(res.data.user);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout currUser={currUser} />}>
          <Route index element={<Index />} />
          <Route path="listings" element={<Index />} />
          <Route path="listings/new" element={<New />} />
          <Route path="listings/:id" element={<Show />} />
          <Route path="listings/:id/edit" element={<Edit />} />
          <Route path="/listings/search" element={<Search />} />
          
          <Route path="/profile" element={<Profile currUser={currUser} />} />
          
          <Route path="/login" element={<Login setCurrUser={setCurrUser} />} />
          <Route path="/signup" element={<Signup setCurrUser={setCurrUser} />} />
          <Route path="/reset-password"element={<ResetPassword />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;