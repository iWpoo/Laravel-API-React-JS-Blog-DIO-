import react, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import '../css/auth.css';
import axios from 'axios';

const Profile = () => {
  const history = useNavigate();
  const [userProfile, setUser] = useState({
      username: '',
      name: '',
      bio: '',
      image: '',
      token: '',
  });

  const [picture, setPicture] = useState([]);

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

  const [isImg, setIsImg] = useState(true);

  useEffect(() => {
      if(userProfile.image == 'default.jpg') {
          setIsImg(false);
      }
  })

  let CryptoJS = require("crypto-js");
  const tk = userProfile.token;
  let dtk = CryptoJS.AES.decrypt(tk, 'my-secret-token');

  if(localStorage.getItem('auth_id') === id) {
  return (
    <div>
    <div className="profile">
      {isImg == true ? <img className="avatarka" src={'/uploads/profiles/'+userProfile.image} width="150" height="150" /> :
      <img className="avatarka" src={'/uploads/default/'+userProfile.image} width="150" height="150" />}
      <div className="blockInfo">
        <div className="profile-username">{userProfile.username}</div>
        <Link to={"/accounts/edit/"}><button className="to-edit-profile">Редактировать профиль</button></Link><br/><br/>
        <div className="profile-name">{userProfile.name}</div>
        <div className="profile-bio">{userProfile.bio}</div>
      </div>
    </div>
    <hr className="hr" />
    </div>
  );
  }
  else {
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
  }
}

export default Profile;
