import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertyList from './components/PropertyList';
import Registry from "./components/Registry";

const App = () => {
  return (
      <Router>
        <div>
          <Routes>
            <Route exact path="/" element={<PropertyList/>} />
            <Route exact path="/registry" element={<Registry/>} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;