import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import RootLayout from "./Layouts/RootLayout";
import Login from "./Pages/Login";
import { UseUserContext } from "./Context/UserContext";
import { useEffect } from "react";
import PreviewMail from "./Components/PreviewMail";
import Drafts from "./Pages/Drafts";

function AppRoutes() {
  const {
    state: { user },
  } = UseUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const currentLocation = window.location.pathname + window.location.search;
    if (currentLocation === "/") {
      navigate("/mail/inbox", { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/mail/inbox" replace />}
      />
      <Route
        path="/mail"
        element={!user ? <Navigate to="/login" replace /> : <RootLayout />}
      >
        <Route index path="inbox" element={<Dashboard />} />
        <Route path="inbox/:mailId" element={<PreviewMail />} />
        <Route path="draft" element={<Drafts />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
