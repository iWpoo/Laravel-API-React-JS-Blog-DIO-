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
  const [clsName2, setClsName2] = useState('');
  const [textWarning, setTextWarning] = useState('');
  const [textConfirm, setTextConfirm] = useState('');

  useEffect(() => {
      axios.get(`http://localhost:8000/api/profile/`+localStorage.getItem('auth_id')).then( res => {
          if(res.data.status === 200)
          {
            setToken(res.data.user.token);
            if(res.data.user.closed === 'true') {
              setCheck(true);
              setClose(true);
              setTextWarning('Вашу страничку могут видеть все пользователи. Сделать аккаунт общедоступным?');
              setTextConfirm('Сделать аккаунт общедоступным');
            }else {
              setCheck(false);
              setClose(false);
              setTextWarning('Вашу страничку могут видеть те кто подписаны на вас. Сделать аккаунт закрытым?');
              setTextConfirm('Сделать аккаунт закрытым');
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
    setClsName2('blur');
  }

  const cancel = () => {
    setClsName('disapear');
    setClsName2('');
    setCheck(!check);
    setClose(!closeUser);
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
    <div>
      <div className="block-center">
      <div className={clsName}>
      <div className="block-confirm">
        <div><br/>
          <div className="text-warning">{textWarning}</div>
          <hr/>
          <div onClick={handleSubmit} className="text-confirm">{textConfirm}</div><br/>
          <div onClick={cancel} className="text-confirm">Отмена</div>
        </div>
      </div>
      </div>
      </div>
        <div className={"block-edit-profile " + clsName2}>
        <div className="block-switch-elements">
          <div className="li-list"><br/>
            <Link to="/accounts/edit/"><div className="li-text">Редактировать профиль</div></Link><br/><br/>
            <Link to="/accounts/password/change/"><div className="li-text">Сменить пароль</div></Link><br/><br/>
            <Link to="/accounts/privacy_and_security/"><div className="li-text active">Конфиденциальность и безопасность</div></Link><br/><br/>
          </div>
        </div>
  
      <form method="post" className="form-privacy-profile ">
        <div className="text-privacy">Конфиденциальность аккаунта</div><br/>
        <div className="block_flex_center_align">
          <input type="checkbox" id="closed" onChange={checkedSubmit} checked={check}/>
          <label htmlFor="closed" id="text-for-closed">Закрытый аккаунт</label>
        </div>
      </form>
      </div>
    </div>
  );
} else {
  history('/');
}

}

export default Privacy;