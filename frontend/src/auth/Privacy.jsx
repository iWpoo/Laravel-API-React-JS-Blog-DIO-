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
      setTextWarning('???????? ?????????????????? ?????????? ???????????? ?????? ????????????????????????. ?????????????? ?????????????? ???????????????????????????');
      setTextConfirm('?????????????? ?????????????? ??????????????????????????');
    }else {
      setTextWarning('???????? ?????????????????? ?????????? ???????????? ???? ?????? ?????????????????? ???? ??????. ?????????????? ?????????????? ?????????????????');
      setTextConfirm('?????????????? ?????????????? ????????????????');
    }

    setCheck(!check);
    setClose(!closeUser);
    setClsName('block');
    setClsName2('blur');
  }

  const checkedLikeSubmit = () => {
    if(privateLikes === 'true') {
      setTextWarning('???????? ???????????????????????? ?????????? ?????????? ???????????? ?????? ????????????????????????. ???????????????????? ?????????');
      setTextConfirm('?????????????? ??????????????????????????');
    }else {
      setTextWarning('?????????? ?????????? ?????? ???? ?????????? ???????????? ???????? ???????????????????????? ??????????. ???????????? ???? ?????????????');
      setTextConfirm('?????????????? ??????????????????');
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
          <div onClick={cancel} className="text-confirm">????????????</div>
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
          <div onClick={cancelLike} className="text-confirm">????????????</div>
        </div>
      </div>
      </div>
      </div>
        
      <div className={"block-edit-profile " + clsName2}>
        <div className="block-switch-elements">
          <div className="li-list"><br/>
            <Link to="/accounts/edit/"><div className="li-text">?????????????????????????? ??????????????</div></Link><br/><br/>
            <Link to="/accounts/password/change/"><div className="li-text">?????????????? ????????????</div></Link><br/><br/>
            <Link to="/accounts/privacy_and_security/"><div className="li-text active">???????????????????????????????????? ?? ????????????????????????</div></Link><br/><br/>
          </div>
        </div>
  
      <form method="post" className="form-privacy-profile ">
        <div className="text-privacy">???????????????????????????????????? ????????????????</div><br/>
        <div className="block_flex_center_align">
          <input type="checkbox" className="closed" id="closed" onChange={checkedSubmit} checked={check}/>
          <label htmlFor="closed" className="text-for-closed">???????????????? ??????????????</label>
        </div>
        <p className="gray-info-mini-text">???????? ?? ?????? ???????????????? ??????????????, ???????? ???????? ?? ?????????? ?? DIO ???????????? ???????????? ???????????? ????????, ?????????????? ???? ????????????????.</p>
        <hr/>

        <div className="block_flex_center_align">
          <input type="checkbox" className="closed" id="likes" onChange={checkedLikeSubmit} checked={checkLike}/>
          <label htmlFor="likes" className="text-for-closed">???????????? ?????????? ?????????????????????????? ??????????</label>
        </div>
        <p className="gray-info-mini-text">???????? ?? ?????? ???????????????? ??????????????, ???????? ???????? ?? ?????????? ?? DIO ???????????? ???????????? ???????????? ????????, ?????????????? ???? ????????????????.</p>
        <hr/>
      </form> 
      </div>
    </div>
  );
} else {
  console.log(404);
}

}

export default Privacy;