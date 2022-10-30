import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import '../css/auth.css';
import axios from 'axios';
import {AiOutlineSetting} from 'react-icons/ai';
import Followers from './Followers';

const Profile = (props) => {
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


  // Getting information about the users

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


  // Change the image profile

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


  // Get Followers

  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
      axios.get(`http://localhost:8000/api/users`).then( res => {
          if(res.data.status === 200)
          {
            setUsers(res.data.users);
          }
          else if(res.data.status === 404)
          {
            history('/');
          }
      });

      axios.get(`http://localhost:8000/api/followers/`).then( res => {
      if(res.data.status === 200)
      {
        setFollowers(res.data.followers);
      }
      else if(res.data.status === 404)
      {
        history('/');
      }
    });

  }, []);
  
  
  let counter = 0;
  let str = String(counter);

  let viewMap = followers.map((item, index) => {
    if(id == item.user_id) {
      return (
        <div key={item.id}>
          {
            users.map((el, index) => {
              if(item.follower_id === el.id) {
                counter++;
                return (
                  <div key={el.id}>{el.username}</div>
                )
              }
            })
          }
        </div>
      )
    }
  });

  if(counter > 9999) counter = str[0]+str[1] + 'K'; 
  if(counter > 99999) counter = str[0]+str[1]+str[2] + 'K'; 
  if(counter > 999999) counter = str[0] + 'M'; 
  if(counter > 9999999) counter = str[0] + str[1] + 'M'; 
  if(counter > 99999999) counter = str[0] + str[1] + str[2] + 'M'; 


  // Follow on user

  const [textBtnFollow, setTextBtnFollow] = useState('Подписаться');
  const [follower_id, setFollowerId] = useState(localStorage.getItem('auth_id'));
  const [user_id, setUserId] = useState(id);

  const handleToFollow = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('follower_id', follower_id);
    formData.append('user_id', user_id);

    axios.post('http://localhost:8000/api/tofollow', formData).then(res => {
        if(res.data.status === 200) {
          window.location.reload();
        }
        else {
          console.log(res.data.validation_errors);
        }
    });
  }


  // Logout

  const logout = () => {
    localStorage.clear();
    history('/');
    window.location.reload();
  }


  // Open/Close the Settings

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


  // Decrypt the token

  let CryptoJS = require("crypto-js");
  const tk = userProfile.token;
  let dtk = CryptoJS.AES.decrypt(tk, 'my-secret-token');

  if(localStorage.getItem('auth_token') == dtk.toString(CryptoJS.enc.Utf8) && localStorage.getItem('auth_id') == id) {
  return (
    <div>
      
      <Followers followers={viewMap} />

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
      <label htmlFor="input__file">
      {isImg == true ? <img className="avatarka" src={'/uploads/profiles/'+userProfile.image} width="150" height="150" /> :
      <img className="avatarka" src={'/uploads/default/'+userProfile.image} width="150" height="150" />}
      </label>
      <div className="blockInfo">
        <div className="profile-username">{userProfile.username}</div>
        <Link to={"/accounts/edit/"}><button className="to-edit-profile">Редактировать профиль</button></Link>
        <AiOutlineSetting className="icons" onClick={openSettings} /><br/><br/>

        <div className="CountersBlock">
          <div className="counter_text"><b>345</b> публикаций</div>
          <div className="counter_text"><b>{counter}</b> подписчиков</div>
          <div className="counter_text"><b>500</b> подписок</div>
        </div>

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

      <div>{counter}</div>
      <Followers followers={viewMap} />

      <div className="profile">
        {isImg == true ? <img className="avatarka" src={'/uploads/profiles/'+userProfile.image} width="150" height="150" /> :
        <img className="avatarka" src={'/uploads/default/'+userProfile.image} width="150" height="150" />}
        <div className="blockInfo">
          <div className="profile-username">{userProfile.username}</div>
          <form method="post">
            <button onClick={handleToFollow} className="subsrcibe">{textBtnFollow}</button><br/><br/>
          </form>
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
          <div>{counter}</div>
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
