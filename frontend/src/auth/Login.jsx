import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import '../css/auth.css';
import axios from 'axios';

const Login = (props) => {
  let CryptoJS = require("crypto-js");
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [type, setType] = useState('');
  const [flip, setFlip] = useState(true);

  useEffect(() => {
    if(flip == true) {
      setType('password');
    }else {
      setType('text');
    }
  });
  const showPassword = () => {
      setFlip(!flip);
  }

  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    if(username.length >= 3 && password.length >= 8) {
      setDisabled(false);
    }else {
      setDisabled(true);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
 
    axios.get('http://localhost:8000/sanctum/csrf-cookie').then(response => {
    axios.post('http://localhost:8000/api/login', formData).then(res => {
        const token = res.data.token;
        let dtk = CryptoJS.AES.decrypt(token, 'my-secret-token');
        if(res.data.status === 200) {
            localStorage.setItem('auth_token', dtk.toString(CryptoJS.enc.Utf8));
            localStorage.setItem('auth_name', res.data.username);
            localStorage.setItem('auth_image', res.data.image);
            localStorage.setItem('auth_id', res.data.id);
            const pass = CryptoJS.AES.encrypt(password, 'my-secret-personal-password').toString();
            localStorage.setItem('auth_info', pass);
            window.location.reload();
        }
        else if(res.data.status === 401) {
            setError('Такого пользователя нету.');
        }
        else {
            setError('Такого пользователя нету.');
        }

    });
    });
  }

  return (
    <div className="blockAuth">
    <div className="Auth">
    <div className="dio">DIO</div>
    <div className="error">{error}</div><br/>
    <form onSubmit={handleSubmit}>
        <input type="text" onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Имя пользователя" className="username" /><br/>
        <input type={type} onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Пароль" className="password" />
        <button type="button" onClick={showPassword} className="showBtn">Показать</button><br/>
        <button type="submit" className="btn" disabled={isDisabled}>Войти</button>
    </form><br/>
    <a href="" className="forgotPass">Забыли пароль?</a><br/><br/>
    </div>

    <div className="toReg">
    <span className="textNoAcc">У вас ещё нет аккаунта? </span>
    <Link to="/register" className="toRegText">Зарегистрироваться</Link>
    </div>
    </div>
  );
}

export default Login;
