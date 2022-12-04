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
  const [privateAcc, setPrivateAcc] = useState('');

  const [checkLike, setCheckLike] = useState(false);
  const [showLike, setShowLike] = useState(false);
  const [clsNameLike, setClsNameLike] = useState('disapear');
  const [textWarning2, setTextWarning2] = useState('');
  const [textConfirm2, setTextConfirm2] = useState('');
  const [privateLikes, setPrivateLikes] = useState('');

  useEffect(() => {
      axios.get(`http://localhost:8000/api/profile/`+localStorage.getItem('auth_id')).then( res => {
          if(res.data.status === 200)
          {
            setToken(res.data.user.token);
            setPrivateAcc(res.data.user.is_private);
            setPrivateLikes(res.data.user.likes);

            if(res.data.user.is_private === 'true') {
              setCheck(true);
              setClose(true);
            }else if(res.data.user.is_private === 'false'){
              setCheck(false);
              setClose(false);
            }

            if(res.data.user.likes === 'true') {
              setCheckLike(true);
              setShowLike(true);
            }else if(res.data.user.likes === 'false'){
              setCheckLike(false);
              setShowLike(false);
            }
          }
          else if(res.data.status === 404)
          {
            console.log(404);
          }
      });

  }, [localStorage.getItem('auth_id')]);

  const checkedSubmit = () => {
    if(privateAcc === 'true') {
      setTextWarning('Вашу страничку могут видеть все пользователи. Сделать аккаунт общедоступным?');
      setTextConfirm('Сделать аккаунт общедоступным');
    }else {
      setTextWarning('Вашу страничку могут видеть те кто подписаны на вас. Сделать аккаунт закрытым?');
      setTextConfirm('Сделать аккаунт закрытым');
    }

    setCheck(!check);
    setClose(!closeUser);
    setClsName('block');
    setClsName2('blur');
  }

  const checkedLikeSubmit = () => {
    if(privateLikes === 'true') {
      setTextWarning('Ваши пролайканные посты будут видеть все пользователи. Показывать всем?');
      setTextConfirm('Сделать общедоступным');
    }else {
      setTextWarning('Никто кроме вас не будет видеть ваши пролайканные посты. Скрыть от других?');
      setTextConfirm('Сделать приватным');
    }

    setCheckLike(!checkLike);
    setShowLike(!showLike);
    setClsNameLike('block');
    setClsName2('blur');
  }

  const cancel = () => {
    setClsName('disapear');
    setClsName2('');
    setCheck(!check);
    setClose(!closeUser);
  }

  const cancelLike = () => {
    setClsName2('');
    setClsNameLike('disapear');
    setCheckLike(!checkLike);
    setShowLike(!showLike);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('is_private', closeUser);
    formData.append('likes', showLike);

    axios.post(`/api/privacy_and_security/${localStorage.getItem('auth_id')}`, formData).then(res => {
      if(res.data.status === 200) {
        window.location.reload();
      }
    });
  }

  let CryptoJS = require("crypto-js");
  const tk = token;
  let dtk = CryptoJS.AES.decrypt(tk, 'my-secret-token');

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

      <div className="block-center">
      <div className={clsNameLike}>
      <div className="block-confirm">
        <div><br/>
          <div className="text-warning">{textWarning}</div>
          <hr/>
          <div onClick={handleSubmit} className="text-confirm">{textConfirm}</div><br/>
          <div onClick={cancelLike} className="text-confirm">Отмена</div>
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
          <input type="checkbox" className="closed" id="closed" onChange={checkedSubmit} checked={check}/>
          <label htmlFor="closed" className="text-for-closed">Закрытый аккаунт</label>
        </div>
        <p className="gray-info-mini-text">Если у вас закрытый аккаунт, ваши фото и видео в DIO смогут видеть только люди, которых вы одобрите.</p>
        <hr/>

        <div className="block_flex_center_align">
          <input type="checkbox" className="closed" id="likes" onChange={checkedLikeSubmit} checked={checkLike}/>
          <label htmlFor="likes" className="text-for-closed">Скрыть показ понравившиеся видео</label>
        </div>
        <p className="gray-info-mini-text">Если у вас закрытый аккаунт, ваши фото и видео в DIO смогут видеть только люди, которых вы одобрите.</p>
        <hr/>
      </form> 
      </div>
    </div>
  );

}

export default Privacy;