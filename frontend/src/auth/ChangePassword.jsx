import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import '../css/auth.css';
import axios from 'axios';

const ChangePassword = () => {
  const history = useNavigate();
  const [token, setToken] = useState('');
  const [image, setImage] = useState(localStorage.getItem('auth_image'));
  const [username, setUsername] = useState(localStorage.getItem('auth_name'));

  useEffect(() => {
      axios.get(`http://localhost:8000/api/profile/`+localStorage.getItem('auth_id')).then( res => {

          if(res.data.status === 200)
          {
            setToken(res.data.user.token);
          }
          else if(res.data.status === 404)
          {
            history('/');
          }
      });

  }, []);

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isDisabled, setDisabled] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if(oldPass.length >= 8 && newPass.length >= 8 && confirmPass.length >= 8) {
      setDisabled(false);
    }else {
      setDisabled(true);
    }
  });

  const handleChangePassword = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('password', newPass);

    let dpass = CryptoJS.AES.decrypt(localStorage.getItem('auth_info'), 'my-secret-personal-password');

    if(oldPass != dpass.toString(CryptoJS.enc.Utf8)) {
      setError('Неверный пароль.');
    }
    else if(newPass === dpass.toString(CryptoJS.enc.Utf8)) {
      setError('Новый пароль не должен соответствовать старому.');
    } 
    else if(newPass !== confirmPass) {
      setError('Пароли не совпадают.');
    } else {
    axios.post(`/api/password/${localStorage.getItem('auth_id')}`, formData).then(res => {
        if(res.data.status === 200) {
            window.location.reload();
        }
        else {
          console.log('Не удалось изменить пароль.');
        }
    });
    }
  }

  let CryptoJS = require("crypto-js");
  const tk = token;
  let dtk = CryptoJS.AES.decrypt(tk, 'my-secret-token');

  const [isImg, setIsImg] = useState(true);
  useEffect(() => {
    if(image == 'default.jpg') {
        setIsImg(false);
    }
  });


if(localStorage.getItem('auth_token') === dtk.toString(CryptoJS.enc.Utf8)) {
  return (
    <div className="block-edit-profile">
    <div className="block-switch-elements">
      <div className="li-list"><br/>
        <Link to="/accounts/edit/"><div className="li-text">Редактировать профиль</div></Link><br/><br/>
        <Link to="/accounts/password/change/"><div className="li-text active">Сменить пароль</div></Link><br/><br/>
        <Link to="/accounts/privacy_and_security/"><div className="li-text">Конфиденциальность и безопасность</div></Link><br/><br/>
      </div>
    </div>

    <form method="post" className="form-edit-profile">
      <div className="block-texts-username">
        {isImg == true ? <img src={'/uploads/profiles/'+image} className="image-edit-profile" /> :
        <img src={'/uploads/default/'+image} className="image-edit-profile" />}
        <div className="block-username">
        <span className="username-text">{username}</span>
        </div>
      </div>
      <br/>
      <div>{error}</div>
      <div className="block-form">
        <label className="label-profile">Старый пароль</label>
        <input className="input-edit" type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} /><br/>
        <label className="label-profile">Новый пароль</label>
        <input className="input-edit" type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} /><br/>
        <label className="label-profile">Подтвердить новый пароль</label>
        <input className="input-edit" type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} /><br/>
        
        <button className="btnEdit" onClick={handleChangePassword} disabled={isDisabled} type="submit">Сменить пароль</button>
    </div>
    </form>
    </div>
  );
} else {
  history('/');
}

}

export default ChangePassword;