import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import '../css/auth.css';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setError] = useState([]);

  let maxNumber = 999999999999999999;
  let randomNumber = Math.floor((Math.random() * maxNumber) + 100000000000000000);
  const [token, setToken] = useState(randomNumber);
  let CryptoJS = require("crypto-js");
  const tk = CryptoJS.AES.encrypt(token, 'my-secret-token').toString();

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
    if(email.length >= 11 && name.length >= 5 && username.length >= 3 && password.length >= 8) {
      setDisabled(false);
    }else {
      setDisabled(true);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('token', tk);
    formData.append('password', password);

    axios.get('http://localhost:8000/sanctum/csrf-cookie').then(response => {
    axios.post('http://localhost:8000/api/register', formData).then(res => {
        if(res.data.status === 200) {
            navigate('/');
        }
        else {
           console.log(res.data.validation_errors);
           setError(res.data.validation_errors);
        }
    });
    });
  }

  if(!localStorage.getItem('auth_token')) {
    return (
      <div className="blockAuth">
      <div className="Auth">
      <div className="dio">DIO</div>

      <form onSubmit={handleSubmit} method="post">
          <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Эл. адрес" className="username" /><br/>
          <input type="text" name="name" onChange={(e) => setName(e.target.value)} value={name} placeholder="Имя и Фамилия" className="username" /><br/>
          <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Имя пользователя" className="username" /><br/>
          <input type={type} name="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Пароль" className="password" />
          <button type="button" onClick={showPassword} className="showBtn">Показать</button><br/>
          <button type="submit" className="btn" disabled={isDisabled}>Регистрация</button>
      </form><br/>
      </div>

      <div className="toReg">
      <span className="textNoAcc">Есть аккаунт? </span>
      <Link to="/" className="toRegText">Вход</Link>
      </div>
      </div>
    );
} else {
  navigate('/');
}
}

export default Register;
