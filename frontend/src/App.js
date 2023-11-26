import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PropertyList from "./components/pages/propertyList/PropertyList";
import Registry from "./components/pages/registry/Registry";
import Login from "./components/pages/login/Login";
import SingleProperty from "./components/pages/signleProperty/SingleProperty";
import Profile from "./components/pages/profile/Profile";
import AdminPage from "./components/pages/admin/AdminPage";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/props" />} />
          <Route
            forceRefresh={true}
            exact
            path="/props"
            element={<PropertyList />}
          />
          <Route exact path="/props/:id" element={<SingleProperty />} />
          <Route exact path="/register" element={<Registry />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
