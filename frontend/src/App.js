import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertyList from './components/PropertyList';
import Registry from "./components/Registry";
import Login from "./components/Login"
import SingleProperty from "./components/SingleProperty";

const App = () => {
  return (
      <Router>
        <div>
          <Routes>
            <Route forceRefresh={true} exact path="/props" element={<PropertyList/>} />
            <Route exact path="/props/:id" element={<SingleProperty />} />
            <Route exact path="/registry" element={<Registry/>} />
            <Route exact path="/login" element={<Login/>} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;