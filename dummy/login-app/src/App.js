import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Components/Login';
import Signup from './Components/Signup';
import MainPage from './Components/MainPage';
import Dashboard from './Components/Dashboard';
import Department from './Components/Department';
import Students from './Components/Students';
import Marksheet from './Components/Marksheet';
import DeptForm from './Components/DeptForm';


function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Pages */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main layout with nested routing */}
        <Route path="/main" element={<MainPage />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="department" element={<Department />} />
          <Route path="students" element={<Students />} />
          <Route path="marksheet" element={<Marksheet />} />
          <Route path="deptform" element={<DeptForm />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;


