import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertyList from './components/PropertyList';

const App = () => {
  return (
      <Router>
        <div>
          <Routes>
            <Route exact path="/" element={<PropertyList/>} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;