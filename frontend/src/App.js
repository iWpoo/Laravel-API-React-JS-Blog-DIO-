import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import './css/style.css';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Main from './components/Main';
import Login from './auth/Login';
import Register from './auth/Register';
import Profile from './auth/Profile';
import EditProfile from './auth/EditProfile';
import ChangePassword from './auth/ChangePassword';
import Privacy from './auth/Privacy';

const App = () => {
  let AuthToken = '';

  if(!localStorage.getItem('auth_token')) {
    AuthToken = (
      <div>
          <Routes>
             <Route path="/" element={<Login />} />
          </Routes>
          <Routes>
             <Route path="/register" element={<Register />} />
          </Routes>
      </div>
    )
  } else {
    AuthToken = (
    <div>
        <Header />
        <hr className="hr"/>
        <Routes>
          <Route path="/profile/:id" element={<Profile/>} />
          <Route path="/accounts/edit" element={<EditProfile/>} />
          <Route path="/accounts/password/change/" element={<ChangePassword/>} />
          <Route path="/accounts/privacy_and_security/" element={<Privacy/>} />
        </Routes>
        <Main />
    </div>
    )
  }

  return (
    <div className="App">
       <Router>
          {AuthToken}
       </Router>
    </div>
  );
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
