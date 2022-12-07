import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import './App.css';
import './css/style.css';
import ReactDOM from 'react-dom';
import {
AiOutlineHome, AiFillHome,
AiOutlineMessage, AiFillMessage,
AiOutlinePlusCircle, AiFillPlusCircle,
AiOutlineCompass, AiFillCompass,
AiOutlineHeart, AiFillHeart} from 'react-icons/ai';
import Login from './auth/Login';
import Register from './auth/Register';
import Profile from './auth/Profile';
import EditProfile from './auth/EditProfile';
import ChangePassword from './auth/ChangePassword';
import Privacy from './auth/Privacy';
import AddPost from './posts/AddPost';
import Main from './components/Main';
import Post from './posts/Post';
import PostsUser from './auth/posts/PostsUser';
import LikesPost from './auth/posts/LikesPost';
import Explore from './components/Explore';
import Notification from './components/Notification';

const App = () => {

  // Protection against XSS attacks
  const [id, setId] = useState(localStorage.getItem('auth_id'));

  let CryptoJS = require("crypto-js");
  const [token, setToken] = useState(''); 
  
  useEffect(() => {
    axios.get(`http://localhost:8000/api/profile/${id}`).then( res => {
      if(res.data.status === 200)
      {
        setToken(res.data.user.token);
      }
      else if(res.data.status === 404)
      {
        console.log(404);
      }
    });
  }, [id, token])

  let tk = token;
  let dtk = CryptoJS.AES.decrypt(tk, 'my-secret-token');
  
  // Add Post && Notification
  
  const [clsName, setClsName] = useState('disapear');
  const [blurPage, setBlurPage] = useState('');
  const [notification, setNotification] = useState('disapear');

  const cancel = () => {
    if(clsName == '') { 
      setClsName('disapear');
      setBlurPage('');
    }
    if(notification == '') {
      setNotification('disapear');
      setBlurPage('');
    }
  }


  let AuthToken = '';

  const [image, setImage] = useState(localStorage.getItem('auth_image'));

  const [isImg, setIsImg] = useState(true);

  useEffect(() => {
    if(image == 'default.jpg') {
      setIsImg(false);
    }

    if(clsName == '') {
      setBlurPage('blur');
    }
  }, [image, clsName])

  if(!localStorage.getItem('auth_token')) {
    AuthToken = (
      <div>
          <Routes>
             <Route path="/" element={<Login />} />
          </Routes>
          <Routes>
             <Route path="/register" element={<Register />} />
          </Routes>
      </div>
    )
  } else if(localStorage.getItem('auth_token') == dtk.toString(CryptoJS.enc.Utf8)){
    AuthToken = (
    <div>
      <div className={blurPage}>
        <div className="head">
        <header className="header"> 
            <Link to="/"><div className="DIO">DIO</div></Link>
            <input type="text" id="sch" placeholder="🔍 Поиск" className="schInput" />
            <div className="iconsBlock">
            <Link to="/"><AiOutlineHome className="icons"/></Link>
            <Link to="/direct/inbox/"><AiOutlineMessage className="icons" /></Link>
            <AiOutlinePlusCircle className="icons" onClick={() => setClsName('')} />
            <Link to="/explore"><AiOutlineCompass className="icons" /></Link>
            <span onClick={() => {setNotification(''); setBlurPage('blur');}}><AiOutlineHeart className="icons" /></span>
            <Link to={"/profile/"+localStorage.getItem('auth_id')}>
            {isImg == true ? <img src={'/uploads/profiles/'+image} className="icons imgicon" /> :
            <img src={'/uploads/default/'+image} className="icons imgicon" />}
            </Link>
            </div>
        </header>
        </div>
        <Routes>
          <Route path="/accounts/edit" element={<EditProfile />} />
          <Route path="/accounts/password/change/" element={<ChangePassword />} />
          <Route path="/accounts/privacy_and_security/" element={<Privacy />} />
          <Route path="/" element={<Main />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/profile/:id" element={<PostsUser />} />
          <Route path="/profile/:id/likes" element={<LikesPost />} />
        </Routes>
      </div>

      {/* Add Post */}
      <div className={clsName}><AddPost cancel={cancel} /></div>

      {/* Notification */}
      <div className={notification}><Notification cancel={cancel} /></div>
    </div>
    )
  }else {
    return (
      <div></div>
    )
  }
  
  return (
    <div className="App">
      <Router>
        {AuthToken}
      </Router>
    </div>
  );
}

export default App;

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
}