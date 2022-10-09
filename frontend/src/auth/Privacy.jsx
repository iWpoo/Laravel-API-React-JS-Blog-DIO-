import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import '../css/auth.css';
import axios from 'axios';

const Privacy = () => {
  const history = useNavigate();
  const [token, setToken] = useState('');
  const [closeUser, setClose] = useState(false);
  const [check, setCheck] = useState(false);
  const [clsName, setClsName] = useState('disapear');

  useEffect(() => {
      axios.get(`http://localhost:8000/api/profile/`+localStorage.getItem('auth_id')).then( res => {
          if(res.data.status === 200)
          {
            setToken(res.data.user.token);
            if(res.data.user.closed === 'true') {
              setCheck(true);
              setClose(true);
            }else {
              setCheck(false);
              setClose(false);
            }
          }
          else if(res.data.status === 404)
          {
            history('/');
          }
      });

  }, []);

  const checkedSubmit = () => {
    setCheck(!check);
    setClose(!closeUser);
    console.log(closeUser);
    setClsName('block');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('closed', closeUser);

    axios.post(`/api/privacy_and_security/${localStorage.getItem('auth_id')}`, formData).then(res => {
      if(res.data.status === 200) {
        window.location.reload();
      }
      else if(res.data.status === 422) {
        console.log(res.data.validate_err);
      }
    });
  }

  let CryptoJS = require("crypto-js");
  const tk = token;
  let dtk = CryptoJS.AES.decrypt(tk, 'my-secret-token');


if(localStorage.getItem('auth_token') === dtk.toString(CryptoJS.enc.Utf8)) {
  return (
    <div className="block-edit-profile">
    <div className="block-switch-elements">
      <div className="li-list"><br/>
        <Link to="/accounts/edit/"><div className="li-text">Редактировать профиль</div></Link><br/><br/>
        <Link to="/accounts/password/change/"><div className="li-text">Сменить пароль</div></Link><br/><br/>
        <Link to="/accounts/privacy_and_security/"><div className="li-text active">Конфиденциальность и безопасность</div></Link><br/><br/>
      </div>
    </div>

    <form method="post" className="form-privacy-profile">
      <div className="text-privacy">Конфиденциальность аккаунта</div>
      <input type="checkbox" onChange={checkedSubmit} checked={check}/>
      <button className={clsName} onClick={handleSubmit}>Закрыть аккаунт</button>
    </form>
    </div>
  );
} else {
  history('/');
}

}

export default Privacy;