import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertyList from './components/PropertyList';
import Registry from "./components/Registry";
import Login from "./components/Login"
import SingleProperty from "./components/SingleProperty";
import Profile from "./components/Profile";
import AdminPage from "./components/AdminPage";

const App = () => {
  return (
      <Router>
        <div>
          <Routes>
            <Route forceRefresh={true} exact path="/props" element={<PropertyList/>} />
            <Route exact path="/props/:id" element={<SingleProperty />} />
            <Route exact path="/registry" element={<Registry/>} />
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/profile" element={<Profile/>} />
            <Route exact path="/admin" element={<AdminPage/>} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;