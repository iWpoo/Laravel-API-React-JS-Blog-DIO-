import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import '../css/auth.css';
import axios from 'axios';
import {AiOutlineSetting} from 'react-icons/ai';

const Profile = () => {
  const history = useNavigate();
  const [userProfile, setUser] = useState({
      username: '',
      name: '',
      bio: '',
      image: '',
      token: '',
      site: '',
      phone: '',
      closed: '',
  });

  const {id} = useParams();

  useEffect(() => {
      axios.get(`http://localhost:8000/api/profile/${id}`).then( res => {
          if(res.data.status === 200)
          {
              setUser(res.data.user);
          }
          else if(res.data.status === 404)
          {
              history('/');
          }
      });

  }, []);

  const [image, setImage] = useState('');
  const [bio, setBio] = useState('');
  const [picture, setPicture] = useState([]);
  const [errors, setErrors] = useState('');
  const [flip, setFlip] = useState(false);

  const handleChangeImage = () => {
    setFlip(true);
  }

  useEffect(() => {
    if(flip == true) {
      const formData = new FormData();
      formData.append('image', picture.image);

      axios.post(`http://localhost:8000/api/edit-image/${localStorage.getItem('auth_id')}`, formData).then(res => {
          if(res.data.status === 200) {
              localStorage.setItem('auth_image', res.data.image);
              setFlip(false);
              window.location.reload();
          }
          else if(res.data.status === 422) {
              alert(res.data.validate_err);
              setFlip(false);
          }else {
            alert('Problem');
            setFlip(false);
          }
      });
    }
  });

  const [isImg, setIsImg] = useState(true);

  useEffect(() => {
      if(userProfile.image == 'default.jpg') {
          setIsImg(false);
      }
  })

  const logout = () => {
    localStorage.clear();
    history('/');
    window.location.reload();
  }

  const [clsName, setClsName] = useState('disapear');
  const [clsName2, setClsName2] = useState('');

  const openSettings = () => {
    setClsName('');
    setClsName2('blur');
  }

  const cancel = () => {
    setClsName('disapear');
    setClsName2('');
  }

  let CryptoJS = require("crypto-js");
  const tk = userProfile.token;
  let dtk = CryptoJS.AES.decrypt(tk, 'my-secret-token');

  if(localStorage.getItem('auth_id') === id) {
  return (
    <div>
      <div className="block-center">
      <div className={clsName}>
      <div className="block-settings">
        <div><br/>
          <Link to="/accounts/password/change/"><div className="text-settings">Сменить пароль</div></Link>
          <hr/>
          <Link to="/accounts/privacy_and_security/"><div className="text-settings">Конфиденциальность и безопасность</div></Link>
          <hr/>
          <div className="text-settings" onClick={logout}>Выйти</div>
          <hr/>
          <div onClick={cancel} className="text-settings">Отмена</div>
        </div>
      </div>
      </div>
      </div>

    <div className={"profile " + clsName2}>
      <input type="file" onInput={handleChangeImage} className="input input__file" id="input__file" name="image" onChange={(e) => setPicture({image: e.target.files[0]})} /><br/>
      <label for="input__file">
      {isImg == true ? <img className="avatarka" src={'/uploads/profiles/'+userProfile.image} width="150" height="150" /> :
      <img className="avatarka" src={'/uploads/default/'+userProfile.image} width="150" height="150" />}
      </label>
      <div className="blockInfo">
        <div className="profile-username">{userProfile.username}</div>
        <Link to={"/accounts/edit/"}><button className="to-edit-profile">Редактировать профиль</button></Link>
        <AiOutlineSetting className="icons" onClick={openSettings} /><br/><br/>
        <div className="profile-name">{userProfile.name}</div>
        <div className="profile-bio">{userProfile.bio}</div>
      </div>
    </div>
    <hr className="hr" />
    </div>
  );
  }
  else {
    if(userProfile.closed != 'true') {
    return (
      <div>
      <div className="profile">
        {isImg == true ? <img className="avatarka" src={'/uploads/profiles/'+userProfile.image} width="150" height="150" /> :
        <img className="avatarka" src={'/uploads/default/'+userProfile.image} width="150" height="150" />}
        <div className="blockInfo">
          <div className="profile-username">{userProfile.username}</div>
          <button className="subsrcibe">Подписаться</button><br/><br/>
          <div className="profile-name">{userProfile.name}</div>
          <div className="profile-bio">{userProfile.bio}</div>
        </div>
      </div>
      <hr className="hr" />
      </div>
    );
    }else {
      return (
        <div>
      <div className="profile">
        {isImg == true ? <img className="avatarka" src={'/uploads/profiles/'+userProfile.image} width="150" height="150" /> :
        <img className="avatarka" src={'/uploads/default/'+userProfile.image} width="150" height="150" />}
        <div className="blockInfo">
          <div className="profile-username">{userProfile.username}</div>
          <button className="subsrcibe">Подписаться</button><br/><br/>
          <div className="profile-name">{userProfile.name}</div>
          <div className="profile-bio">{userProfile.bio}</div>
        </div>
        <h3>Закрытый аккаунт</h3>
      </div>
      <hr className="hr" />
      </div>
      );
    }
  }
}

export default Profile;
