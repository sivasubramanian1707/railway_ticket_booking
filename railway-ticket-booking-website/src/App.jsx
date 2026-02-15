import { Route, Routes } from "react-router-dom";

import Navbar from "./app/layout/Navbar";
import Login from "./app/pages/Login";
import Register from "./app/pages/Register";
import ForgotPassword from "./app/pages/ForgotPassword";
import Search from "./app/pages/Search";
import TrainDetails from "./app/pages/TrainDetails";
import MyBookings from "./app/pages/MyBookings";
import AdminDashboard from "./app/pages/AdminDashboard";
import UserRoute from "./app/privateRoutes/UserRoute";
import AdminRoute from "./app/privateRoutes/AdminRoute";
import Home from "./app/pages/Home";

import "./styles/app.css";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<UserRoute />}>
          <Route path="/search" element={<Search />} />
          <Route path="/train/:id" element={<TrainDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-train" element={<AdminDashboard />} />
          <Route path="/admin/add-route" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
